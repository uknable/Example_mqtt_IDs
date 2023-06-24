/***********************************************************************
  IDEA9101 - WEEK 4 - Example 01 - Receiving MQTT

  Author: Luke Hespanhol
  Date: March 2022
***********************************************************************/
/*
	Disabling canvas scroll for better experience on mobile interfce.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23.
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/
document.addEventListener('touchstart', function(e) {
    document.documentElement.style.overflow = 'hidden';
});

document.addEventListener('touchend', function(e) {
    document.documentElement.style.overflow = 'auto';
});



//////////////////////////////////////////////////
//FIXED SECTION: DO NOT CHANGE THESE VARIABLES
//////////////////////////////////////////////////
var HOST = window.location.origin;
var socket;

////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - BEGIN: ENTER OUR CODE HERE
////////////////////////////////////////////////////
let xPos;
let yPos;
let colourRed;
let colourGreen;
let colourBlue;


function setup() {
	/////////////////////////////////////////////
	// FIXED SECION - START: DO NOT CHANGE IT
	/////////////////////////////////////////////
	createCanvas(windowWidth, windowHeight);

	setupMqtt();
	/////////////////////////////////////////////
	// FIXED SECION - END
	/////////////////////////////////////////////


	/////////////////////////////////////////////
	// ADD YOUR SETUP CODE HERE
	/////////////////////////////////////////////
	xPos = windowWidth/2;
	yPos = windowHeight/2;
	colourRed = 255;
	colourGreen = 255;
	colourBlue = 255;

	rectMode(CENTER);
}

function draw() {
    background(128);
    fill(colourRed, colourGreen, colourBlue);
    ellipse(xPos, yPos, 50, 50);
}


////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - END: ENTER OUR CODE HERE
////////////////////////////////////////////////////


////////////////////////////////////////////////////
// MQTT MESSAGE HANDLING
////////////////////////////////////////////////////
function setupMqtt() {
	socket = io.connect(HOST);
	socket.on('mqttMessage', receiveMqtt);
}

function receiveMqtt(data) {
	var topic = data[0];
	var message = data[1];
	console.log('Topic: ' + topic + ', message: ' + message);

	if (topic.includes('ideaIDs')) {
		walkerInfo = message.split(',');
        xPos = map(walkerInfo[0].trim(), -1, 1, 0, windowWidth);
        yPos = map(walkerInfo[1].trim(), -1, 1, 0, windowHeight);
		colourRed = walkerInfo[2].trim();
		colourGreen = walkerInfo[3].trim();
		colourBlue = walkerInfo[4].trim();
	}
}