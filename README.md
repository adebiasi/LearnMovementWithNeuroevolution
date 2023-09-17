# LearnMovementWithNeuroevolution
This project is inspired by the video [Coding Challenge #100: Neuroevolution Flappy Bird](https://www.youtube.com/watch?v=c6y21FkaUqw). 

## Project goal
The goal is to teach the robot how to reach a specific target, using the neuroevolution. 

## Robot body
The robot is composed by the main body (the big circle) connected by a segment to the hook (the small circle). The body and the hook can have two states: free and blocked. 
The robot can rotate (in both directions) pivoting on the blocked part, given that the other part is free.

![Alt Text](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/RobotMovement.gif)


This is not enough. The robot brain needs information about the position of the target. To do so, the robot has a visual sensor that sends a signal if the target is inside its field of view. The sensor can have two states: detected, not_detected.

![IMAGE - robot sensor
](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/RobotEye.gif)

## Robot brain

To achieve the goal, the robot brain takes as input the current state of the robot, that is the state of the body, the state of the hook, and the state of the visual sensor. As output the possible next actions to achieve the goal: switch the state of the body, switch the state of the hook, clockwise rotation, couter-clockwise rotation. 
All inputs and outputs are booleans.

The robot brain is a simple neural network with 3 input nodes, 3 hidden nodes, and 4 output nodes.

## Training

The population is composed by 2000 robots. Each one has random weights associated to its neural network.
Every generation has to reach a random target position.
After N steps the algorithm selects the best robots to for the next generation. Some mutations to the weights may occur.

## Moving robot
This is the best robot selected after 20 generations:
![IMAGE - final
](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/finalTraining.gif)

Sometime the process does not produce a goot result:
![IMAGE - intermediate
](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/intermediateTraining.gif)

It is interesting to see how the moving style of the robot changes if the vision sensor is rotated during the training.
![IMAGE - fronteye
](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/frontEye.gif)
## Next steps
- [x] Try different neural network configurations (different number of hidden nodes)
- [ ] Try different settings of the eyes.
     - [ ] Number of eyes
     - [ ] position
     - [x] orientation
- [ ] What if the previous state attributes are added to the input of NN?
- [ ] Use genetic algorithms to vary the body of the robot (length, rotation speed) 
    - [ ] ... include some handicap gene: only clockwise rotation
- [ ] Visualize the neural network as graph 
- [ ] For the best robot show all the pairs input-output of the NN in a tabular form
