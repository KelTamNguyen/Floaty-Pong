class Ball{
    constructor(){
        this.y = 0;
        this.x = width/4;
        //this.gravity = 0.25;
        //this.velocity = 0;
        //this.lift = -10;
    }

    //Draws a Ball object into the P5.js canvas
    show(altitude) {
        fill('#fbe0c4');
        ellipse(this.x, altitude, 25, 25);
        this.y = altitude;
    }

}