

// Taken from "COM1008 'Lecture 12: Events' - Vita Lanfranchi"
// Gets user name
function askName() {
    var name = prompt("What is your name? ");
    output.innerHTML = "Welcome " + name;
    return name;
}

//Picks 3 random items from the array of pictures and pushes them to another array
//Once item is chosen, it is removed from the array to avoid repeats
function picSelect(pictures) {
    var chosenPics = [];
    for (let i = 0; i<3; i++) {
        pos = Math.floor(Math.random()*pictures.length);
        chosenPics.push(pictures[pos]);
        pictures.splice(pos, 1);
    }
    return chosenPics;
}

//Draws a star onto the canvas
function drawStar(context, star, chosenPics) {
    var check = false;
    context.strokeStyle = star.colour;
    context.lineWidth = "4";

    // Width minused so that a invisible box is created around the drawing
    star.x = Math.floor(Math.random()*WIDTH) - star.width/2;
    star.y = Math.floor(Math.random()*HEIGHT);

    // If there is an overlap with another item new co-ordinates are chosen for the item to be drawn
    // Also checks if teh drawing overlaps with screen boundary
    while (check != true) {
        newCoords = boundaryCheck(star.x, star.y, star.width, star.height);
        star.x = newCoords[0];
        star.y = newCoords[1];
        check = checkCoords(chosenPics, star.x, star.y, star.width, star.height, star.name);
        if (check == true) {
            break
        }
        else {
            star.x = Math.floor(Math.random()*WIDTH);
            star.y = Math.floor(Math.random()*HEIGHT);
        }
    }

    // Draws the lines onto the canvas 
    // The co-ordinates above act as a box around the drawing for comparisions with the other pictures
    // The co-ordinate is then altered so shape is drawn correctly
    star.x += star.width/2;

    // Draws the star
    context.beginPath();
        context.moveTo(star.x, star.y);
        context.lineTo(star.x+5,star.y+20);
        context.lineTo(star.x+18,star.y+20);
        context.lineTo(star.x+10,star.y+40);
        context.lineTo(star.x+15,star.y+60);
        context.lineTo(star.x,star.y+40);
        context.lineTo(star.x-15,star.y+60);
        context.lineTo(star.x-10,star.y+40);
        context.lineTo(star.x-18,star.y+20);
        context.lineTo(star.x-5,star.y+20);
    context.closePath();
    context.stroke();

    star.x -= star.width/2;
}

//Draws a triangle onto the canvas
function drawTriangle(context, triangle, chosenPics) {
    var check = false;
    context.strokeStyle = triangle.colour;
    context.lineWidth = "4";
    triangle.x = Math.floor(Math.random()*WIDTH);
    triangle.y = Math.floor(Math.random()*HEIGHT)-triangle.height;
    
    while ( check != true) {
        newCoords = boundaryCheck(triangle.x, triangle.y, triangle.width, triangle.height);
        triangle.x = newCoords[0];
        triangle.y = newCoords[1];
        check = checkCoords(chosenPics, triangle.x, triangle.y, triangle.width, triangle.height, triangle.name);

        if (check == true) {
            break
        }
        else {
            triangle.x = Math.floor(Math.random()*WIDTH);
            triangle.y = Math.floor(Math.random()*HEIGHT);
        }
    }
    
    //Co-ordinate altered for drawing and then returns to original to make a 'hit-box'
    triangle.y += triangle.height;

    // Draws the triangle
    context.beginPath();
        context.moveTo(triangle.x, triangle.y);
        context.lineTo(triangle.x+60, triangle.y);
        context.lineTo(triangle.x+30, triangle.y-triangle.height);
    context.closePath();
    context.stroke();

    triangle.y -= triangle.height;
}

// Loads the images which are in the chosenPics array
// If a drawing is selected the src is set to '#' so the length of array is correct
// Taken from "COM1008 'Lecture 13: Graphics and the Canvas' - Dr. Steve Maddock"
function loadImages(filenames, context, callback) {
    var myImages = new Array(filenames.length);
    for (var file=0; file<filenames.length; ++file) {
         if (filenames[file].name != "star" && filenames[file].name != "triangle") {
            myImages[file] = new Image();
            myImages[file].onload = function() {
                
                // Sets a time delay between each question to give image time to completly load
                setTimeout(function() {callback(context, myImages, filenames);}, 1000);
            }
            myImages[file].src = filenames[file].source;
        }
            
        else {
            myImages[file] = '#'
        }
    }
}

// Draws the images from the objects in the chosenPics array
// Also amended for my code and includes boundary checking and overlap checking functions
// Parts taken from "COM1008 'Lecture 13: Graphics and the Canvas' - Dr. Steve Maddock"
function draw(context, myImages, filenames) {
    for (var img=0; img<myImages.length; img++) {
        var check = false;
        var pic = filenames[img];

        // Checks if image is drawn or if it is a shape
        // Gets the random co-ordinates
        if (myImages[img] != '#' && myImages[img] != true) {
            pic.x = Math.floor(Math.random()*WIDTH);
            pic.y = Math.floor(Math.random()*HEIGHT);

            // Boundary returns the altered co-ordinates if the picture is off-screen
            while (check == false) {
                newCoords = boundaryCheck(pic.x, pic.y, pic.width, pic.height);
                pic.x = newCoords[0];
                pic.y = newCoords[1];

                check = checkCoords(filenames, pic.x, pic.y, pic.width, pic.height, pic.name); 
        
                // If there is an overlap new co-ordinates are chosen
                if (check == false) {
                    pic.x = Math.floor(Math.random()*WIDTH);
                    pic.y = Math.floor(Math.random()*HEIGHT);
                }

                else {
                    break
                }
            }
            context.drawImage(myImages[img], pic.x, pic.y, pic.width, pic.height);
            myImages[img] = true;
        }

        else {
            if (pic.name == "star" && myImages[img] != true) {
                drawStar(context, star, filenames);
                myImages[img] = true;
            }
            if (pic.name == "triangle" && myImages[img] != true) {
                drawTriangle(context, triangle, filenames);
                myImages[img] = true;
            }
        }
    }
}

// Makes sure that the picture/drawing will be entirely on screen
// Compares the items co-ordinates to screen boundaries and they are adjusted
// Returns the new co-ordinates
function boundaryCheck(x,y,width,height) {
    var boundCheck = false;
    while (boundCheck == false) {

        // Checks left
        if (x <= 0) {
            x += width;
        }

        // Checks right
        else if (x >= WIDTH - width) {
            x -= width;
        }

        // Checks top
        else if (y <= 0) {
            y += height;
        }

        // Checks bottom
        else if (y >= HEIGHT - height) {
            y -= height;
        }

        // Picture is entirely on the screen
        else {
            boundCheck = true;
            break
        }
    }
    return [x, y];
}

// Makes sure the images/drawings don't overlap
// Done by comparing the co-ordinates and the dimensions of the objects
// Returns false if there is an overlap
function checkCoords(chosenPics, x, y, w, h, n) {
    for (var pics = 0; pics<chosenPics.length; pics++) {
        if (n != chosenPics[pics].name) {

            // pic < x+w, pic > x, pic > y, pic < y+h
            if (chosenPics[pics].x <= x+w && chosenPics[pics].x >= x) {
                if (chosenPics[pics].y >= y && chosenPics[pics].y <= y+h) {
                    return false;
                }
                if (chosenPics[pics].y <= y && chosenPics[pics].y+chosenPics[pics].height >= y) {
                    return false;
                }
            }
            // pic < x, pic+w > x, pic < y, pic+h > y
            if (chosenPics[pics].x <= x && chosenPics[pics].x+chosenPics[pics].width >= x) {
                if (chosenPics[pics].y >= y && chosenPics[pics].y <= y+h) {
                    return false;
                }
                if (chosenPics[pics].y <= y && chosenPics[pics].y+chosenPics[pics].height >= y) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Resets the canvas
function clearCanvas() {
    context.clearRect(0, 0, 400, 400);
}

// Picks a random item chosen to be the 'question'
function getQuestion(chosenPics, name) {
    var question = chosenPics[Math.floor(Math.random()*chosenPics.length)];
    questionOutput.innerHTML = name + " click on the " + question.name;
    wait(question);
}

// Used to wait for user click before progressing
function wait(question) {
    canvas.addEventListener('click', function(e){getClick(e, question)});
}

// Gets and checks mouse click
function getClick(e, question) {
    var click = getMouseXY(e);
    var correct = checkClick(question, click);
    return correct;
}

// Gets mouse click position
// Taken from "COM1008 'Lecture 14: Canvas and Interaction' - Dr. Steve Maddock"
function getMouseXY(e) {
    var boundingRect = canvas.getBoundingClientRect();
    var offsetX = boundingRect.left;
    var offsetY = boundingRect.top;
    var w = (boundingRect.width-canvas.width)/2;
    var h = (boundingRect.height-canvas.height)/2;
    offsetX += w;
    offsetY += h;
    // use clientX and clientY as getBoundingClientRect is used above
    var mx = Math.round(e.clientX-offsetX);
    var my = Math.round(e.clientY-offsetY);
    return {x: mx, y: my}; 
}

// Checks if the user has clicked the right picture using the pictures dimensions
function checkClick(question, click) {
    var correct = false;
    if (click.x >= question.x && click.x <= question.x + question.width) {
        if (click.y >= question.y && click.y <= question.y + question.height){
            correct = true;
        }
        else {
            correct = false;
        }
    }
    else {
        correct = false;
    }
    displayResult(correct);
}


//Displays whether player got it right or wrong and adds to the score
function displayResult(correct) {
    if (correct == true) {
        score++;
        output.innerHTML = "Well done thats correct";
    }
    else {
        output.innerHTML = "Unlucky thats incorrect";
    }
    rounds ++;
    clearCanvas();
    main(score, rounds, name);
}

//Plays game once playbutton or resetbuttonis clicked
function playClick() {
    main(0, 0);
}

// Main Game Function
// Rounds is used as a counter to check if game is completed as the main function is recursive
// Involves nested functions
function main(score, rounds) {
    // Gets name
    if (rounds == 0) {
        var score = 0;
        var name = askName();
    }

    if (name == undefined) {
        name = ' ';
    }

    // Once the game is over
    if (rounds > 3) {
        if (score > 3) {
            score = 3;
        }
        output.innerHTML = "Well done " + name + "! You got " + score + " out of 3";
    }

    // Main game functions
    if (rounds < 3) {
        clearCanvas();
        var pictures = [star, triangle, cat, car, dog, banana];
        resetButton.addEventListener('click', playClick);
        var chosenPics = picSelect(pictures);
        loadImages(chosenPics, context, draw);
        getQuestion(chosenPics, name);
    }
}

// Setting variables
var canvas =  document.getElementById("game-screen");
var context = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Picture Objects
var star = {x: 0, y: 0, width: 40, height: 75, colour: "rgb(255,255,0)", name: 'star'};
var triangle = {x: 0, y: 0, width: 70, height: 85, colour: "rgb(255,0,0)", name: 'triangle'};
var cat = {x: 0, y: 0, width: 80, height: 120, source: 'img/cat.jpg', name: 'cat'};
var car = {x: 0, y: 0, width: 120, height: 100, source: 'img/car.jpg', name: 'car'};
var dog = {x: 0, y: 0, width: 80, height: 120, source: 'img/dog.jpg', name: 'dog'};
var banana = {x: 0, y: 0, width: 80, height: 80, source: 'img/banana.jpg', name: 'banana'};

// Getting HTML elements
var playButton = document.getElementById("play-button");
var resetButton = document.getElementById("reset-button");
var output = document.getElementById("output");
var questionOutput = document.getElementById("questions");

var correct = false;
var reset = false;
var score = 0;
var rounds= 0;

// Starts game when play button is clicked
playButton.addEventListener('click', playClick);

