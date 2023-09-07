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

class Eye {
    constructor(fov, pos, angle) {
        this.fov = radians(fov);
        this.size = 12;
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

class Robot extends Creature {

    initBody(pos) {
        this.angle = random(0, 0);
        this.size = 20;
        this.eye = new Eye(35, pos, 0);
        this.pos = pos;
        this.startPos = pos;
        let lOffset = createVector(this.size / 2 * cos(this.angle), (this.size / 2) * sin(this.angle));
        this.lArmPos = p5.Vector.add(this.pos, lOffset);
        this.rArmPos = p5.Vector.sub(this.pos, lOffset);
        // this.targetFound = false;
        this.lArmState = false;
        this.rArmState = false;
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

        stroke(colors[this.brain.hidden_nodes - 1]);
        line(this.lArmPos.x, this.lArmPos.y, this.rArmPos.x, this.rArmPos.y);

        this.lArmState ? fill(255) : fill(0);
        circle(this.lArmPos.x, this.lArmPos.y, 5);

        this.rArmState ? fill(255) : fill(0);
        circle(this.rArmPos.x, this.rArmPos.y, 5);

        this.eye.draw(this.pos, this.angle);
    }

    //
    // drawEye(pos, angle, fov) {
    //     this.eye.targetFound ? fill(255) : fill(0);
    //
    //     let vertex2X = 12 * cos(PI / 2 - fov / 2);
    //     let vertex2Y = 12 * sin(PI / 2 - fov / 2);
    //     let vertex3X = 12 * cos(PI / 2 + fov / 2);
    //     let vertex3Y = 12 * sin(PI / 2 + fov / 2);
    //     push();
    //     translate(pos.x, pos.y);
    //     rotate(PI + angle);
    //     triangle(0, 0, vertex2X, vertex2Y, vertex3X, vertex3Y);
    //     pop()
    // }

    think() {

        // Now create the inputs to the neural network
        let inputs = [];
        let cmds = [false, false, false, false];


        // let angleToTarget = atan2(targetPos.y - this.pos.y, targetPos.x - this.pos.x) + PI;
        //
        // // Calcola la differenza di angolo
        // let angleDifference = angleToTarget - this.angle;
        // let normalizedAngle = (angleDifference % TWO_PI + TWO_PI) % TWO_PI;
        //
        // // inputs[0] = map(normalizedAngle, 0, TWO_PI, 0, 1);
        // // inputs[1] = +this.lArmState;
        // // inputs[2] = +this.rArmState;

        // inputs[0] = +(normalizedAngle > PI)
        inputs[0] = +(this.eye.targetFound)
        inputs[1] = +this.lArmState;
        inputs[2] = +this.rArmState;


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
            this.lArmState = !this.lArmState;
        }

        if (cmds[1]) {
            this.rArmState = !this.rArmState;
        }
        if (cmds[2]) {
            if ((this.lArmState && !this.rArmState) || (!this.lArmState && this.rArmState)) {
                this.angle += 0.5;
            }
        }
        if (cmds[3]) {
            if ((this.lArmState && !this.rArmState) || (!this.lArmState && this.rArmState)) {
                this.angle -= 0.5;
            }
        }


        if (this.lArmState && !this.rArmState) {
            this.rArmPos = createVector(this.size * cos(this.angle + PI), this.size * sin(this.angle + PI)).add(this.lArmPos);
            this.pos = p5.Vector.add(this.rArmPos, this.lArmPos).div(2);

        }
        if (!this.lArmState && this.rArmState) {
            this.lArmPos = createVector(this.size * cos(this.angle), this.size * sin(this.angle)).add(this.rArmPos);
            this.pos = p5.Vector.add(this.rArmPos, this.lArmPos).div(2);
        }

        this.eye.updateVision(this.pos, this.angle, targetPos);

    }


}