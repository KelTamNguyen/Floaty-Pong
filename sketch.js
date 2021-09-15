// Declare a "SerialPort" object
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
const portName = 'COM7';
let ball;
let pipes = [];
let mode;
let isRunning = false;
const soundtrack = ["ivy_league.mp3", "city girl winter fields (feat. mklachu).mp3", "fengqing wanzhong (instrumental).mp3"];
var player;
let playing;
let isPlaying = true;
let colors = ['#edffec', '#f6dfeb', '#fed049'];
let press2Start2P;
const pauseFX = new Tone.Player('Super Mario Bros.-Pause Sound Effect.mp3').toDestination();
let gameIsOver = false;
let score = 0;

function preload(){
    //player = new Tone.Player("./soundtrack/" + random(soundtrack)).toDestination();
    press2Start2P = loadFont('PressStart2P-Regular.ttf');
    playing = random(soundtrack);
    player = new Tone.Player(playing).toDestination();
    player.loop = true;
    player.autostart = true;
    console.log("Now Playing: " + playing);
}

function setup() {
  createCanvas(windowWidth, windowHeight - 10);

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open(portName);

  // Here are the callbacks that you can register
  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  serial.on('close', gotClose);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);

  ball = new Ball();
  pipes.push(new Pipe(random(colors)));

  //initial game state
  mode = 0;
}

function draw() {
  // background('#063364');
  // let altitude = map(latestData, 0, 1023, 0, windowHeight);
  // text(latestData, 10, 10);
  // fill('#fbe0c4');
  // ellipse(50, altitude, 20, 20);
  // Polling method
  /*
  if (serial.available() > 0) {
  let data = serial.read();
  ellipse(50,50,data,data);
}
*/

  if (mode === 0) {
    background('#063364');
    textSize(80);
    pipes = [];
    fill('#FEF2BF');
    textFont(press2Start2P);
    textAlign(CENTER);
    text('Floaty Pong', windowWidth/2, (windowHeight - 10)/2 - 35);
    textSize(30);
    if(frameCount % 60 < 30) {
      //fill(255);
      textAlign(CENTER);
      textFont(press2Start2P);
      text('Press Start', windowWidth/2, windowHeight - 200);
    } else {
      fill('#063364');
      textAlign(CENTER);
      textFont(press2Start2P);
      text('Press Start', windowWidth/2, windowHeight - 200);
    }
  }
  else if (mode === 1) {
    background('#8ab6d6');
    //frameCount /= 60;
    if(!isRunning) {
      textSize(30);
      textAlign(CENTER, CENTER);
      textFont(press2Start2P);
      fill('#caf7e3');
      text("PAUSED", windowWidth/2, (windowHeight - 10)/2);
      if (isPlaying) {
        player.stop();
        isPlaying = false;
      }
    }

    if (isRunning && !isPlaying) {
      player.start();
      isPlaying = true;
    }

    let altitude = map(latestData, 0, 1023, 0, windowHeight);
    //text("Height:" + latestData, 50, 30);
    fill('#f6dfeb');
    text('Score:' + score, 125, 50);

    ball.show(altitude);
  
    if (frameCount % 80 == 0) {
      pipes.push(new Pipe(random(colors)));
    }
  
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].show();

      if (isRunning) {
        pipes[i].scroll();
      }
  
      if (pipes[i].hits(ball)) {
        fill('red');
        textSize(30);
        text('GAME OVER', windowWidth/2, (windowHeight - 10)/2);
        text('Score:' + score, windowWidth/2, (windowHeight - 10)/2 + 50);
        gameIsOver = true;
        noLoop();
      }
  
      if (pipes[i].isOffScreen()) {
        pipes.splice(i,1);
        score += 100;
        console.log(score);
        //console.log(pipes.length);
      }
    }
  }
}

function keyPressed() {
  switch(keyCode){
    case 32:
      ball.jump();
      break;
    case 13:
      pauseFX.start();
      if (!gameIsOver) {
        mode = 1;
        isRunning = !isRunning;
        if (isRunning == false) {
          //ball.pause();
          noLoop();
        }
        else {
          //ball.unpause();
          loop();
        }
      }
      else {
        mode = 0;
        isRunning = false;
        gameIsOver = !gameIsOver;
        loop();
      }
  }
}

// We are connected and ready to go
function serverConnected() {
  print("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  print("List of Serial Ports:");
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  print("Serial Port is Open");
}

function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  let currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  //console.log(currentString);             // print the string
  latestData = currentString;            // save it for the draw method
}

// We got raw from the serial port
function gotRawData(thedata) {
  print("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device