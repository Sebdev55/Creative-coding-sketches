const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 80; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }


  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        let myGradient = context.createRadialGradient(540, 540, 540, 540, 540, 90);
        myGradient.addColorStop(1, "white");
        myGradient.addColorStop(0.9, "#7EF28F");
        myGradient.addColorStop(0.4, "#150259");
        myGradient.addColorStop(0.3, "#0F0240");
        myGradient.addColorStop(0.1, "#090126");

        if (dist > 200) continue;

        context.lineWidth = math.mapRange(dist, 0, 200, 1, 5);
        context.lineCap = 'round';
        context.strokeStyle = myGradient;
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context); 
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y,) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 5), random.range(-1, 5));
    // circle size
    this.radius = random.range(1, 5);
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1; 
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y)
    
    context.lineWidth = 0;
    context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore(); 
  }
}

