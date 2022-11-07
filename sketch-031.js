const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math')
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  playbackRate: 'throttle',
  animate: true,
  fps: 60
};

const params = {
  distance: 0,
}

const sketch = ({ context, width, height }) => {
  const agents = [];


  for (let i = 0; i < 100; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }


  return ({ context, width, height }) => {

    const Gradient = context.createLinearGradient(0, 0, 0, 1200);
          Gradient.addColorStop(0, "black");
          Gradient.addColorStop(1, "#231D40");

    context.fillStyle = Gradient;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);
        
        // distancia de reaccion
        const distance = params.distance
        if (dist > distance) continue;

        context.lineWidth = math.mapRange(dist, 0, 20, 5, 4);

        context.strokeStyle = "#9AEBA3"
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
    this.vel = new Vector(random.range(-1, 10), random.range(-1, 10));
    // dots size
    this.radius = random.range(1, 1);
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width)  this.vel.x *= -1; 
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y)
    
    // borde circulos
    context.lineWidth = 4;
    context.strokeStyle = "white";

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore(); 
  }
}

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid' });
  folder.addInput(params, 'distance', { min: 2, max: 350, step: 0.5 });
  //folder.addInput(params, 'num', { min: 5, max: 100, step: 0.5 });
}

createPane();

