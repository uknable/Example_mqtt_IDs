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

class User {
    constructor(id) {
        this.xPos;
        this.yPos;
        this.colourRed;
        this.colourGreen;
        this.colourBlue;
        this.id = id; // used as a key for the 'users' object
        this.lastActive = 0; // used to determine when to remove from the 'users' object
    }

    display() {
        fill(this.colourRed, this.colourGreen, this.colourBlue);
        ellipse(this.xPos, this.yPos, 50, 50);
    }
}

// called when a message is received
// users[`${id}`] is used over dot notation so string interpolation can be used to find the key/value in the 'users' object
function updateUser(id, x, y, r, g, b) {
    users[`${id}`].xPos = map(x, -1, 1, 0, windowWidth);
    users[`${id}`].yPos = map(y, -1, 1, 0, windowHeight);
    users[`${id}`].colourRed = r;
    users[`${id}`].colourGreen = g;
    users[`${id}`].colourBlue = b;

    // set lastActive to current frameCount which will be checked to determine when this user is deleted
    users[`${id}`].lastActive = frameCount;
}

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

// new users will be stored in this 'users' object with their id as the key and class object as the value
let users = {};
const maxSessionTime = 300; // used to determine when to delete a user from the 'users' object

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

    // 'for...in' syntax is used to iterate over object key/value pairs
    for (const user in users) {
        // if the user was last updated more than 'maxSessionTime' frames ago
        //      then delete that user
        //      else, display that user
        if (frameCount - users[user].lastActive > maxSessionTime) {
            delete users[user];
        } else {
            users[user].display();
        }
    }
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
		let info = message.split(',');
        let userId = info[0];

        // if there is not a key within the 'users' object that matches the sender's userId
        //      then create a key/value pair in 'users'
        if (!Object.keys(users).includes(userId)) {
            users[`${userId}`] = new User(userId);
        }

        // use spread operator to apply each element of the array to the paramters of the 'updateUser' function
        updateUser(...info);
	}
}
