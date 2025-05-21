# LearnMovementWithNeuroevolution

This project is inspired by [Coding Challenge #100: Neuroevolution Flappy Bird](https://www.youtube.com/watch?v=c6y21FkaUqw) by Daniel Shiffman.

## 🚀 Project Goal

The objective is to train a robot to reach a target using **neuroevolution**—a combination of neural networks and genetic algorithms.

## 🤖 Robot Structure

The robot consists of:

- A **main body** (large circle)
- A **hook** (small circle)

These are connected by a segment. Both the body and the hook can be in two states:

- `free`
- `blocked`

The robot can rotate by pivoting around the blocked part, provided the other part is free.

![Robot Movement](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/RobotMovement.gif)

To effectively navigate toward the target, the robot is equipped with a **visual sensor**. This sensor detects whether the target is within its field of view and has two states:

- `detected`
- `not_detected`

![Robot Sensor](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/RobotEye.gif)

## 🧠 Robot Brain

The robot's brain is a simple neural network with:

- **3 input nodes**: state of the body, state of the hook, and state of the visual sensor
- **3 hidden nodes**
- **4 output nodes**: possible actions

All input and output values are boolean. The possible actions are:

- Toggle body state
- Toggle hook state
- Rotate clockwise
- Rotate counter-clockwise

## 🧬 Training via Neuroevolution

- **Population size**: 2000 robots
- Each robot starts with random neural network weights
- A new target is set each generation
- After a fixed number of steps, the top-performing robots are selected for reproduction
- Offspring may undergo **random mutations** to their neural weights

## 🎯 Results

Here’s the best-performing robot after 20 generations:

![Best Robot](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/finalTraining.gif)

Occasionally, the evolution does not yield a good result:

![Intermediate Training](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/intermediateTraining.gif)

It's also interesting to observe how movement strategies change when the visual sensor's orientation is modified:

![Front-Facing Eye](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/frontEye.gif)

## 🔮 Future Improvements

- [x] Try different neural network architectures (e.g. varying hidden node count)
- [ ] Experiment with visual sensor settings:
  - [ ] Number of eyes
  - [ ] Eye positioning
  - [x] Eye orientation
- [ ] Include previous state attributes as inputs to the neural network
- [ ] Apply genetic algorithms to evolve the robot’s physical traits (e.g. segment length, rotation speed)
  - [ ] Introduce constraints like one-directional rotation only
- [ ] Visualize the neural network as a graph
- [ ] Display the neural network’s input-output mapping in tabular form for the best robot

---

Feel free to fork the project or contribute ideas!

