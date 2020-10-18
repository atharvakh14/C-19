var trex, ground, invisibleGround, trexAnimation, groundAnimation, cloudAnimation, CloudGroup, score, OA1, OA2, OA3, OA4, OA5, OA6, ObstacleGroup, play, end, gameState, highScore, trexCollide, over, restart, overAnimation, restartB;

function preload() {
  trexAnimation =loadAnimation("trex1.png","trex3.png","trex4.png");
  groundAnimation = loadImage("ground2.png");
  cloudAnimation = loadImage("cloud.png");
  OA1 = loadImage("obstacle1.png");
  OA2 = loadImage("obstacle2.png");
  OA3 = loadImage("obstacle3.png");
  OA4 = loadImage("obstacle4.png");
  OA5 = loadImage("obstacle5.png");
  OA6 = loadImage("obstacle6.png");
  trexCollided = loadImage("trex_collided.png");
  overAnimation = loadImage("gameOver.png");
  restartB = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(70, 180, 20, 20);
  ground = createSprite(300, 180, 600, 300);
  trex.scale = 0.5;
  ground.addImage(groundAnimation);
  ground.x = ground.width/2;   
  ground.velocityX = -8;
  invisibleGround = createSprite(300, 190, 600, 10);
  invisibleGround.visible = false;
  CloudGroup = new Group();
  ObstacleGroup = new Group();
  score = 0;
  textSize(16);
  textFont("Georgia");
  textStyle(BOLD);
  play = 1;
  end = 0;
  gameState = play;
  over = createSprite(290, 80, 20, 20);
  restart = createSprite(290, 120, 20, 20);
  over.scale = 0.7;
  restart.scale = 0.7;
  over.visible = false;
  restart.visible = false;
  highScore = 0;
  trex.setCollider("circle", 0,0,40);
  trex.addAnimation("trexAnime", trexAnimation);
  trex.addAnimation("trexcollided", trexCollided);
}
function spawnClouds(){
  if(frameCount % 60 == 0){
    var cloud = createSprite(600, random(40, 120), 30, 30);                             
    cloud.velocityX = -2;
    cloud.addImage(cloudAnimation);
    cloud.scale = 0.65;
    /*console.log(cloud.depth);
    console.log(trex.depth);*/
    trex.depth = cloud.depth +1;
    cloud.lifetime = (600/3);
    CloudGroup.add(cloud);
  }
}
function spawnObstacles(){
  if(frameCount % 60 == 0){
    var cactus = createSprite(600, 168, 30, 30);
    cactus.velocityX = -10;
    var obcheck = Math.round(random(1,6));
    switch(obcheck){
      case 1: cactus.addImage(OA1); break;
      case 2: cactus.addImage(OA2); break;
      case 3:cactus.addImage(OA3);break;
      case 4:cactus.addImage(OA4);break;
      case 5:cactus.addImage(OA5);break;
      case 6:cactus.addImage(OA6);break;
      default: break;
    }
    cactus.scale = 0.5;
    cactus.lifetime = (600/10);
    //cactus.debug = true;
    ObstacleGroup.add(cactus);
  }
}
function reset(){
  over.visible = false;
  restart.visible =false;
  trex.changeAnimation("trexAnime", trexAnimation);
  ObstacleGroup.destroyEach();
  CloudGroup.destroyEach();
  gameState = play;
  score = 0;
  ground.velocityX = -8;
}

function draw() {
  background(255);
  drawSprites();
  over.addImage("overanime", overAnimation);
  restart.addImage("restartbutton", restartB);
  
  if(gameState == play){
  spawnClouds();
  spawnObstacles();
    if(ground.x<0){
    ground.x = ground.width/2;
  }
  trex.collide(invisibleGround);
  //console.log(trex.y);
  
  if((keyDown("up_arrow") || keyDown("space")) && trex.y>=161.5){
    trex.velocityY = -10;
  }
  trex.velocityY = trex.velocityY + 1;
  score=Math.round(score+getFrameRate()/60);
    if(trex.isTouching(ObstacleGroup)){
      gameState = end;
    }
  }
  else if(gameState == end){
    ground.velocityX = 0;
    trex.velocityY = 0;
    if(score>highScore){
      highScore = score;
    }
    trex.changeAnimation("trexcollided", trexCollided);
    ObstacleGroup.setVelocityXEach(0);
    CloudGroup.setVelocityXEach(0);
    ObstacleGroup.setLifetimeEach(-1);
    CloudGroup.setLifetimeEach(-1);
    over.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  text("SCORE: " +score, 400, 30);
  text("HI: " +highScore, 510, 30);
}