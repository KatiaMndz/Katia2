var canvas;
var backgroundImage, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2,car3;
var cars = [];
var obstacle1Image, obstacle2Image;
var Papitas;
var dinero;

var obstacles;
var papitas;
var dineros;

var patapollil;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("../assets/car1.png");
  car2_img = loadImage("../assets/car2.png");
  track = loadImage("../assets/track.jpg");

  obstacle1Image = loadImage ("./assets/obstacle1.png");
  obstacle2Image = loadImage ("./assets/obstacle2.png");
  papitasfotito = loadImage ("./assets/fuel.png");
  dinero = loadImage ("./assets/goldCoin.png");

  patapollil = loadImage ("./assets/patapollil.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 3) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}