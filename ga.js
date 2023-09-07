// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&


// This file includes functions for creating a new generation
// of robots.

// Start the game over
function resetGame() {
  counter = 0;
}

// Create the next generation
function nextGeneration() {
  resetGame();
  // Normalize the fitness values 0-1
  normalizeFitness(allRobots);
  // Generate a new set of robots
  activeRobots = generate(allRobots);
  // Copy those robots to another array
  allRobots = activeRobots.slice();
}

// Generate a new population of robots
function generate(oldRobots) {
  let newRobots = [];
  for (let i = 0; i < oldRobots.length; i++) {
    // Select a robot based on fitness
    let robot = poolSelection(oldRobots);
    newRobots[i] = robot;
  }
  return newRobots;
}

// Normalize the fitness of all robots
function normalizeFitness(robots) {
  // Make score exponentially better?
  for (let i = 0; i < robots.length; i++) {
    robots[i].score = pow(robots[i].score, 2);
  }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < robots.length; i++) {
    sum += robots[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < robots.length; i++) {
    robots[i].fitness = robots[i].score / sum;
  }
}


// An algorithm for picking one robot from an array
// based on fitness
function poolSelection(robots) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= robots[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return robots[index].copy();
}