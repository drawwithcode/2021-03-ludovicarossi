//define variables
let starsNum = 300;
let stars = [];

let people = [];
let mySong;
let myData;

let personMinSize = 40;
let personMaxSize = 160;
let longestCareer = 0;

//upload external contents
function preload() {
  mySong = loadSound("./assets/hanszimmer.mp3");
  myData = loadJSON("./assets/peopleinspace.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < starsNum; i++) {
    stars.push(new Star());
  }

  for (let i = 0; i < myData.people.length; i++) {
    longestCareer = max(longestCareer, myData.people[i].careerdays);
  }

  let w = windowWidth / myData.people.length;
  for (let i = 0; i < myData.people.length; i++) {
    let person = new Person(myData.people[i], w / 2 + w * i, 0);
    people.push(person);
  }
}

//adapt the sketch to the screen
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  let w = windowWidth / people.length;
  for (let i = 0; i < people.length; i++) {
    people[i].x = w / 2 + w * i;
  }
}

function draw() {
  background(0, 60);
  if (mySong.isPlaying() === false) {
    textAlign(CENTER);
    textSize(45);
    textFont("Spectral");
    textStyle(ITALIC);
    fill("white");
    text("click here to play", width / 2, height / 10);
  }

  push();
  translate(width / 2, height / 2);
  for (const star of stars) {
    star.display();
  }
  pop();

  push();
  translate(0, height / 2);
  for (const person of people) {
    person.display();
  }
  pop();

  push();
  textAlign(CENTER);
  textSize(15);
  fill("white");
  textFont("Spectral");
  textStyle(ITALIC);
  text(
    "These are the astronauts currently involved on a space mission. The dimensions of the circles above them correspond to the amount of their career days.",
    windowWidth / 2,
    windowHeight - 30
  );
  pop();
}

function mouseClicked() {
  if (mySong.isPlaying() === false) {
    mySong.play();
  }
}

//define the Star class
class Star {
  //define constructor
  constructor() {
    this.x = random(-150, 150);
    this.y = random(-150, 150);
    //vmax
    this.maximumSpeed = random(10);
    //v0
    this.speed = 0;
  }

  //methods
  display() {
    stroke("white");
    //speed increasing factor
    this.speed += 0.05;
    //when speed reaches the maximum value
    this.speed = min(this.speed, this.maximumSpeed);
    strokeWeight(this.speed);
    point(this.x, this.y);
    this.move();
    this.restart();
  }

  move() {
    let acceleration = createVector(this.x, this.y);
    //convert the vector to one of radius 1
    acceleration.normalize();
    //assign a desired magnitude
    acceleration.mult(this.speed);
    //move x
    this.x += acceleration.x;
    //move y
    this.y += acceleration.y;
  }

  isOutside() {
    if (this.x < -width / 2 || this.x > width / 2) {
      return true;
    } else if (this.y < -height / 2 || this.y > height / 2) {
      return true;
    } else {
      return false;
    }
  }

  restart() {
    if (this.isOutside()) {
      //remove star from the array
      let i = stars.indexOf(this);
      stars.splice(i, 1);
      //generate a new star and add it to the array
      stars.push(new Star());
    }
  }
}

//define Person class
class Person {
  //define constructor
  constructor(person, x, y) {
    this.name = person.name;
    this.x = x;
    this.y = y;
    this.size =
      personMinSize +
      (personMaxSize - personMinSize) * (person.careerdays / longestCareer);
  }

  //methods
  display() {
    this.drawEllipse();
    this.drawName();
  }

  drawEllipse() {
    push();
    stroke("white");
    strokeWeight(10);
    ellipse(this.x, this.y, this.size);
    pop();
  }

  drawName() {
    push();
    textAlign(CENTER);
    textSize(20);
    fill("white");
    textFont("Spectral");
    textStyle(ITALIC);
    text(this.name, this.x, this.y + max(this.size, 30));
    pop();
  }
}
