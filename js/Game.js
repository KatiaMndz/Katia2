class Game {
  constructor() {


    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement ("h2");
    this.leader3 = createElement ("h2");

    this.resetTitle = createElement ("h2");
    this.resetButton = createButton("");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();


    Papitas = new Group();
    dineros = new Group();

    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.Cosas (Papitas, 4, papitasfotito, 0.02);
    this.Cosas (dineros, 11, dinero, 0.09);
    this.Cosas (obstacles,obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);
    

    form = new Form();
    form.display();

    car1 = createSprite(603.5, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(853.5, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    car3 = createSprite(width / 2 + 250, height - 100);
    car3.addImage("car3", car1_img);
    car3.scale = 0.07;

    cars = [car1, car2,car3];
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("reiniciar batalla campal");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200, 400);
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 + 230, 100);

    this.leaderBoardTitle.html("pollotabla de guerra");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width/3 - 60, 40);
    
    this.leader1.class("leadersText");
    this.leader1.position(width/3 - 50, 80);
    
    this.leader2.class("leadersText");
    this.leader2.position(width/3 - 50, 100);

    this.leader3.class("leadersText");
    this.leader3.position(width/3 - 50, 120);
  }

  play() {
    this.handleElements();
    this.BotonReset();
    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.show();

      //índice de la matriz
      var index = 0;
      for (var plr in allPlayers) {
        //agrega 1 al índice para cada bucle
        index = index + 1;

        //utilizar datos de la base de datos para mostrar los autos en las direcciones x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.agarrarDineros(index);
          this.agarrarPapitas(index);
          // Cambiar la posición de la cámara en la dirección y
          camera.position.x = width/2;
          camera.position.y = cars[index - 1].position.y;
        }
      }

      this.handlePlayerControls();
      const finishLine = height*6-100;
      if(player.positionY> finishLine){
        gameState= 2;
        player.rank +=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      this.showLife();
      this.showPapitas();
      drawSprites();
    }
  }

  handlePlayerControls() {
    // manejando eventos de teclado
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW)) {
      player.positionX -= 10;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW)) {
      player.positionX += 10;
      player.update();
    }
  }


  show (){
    var leader1;
    var leader2;
    var leader3;

    var players = Object.values(allPlayers);

    leader1 = players [0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    leader2 = players [1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    leader3 = players [2].rank + "&emsp;" + players[2].name + "&emsp;" + players[2].score;
  
    this.leader1.html(leader1);
    this.leader2.html(leader2);
    this.leader3.html(leader3);
  
  }

  BotonReset(){

    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsatend: 0

      })

      window.location.reload();
    })
  }

  Cosas(Group, number, image, scale, positions = []){

    for (var i=0; i< number; i++){

      var x;
      var y;

      if (positions.lenght>0){
        x = positions[i].x;
        y = positions[i].y;

        image = positions[i].image;
      }

      else {
        x = random (width/2+150, width/2-150);
        y = random (-height*4.5, height-400);
      }



      var sprites = createSprite (x, y);

      sprites.addImage("esprais", image);
      sprites.scale = scale;
      Group.add (sprites);


    }
  }

  agarrarPapitas(index){

    cars[index-1].overlap(Papitas, function (collector,collected){
      player.fuel = 185;
      collected.remove();

    });
  }

  agarrarDineros(index){
    cars[index-1].overlap(dineros, function (collector,collected){
      player.score += 25;
      player.update();

      collected.remove();

    });
    
  }

  showRank(){
    swal({
      title: "ganaste la batalla pollil, felicidades!!!!111!",

      text: "No pues felicidades otra vez wekjlfada",

      confirmButtonText: "picale aca polloganador"
    })
  }

  showLife(){
    push();
    image (patapollil, width/2+370, height-player.positionY-870,20,20);
    fill ("white");
    rect (width/2+400,height-player.positionY-870, 185,20);
    fill ("#fff563");
    rect (width/2+400,height-player.positionY-870, player.life,20);
    noStroke();
    pop();
  }

  showPapitas(){
    push();
    image (papitasfotito, width/2+370, height-player.positionY-800,20,20);
    fill ("white");
    rect (width/2+400,height-player.positionY-800, 185,20);
    fill ("#f3d0a1");
    rect (width/2+400,height-player.positionY-800, player.fuel,20);
    noStroke();
    pop();
  }
}


