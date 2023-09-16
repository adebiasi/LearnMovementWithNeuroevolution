class Creature {

    constructor(pos, brain, generation) {

        this.initBody(pos);
        this.initBrain(brain);

        this.score = 0;
        this.fitness = 0;
        this.generation = generation;
        // console.log("gen: "+this.generation);
    }

    initBrain(brain) {
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(0.1);
        } else if (Array.isArray(brain)) {
            this.brain = new NeuralNetwork(brain[0], brain[1], brain[2]);
        }
    }

    initBody(pos) {
        throw new Error("initBody not implemented");
    }


    copy() {
        throw new Error("copy not implemented");
    }

    show() {
        throw new Error("show not implemented");
    }

    think() {
        throw new Error("think not implemented");
    }

    move(cmds, targetPos) {
        throw new Error("think not implemented");
    }

    calculateScore(targetPos) {
        let distance = this.pos.dist(targetPos);
        let startDistance = this.startPos.dist(targetPos);
        let localScore = Math.max(0, startDistance - distance);
        this.score = Math.max(this.score, localScore);

    }

}

const EYE_SIZE = 12;

class Eye {
    constructor(fov, pos, angle) {
        this.fov = radians(fov);
        this.size = EYE_SIZE;
        this.x1 = this.size * cos(PI / 2 - this.fov / 2);
        this.y1 = this.size * sin(PI / 2 - this.fov / 2);
        this.x2 = this.size * cos(PI / 2 + this.fov / 2);
        this.y2 = this.size * sin(PI / 2 + this.fov / 2);
        this.angle = angle;
        this.targetFound = false;
    }

    draw(robotPos, robotAngle) {
        this.targetFound ? fill(255) : fill(0);
        push();
        translate(robotPos.x, robotPos.y);
        rotate(PI + this.angle + robotAngle);
        triangle(0, 0, this.x1, this.y1, this.x2, this.y2);
        pop()
    }

    updateVision(robotPos, robotAngle, targetPos) {
        let absAngleToTarget = atan2(targetPos.y - robotPos.y, targetPos.x - robotPos.x) + PI;
        let absDirection = ((this.angle + robotAngle + PI / 2) % TWO_PI + TWO_PI) % TWO_PI;
        let angleDifference = absDirection - absAngleToTarget;
        let normalizedAngleDifference = (abs(angleDifference) % TWO_PI + TWO_PI) % TWO_PI;
        this.targetFound = (normalizedAngleDifference < this.fov / 2);
    }
}

const ROBOT_LENGTH = 40;

const EYE_FOV = 35;

const ROBOT_SIZE = 10;

const ARM_SIZE = 6;

const DELTA_ANGLE = 0.2;

class Robot extends Creature {

    initBody(pos) {
        this.angle = random(0, 0);
        this.length = ROBOT_LENGTH;
        // this.eye = new Eye(EYE_FOV, pos, -PI/2);
        this.eye = new Eye(EYE_FOV, pos, 0);
        this.pos = pos;
        this.startPos = pos;
        // this.armPos = createVector(this.size * cos(this.angle), (this.size) * sin(this.angle));
        this.robotState = false;
        this.armState = false;
        
        this.robotSize = ROBOT_SIZE
        this.armSize = ARM_SIZE
    }


    copy() {
        return new Robot(this.startPos, this.brain, this.generation + 1);
    }

    clone() {
        let clonedRobot = new Robot(this.startPos, this.brain, this.generation);
        clonedRobot.score = this.score;
        return clonedRobot;
    }

    show() {
        push()
        translate(this.pos.x, this.pos.y)
        this.robotState ? fill(255) : fill(0);
        circle(0, 0, this.robotSize);

        push()
        rotate(this.angle)
        stroke(colors[this.brain.hidden_nodes - 1]);
        line(0, 0, this.length, 0);

        push()
        translate(this.length, 0)
        this.armState ? fill(255) : fill(0);
        circle(0, 0, this.armSize);
        pop()
        pop()
        this.eye.draw(createVector(0, 0), this.angle);
        pop()
    }


    think() {

        // Now create the inputs to the neural network
        let inputs = [];
        let cmds = [false, false, false, false];


        inputs[0] = +(this.eye.targetFound)
        inputs[1] = +this.robotState;
        inputs[2] = +this.armState;


        // Get the outputs from the network
        let action = this.brain.predict(inputs);
        if (action[0] > 0.5) {
            cmds[0] = true;
        }
        if (action[1] > 0.5) {
            cmds[1] = true;
        }
        if (action[2] > 0.5) {
            cmds[2] = true;
        }
        if (action[3] > 0.5) {
            cmds[3] = true;
        }

        return cmds;
    }


    move(cmds, targetPos) {


        if (cmds[0]) {
            this.armState = !this.armState;
        }

        if (cmds[1]) {
            this.robotState = !this.robotState;
        }
        if (cmds[2]) {
            if ((this.robotState && !this.armState)) {
                this.angle += DELTA_ANGLE;
            }
            if (!this.robotState && this.armState) {
                let armPos = p5.Vector.add(this.pos, createVector(this.length * cos(this.angle), (this.length) * sin(this.angle)));
                this.angle += DELTA_ANGLE;
                this.pos = p5.Vector.add(armPos, createVector(this.length * cos(this.angle + PI), (this.length) * sin(this.angle + PI)));
            }
        }
        if (cmds[3]) {
            if (this.robotState && !this.armState) {
                this.angle -= DELTA_ANGLE;
            }
            if (!this.robotState && this.armState) {
                let armPos = p5.Vector.add(this.pos, createVector(this.length * cos(this.angle), (this.length) * sin(this.angle)));
                this.angle -= DELTA_ANGLE;
                this.pos = p5.Vector.add(armPos, createVector(this.length * cos(this.angle + PI), (this.length) * sin(this.angle + PI)));

            }
        }
        this.eye.updateVision(this.pos, this.angle, targetPos);
    }


}