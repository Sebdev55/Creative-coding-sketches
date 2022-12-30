const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math')
const random = require("canvas-sketch-util/random")
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  playbackRate: 'throttle',
  animate: true,
  fps: 5,
};

const params = {
  num: 1,
  radius: 0.3,
  range: 1,
  range2: 0.9,
  linewidth: 0.25,
  lineheight: 0,
  lineCap: 'round'
}


/* Funciones que importe de sketch-canvas-util */
//const degToRad = (degrees) => {
//  return degrees / 180 * Math.PI;
//}

//const randomRange = (min, max) => {
//  return Math.random() * (max - min) + min
//}
 
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const cx = width  * 0.5;
    const cy = height * 0.5;
    let x,y; 

    const w = width  * 0.01;
    const h = height * 0.1;    

    const fill = context.createLinearGradient(0, 0, width, height);
    // numero de figuras
    const num = params.num;
    // desde el centro hacia afuera
     //const radius = width * 0.3;
     const radius = width * params.radius;

    for (let i = 0; i < num; i++) {;
      const slice = math.degToRad(360 /num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      // Ancho y largo del random de las rayas
      const linewidth = params.linewidth
      const lineheight = params.lineheight
      context.scale(random.range(0.3, linewidth), random.range(0.1, lineheight));
      
      context.beginPath();
      // Color rayas
      const lineGradient = context.createLinearGradient(0, 0, 0, 170);
          lineGradient.addColorStop(0, "black");
          lineGradient.addColorStop(1, "#DAFDBA");
      context.fillStyle = lineGradient
      // forma de las rayas
      context.fillRect(-w * 0.5, random.range(0, -h * 2) , w, 300);
      context.fill() ;
      context.restore();
 
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      
      // random del ancho de los arcos
      context.lineWidth = random.range(5, 15);

      context.beginPath();
      // color de arcos
      context.lineCap = params.lineCap;

      const arcGradient = context.createLinearGradient(0, 0, 50, 170);
            arcGradient.addColorStop(0, "white")
            arcGradient.addColorStop(1, "#45C4B0")
      context.strokeStyle =  arcGradient;
      // forma del arco
      const range = params.range
      const range2 = params.range2
      context.arc(25, 15, radius * random.range(range, 1.0), slice * random.range(1, -5), slice * random.range(1, 5));
      context.stroke();
      context.restore();
      
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      
      // random grosor de lineas circulo central
      context.lineWidth = random.range(5, 10);

      context.beginPath();
      // color de lineas circulo central
      context.lineCap = params.lineCap;
      const arcGradient2 = context.createLinearGradient(0, 0, 50, 170);
            arcGradient2.addColorStop(0, "black")
            arcGradient2.addColorStop(1, "#13678A")
      context.strokeStyle = arcGradient2;
      context.arc(0, 0, radius * random.range(range2, 0.7 ), slice * random.range(1, -8), slice * random.range(1, 8));
      context.stroke();
      context.restore();


    } 
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid' });
  folder.addInput(params, 'lineCap', { options: { round: 'round', square: 'square'}})
  folder.addInput(params, 'num', { min: 2, max: 250, step: 0.5 });
  folder.addInput(params, 'radius', { min: 0.2, max: 0.8, step: 0.05 });
  folder.addInput(params, 'range', { min: 0, max: 3, step: 0.05 });
  folder.addInput(params, 'range2', { min: 0, max: 3, step: 0.05 });
  folder.addInput(params, 'linewidth', { min: 0, max: 1, step: 0.05 });
  folder.addInput(params, 'lineheight', { min: 0, max: 0.7, step: 0.05 });
}

createPane();
canvasSketch(sketch, settings);
