# LearnMovementWithNeuroevolution

This project is inspired by [Coding Challenge #100: Neuroevolution Flappy Bird](https://www.youtube.com/watch?v=c6y21FkaUqw) by Daniel Shiffman.

## 🔍 PEAS Description – *LearnMovementWithNeuroevolution*

The objective is to train a robot to reach a target using **neuroevolution**—a combination of neural networks and genetic algorithms.

### 🏆 Performance
The agent’s performance is evaluated based on its ability to approach a target. The scoring mechanism rewards robots for reducing their distance from the target relative to their starting position. The greater the progress toward the target, the higher the score. Only the best (shortest) distance achieved during an episode is considered, meaning the robot is not penalized for temporarily moving away. This promotes exploratory behavior while still favoring efficient, directed movement.

### 🌍 Environment
The robot operates in a 2D continuous space. At the beginning of each generation, the robot starts at a fixed point, and a new target is randomly placed within the environment. There are no physical obstacles, but the robot's movement is constrained by internal mechanics—it can rotate only when one part (body or hook) is "blocked" and the other is "free." The environment remains consistent during a generation but changes with each new one due to target repositioning.

### 🦿 Actuators
The robot has four discrete actions it can perform:
- **Toggle body state**: Switch the body between ‘free’ and ‘blocked’
- **Toggle hook state**: Switch the hook between ‘free’ and ‘blocked’
- **Rotate clockwise**: Rotate the robot around the blocked part in a clockwise direction
- **Rotate counter-clockwise**: Rotate in the opposite direction

These actions allow the robot to “walk” by alternating states and rotating appropriately.

### 👁️ Sensors
The robot is equipped with a minimal sensor system:
- **Body and hook state sensors**: Detect whether each component is currently in the ‘free’ or ‘blocked’ state
- **Visual sensor**: Detects whether the target is within the robot's current field of view (binary: detected / not detected)

These sensors provide binary input to the robot's neural network, enabling it to make decisions based on its own configuration and the visibility of the goal.


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

