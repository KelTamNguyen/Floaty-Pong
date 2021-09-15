class Pipe {
    constructor(color) {
        this.color = color;
        this.top = random(height - 100);
        //this.bottom = random(height/2);
        this.bottom = this.top + 100;
        this.x = width;
        this.pipeWidth = 30;
        this.speed = 5;
        this.collisionFlag = false;
    }

    //Draw a pipe obstacle into P5.js's canvas
    show() {
        fill(this.color);
        if (this.collisionFlag === true) {
            fill(255, 0, 0);
        }
        rect(this.x, 0, this.pipeWidth, this.top);
        rect(this.x, this.bottom, this.pipeWidth, height);
    }

    //Move the pipes
    scroll() {
        this.x -= this.speed;
    }

    //Return true if pipe has scrolled past the left edge of the canvas
    isOffScreen() {
        return this.x < this.pipeWidth;
    }

    //Collision Detection Function
    hits(ball) {
        if (ball.y < this.top || ball.y > this.bottom) {
            if (ball.x > this.x && ball.x < this.x + this.pipeWidth) {
                this.collisionFlag = true;
                //console.log(this.top, this.bottom);
                return true;
            }
        }
        this.collisionFlag = false;
        return false;
    }

    //Return true if ball goes past pipe
    isBehind(ball) {
        return ball.x > (this.x + this.pipeWidth);
    }

    //Handle paused state
    pause() {
        this.speed = 0;
    }
}