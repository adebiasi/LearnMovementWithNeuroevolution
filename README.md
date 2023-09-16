# LearnMovementWithNeuroevolution
This project is inspired by the video [Coding Challenge #100: Neuroevolution Flappy Bird](https://www.youtube.com/watch?v=c6y21FkaUqw). 

## Project goal
The goal is to teach the robot how to reach a specific target, using the neuroevolution. 

## Robot body
The robot is composed by the main body (the big circle) connected by a segment to the hook (the small circle). The body and the hook can have two states: free and blocked. 
The robot can rotate (in both directions) pivoting on the blocked part, given that the other part is free.

![Alt Text](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/RobotMovement.gif)


This in not enough. The robot brain needs information about the position of the target. To do so, the robt has a visual sensor that sends a signal if the target is inside its field of view. The sensor can have two states: detected, not_detected.

![IMAGE - robot sensor
](https://github.com/adebiasi/LearnMovementWithNeuroevolution/blob/main/imgs/RobotEye.gif)

## Robot brain

To achieve the goal, the robot brain takes as input the current state of the robot, that is the state of the body, the state of the hook, and the state of the visual sensor. As output the possible next actions to achieve the goal: switch the state of the body, switch the state of the hook, clockwise rotation, couter-clockwise rotation. 

The robot brain is a simple neural network with 3 input nodes, 3 hidden nodes, and 4 output nodes.

## Training

## Moving robot

## Next steps
- [ ] Try different neural network configurations (different number of hidden nodes)
- [ ] Try different settings (number, position, orientation) of the eyes.
- [ ] Think about the possibility to have a dedicated neural network only for the eyes: eyes data as input and (maybe) one output. The output is the input of the other neural network.
- [ ] What if the previous state attributes are added to the input of NN?
- [ ] Use genetic algorithms to vary the body of the robot (length, rotation speed) 
- [ ] ... include some handicap: only clockwise rotation
- [ ] visualize the neural network as graph 
- [ ] For the best robot show all the pairs input-output of the NN in a tabular form
