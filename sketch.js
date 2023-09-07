// How big is the population
let totalPopulation = 2000;
// All active robots (not yet collided with pipe)
let activeRobots = [];
// All robots for any given population
let allRobots = [];
let bestRobots;
let bestRobot;
// A frame counter to determine when to add a pipe
let counter = 0;

let target;
let mode;
let initPosition;
let numDiffCreatures = 8;
// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

let userCmds
let colors = [];

// Training or just showing the current best
// let runBest = false;
let runBestButton;
let trainButton;
let userButton;

let gif;
let recording = false;

function setup() {
    colors[0] = color(255);          // Bianco
    colors[1] = color(255, 0, 0);    // Rosso
    colors[2] = color(0, 255, 0);    // Verde
    colors[3] = color(0, 0, 255);    // Blu
    colors[4] = color(255, 255, 0);  // Giallo
    colors[5] = color(255, 0, 255);  // Magenta
    colors[6] = color(0, 255, 255);  // Ciano
    colors[7] = color(255, 165, 0);  // Arancione (sostituito il nero)

    let canvas = createCanvas(600, 400);
    canvas.parent('canvascontainer');
    initPosition = createVector(width / 2, height / 2);
    // Access the interface elements
    speedSlider = select('#speedSlider');
    speedSpan = select('#speed');
    framerateSlider = select('#framerateSlider');
    framerateSpan = select('#framerate');
    highScoreSpan = select('#hs');
    allTimeHighScoreSpan = select('#ahs');
    runBestButton = select('#best');
    runBestButton.mousePressed(bestMode);
    trainButton = select('#train');
    trainButton.mousePressed(trainMode);
    userButton = select('#user');
    userButton.mousePressed(userMode);
    userCmds = [false, false, false, false];
    bestRobots = new Array(numDiffCreatures);
    target = new Target();
    let targetDir = p5.Vector.fromAngle(TWO_PI * random());
    target.pos = p5.Vector.add(initPosition, targetDir.mult(300));

    mode = 2;
    // Create a population
    for (let i = 0; i < totalPopulation; i++) {
        let robot = new Robot(initPosition, [3, (i % numDiffCreatures) + 1, 4], 10);

        activeRobots[i] = robot;
        allRobots[i] = robot;
    }

    gif = new GIF({
        workers: 2,
        quality: 10,
    });
}

function colorToRgbString(p5Color) {
    let r = p5Color.levels[0];
    let g = p5Color.levels[1];
    let b = p5Color.levels[2];
    return `rgb(${r}, ${g}, ${b})`;
}

function keyPressed() {
    if (key === 'z') {
        userCmds[0] = true;
    }
    if (key === 'x') {
        userCmds[1] = true;
    }
    if (key === 'c') {
        userCmds[2] = true;
    }
    if (key === 'v') {
        userCmds[3] = true;
    }

    if (key === 'R' || key === 'r') {
        if (!recording) {
            console.log("START RECORDING")
            recording = true;
            // Inizia a registrare
        } else {
            console.log("STOP RECORDING")
            recording = false;
            // Ferma la registrazione e salva la GIF
            gif.on('finished', function (blob) {
                saveAs(blob, 'your_animation.gif');
            });
            gif.render();
        }
    }
}

function userMode() {
    mode = 0;
    userRobot = new Robot(initPosition, [3, 8, 4], 0);

}

function bestMode() {
    mode = 1;
    resetGame();
}

function trainMode() {
    mode = 2;
    target = new Target();
    nextGeneration();
}

function isUserMode() {
    return mode == 0;
}

function isBestMode() {
    return mode == 1;
}

function isTrainMode() {
    return mode == 2;
}

function saveBestCreatures() {

    // Which is the best robot?
    let tempBestRobots = new Array(numDiffCreatures);
    for (let i = 0; i < activeRobots.length; i++) {
        let n = activeRobots[i].brain.hidden_nodes;
        if (tempBestRobots[n - 1] == null) {
            tempBestRobots[n - 1] = activeRobots[i].clone();
        }
        if (bestRobots[n - 1] == null) {
            bestRobots[n - 1] = activeRobots[i].clone();
        }
        if (bestRobot == null) {
            bestRobot = activeRobots[i].clone();
        }
        if (activeRobots[i].score > tempBestRobots[n - 1].score) {
            tempBestRobots[n - 1] = activeRobots[i].clone();
            if (activeRobots[i].score > bestRobots[n - 1].score) {
                bestRobots[n - 1] = activeRobots[i].clone();
                if (activeRobots[i].score > bestRobot.score) {
                    bestRobot = activeRobots[i].clone();
                }
            }
        }
    }

    // Update DOM Elements
    let strTempHighScores = "";
    for (let i = 0; i < tempBestRobots.length; i++) {
        if (tempBestRobots[i] != null) {
            strTempHighScores += ("<span style='color: " + colorToRgbString(colors[i]) + ";'> Hidden nodes [" + (i + 1) + "]: " + tempBestRobots[i].score + ", gen: " + tempBestRobots[i].generation + " </span><br><br>");
        }
    }
    highScoreSpan.html(strTempHighScores);

    let n = bestRobot.brain.hidden_nodes;
    let strHighScores = "<span style='color: " + colorToRgbString(colors[(n - 1)]) + ";'>" + bestRobot.score + ", gen: " + bestRobot.generation + " </span><br><br>";
    for (let i = 0; i < bestRobots.length; i++) {
        if (bestRobots[i] != null) {
            strHighScores += ("<span style='color: " + colorToRgbString(colors[i]) + ";'> Hidden nodes [" + (i + 1) + "]: " + bestRobots[i].score + ", gen: " + bestRobots[i].generation + " </span><br><br>");
        }
    }
    allTimeHighScoreSpan.html(strHighScores);
}

function mouseClicked() {
    if (isBestMode()) {
        target.pos = createVector(mouseX, mouseY);
    }

}

function draw() {
    background(0);

    if (recording) {
        gif.addFrame(canvas, {delay: 100});
    }

    // Should we speed up cycles per frame
    let cycles = speedSlider.value();
    speedSpan.html(cycles);

    let frameR = framerateSlider.value();
    framerateSpan.html(frameR);
    frameRate(frameR);

    console.log("mode: " + mode)


    if (isBestMode()) {
        thinkAndMoveCreatures(bestRobots, target);
    } else if (isTrainMode()) {
        // How many times to advance the game
        for (let n = 0; n < cycles; n++) {
            thinkAndMoveCreatures(activeRobots, target);
            counter++;
        }
    } else if (isUserMode()) {
        target.pos = createVector(mouseX, mouseY);
        userRobot.move(userCmds, target.pos);

    }

    // Draw everything!
    target.show();
    if (isBestMode()) {

        showCreatures(bestRobots);
    } else if (isTrainMode()) {

        showCreatures(activeRobots);
        // If we're out of robots go to the next generation
        if (counter > 39) {
            calculateScores(activeRobots, target);
            saveBestCreatures();
            nextGeneration()
            let targetDir = p5.Vector.fromAngle(TWO_PI * random());
            target.pos = p5.Vector.add(initPosition, targetDir.mult(300));

        }
    } else if (isUserMode()) {
        showCreatures([userRobot]);

    }


    userCmds = [false, false, false, false];
}

function showCreatures(creatures) {
    for (let i = 0; i < creatures.length; i++) {
        if (creatures[i] != null) {
            creatures[i].show();
        }
    }
}

function thinkAndMoveCreatures(creatures, target) {
    for (let i = creatures.length - 1; i >= 0; i--) {
        let robot = creatures[i];
        if (robot != null) {
            let cmds = robot.think();
            robot.move(cmds, target.pos)
        }
    }
}

function calculateScores(creatures, target) {
    for (let i = 0; i < creatures.length; i++) {
        creatures[i].calculateScore(target.pos);
    }
}