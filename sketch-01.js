const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
};



const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = Math.random() * width * 0.02;

    const w   = width  * 0.10;
    const h   = height * 0.10;
    const gap = width  * 0.05;
    const ix  = width  * 0.20;
    const iy  = height * 0.20;
    
    const off = width  * 0.02;

    let x,y;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
          x = ix + (w + gap) * i;
          y = iy + (h + gap) * j;
        
          context.beginPath();
          context.strokeStyle = 'white';
          context.arc(x, y, 50, 0, 2 * Math.PI);
          context.stroke();
          
          if (Math.random() > 0.7) {
          context.beginPath();
          context.strokeStyle = 'darkred';
          context.arc(x, y, 25, 0, 2 * Math.PI);
          context.stroke(); 
        }
      }
    }   
  };
};

canvasSketch(sketch, settings);
