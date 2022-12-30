const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math')
const Tweakpane = require('tweakpane');


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const params = {
  cols: 2,
  rows: 3,
  scaleMin: 1,
  scaleMax: 100,
  freq: 0.00,
  amp: 0,
  frame: 0,
  animate: true,
  lineCap: 'round',
  
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);


    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width  * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width  - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    // First thingy bottom
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.5;
      const h = cellh * 0.5;

      const f = params.animate ? frame : params.frame; 

      //const n = random.noise2D(x + frame * 20,y, params.freq);
      const n = random.noise3D(x, y, f * 25, params.freq); 

      const angle = n * Math.PI * params.amp;  


      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x ,y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      context.strokeStyle = 'rgba(165, 191, 82  , 0.4)';
    

      context.beginPath();
      context.moveTo(w * -0.7, 0);
      context.lineTo(w *  0.7, 0);
      context.stroke();

      context.restore();
    }

    // Second thingy middle
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.5;
      const h = cellh * 0.5;

      const f = params.animate ? frame : params.frame; 

      //const n = random.noise2D(x + frame * 20,y, params.freq);
      const n = random.noise3D(x, y, f * 25, params.freq); 

      const angle = n * Math.PI * params.amp;  


      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x ,y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      context.strokeStyle = 'rgba(119, 178, 120, 0.9)';
    

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w *  0.5, 0);
      context.stroke();

      context.restore();
    }
  
    // Third thingy top
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.5;
      const h = cellh * 0.5;

      const f = params.animate ? frame : params.frame; 

      //const n = random.noise2D(x + frame * 20,y, params.freq);
      const n = random.noise3D(x, y, f * 25, params.freq); 

      const angle = n * Math.PI * params.amp;  


      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x ,y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      context.strokeStyle = 'rgba(29, 87, 46, 0.9)';
    

      context.beginPath();
      context.moveTo(w * -0.01, 0);
      context.lineTo(w *  0.01, 0);
      context.stroke();

      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid' });
  folder.addInput(params, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square'}})
  folder.addInput(params, 'cols', { min: 3, max: 50, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 1, max: 100});
  folder.addInput(params, 'scaleMax', { min: 1, max: 100});

  folder = pane.addFolder({ title: 'Noise' });
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01, step: 0.001 });
  folder.addInput(params, 'amp' , { min: 0, max: 1 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', { min: 0, max: 999 });
}






createPane();
canvasSketch(sketch, settings);
