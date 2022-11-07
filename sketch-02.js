const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math')
const random = require("canvas-sketch-util/random")

const settings = {
  dimensions: [ 1080, 1080 ]
};


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

    // numero de figuras
    const num = 200;
    // desde el centro hacia afuera
     const radius = width * 0.3;

    for (let i = 0; i < num; i++) {;
      const slice = math.degToRad(360 /num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      // Ancho y largo del random de las rayas
      context.scale(random.range(0.1, 1.2), random.range(0.2, 0.5));
      
      context.beginPath();
      // Color rayas
      context.fillStyle = 'white'
      // forma de las rayas
      context.fillRect(-w * 0.5, random.range(0, -h * 2) , w, 500);
      context.fill() ;
      context.restore();
 
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      
      // random del ancho de los arcos
      context.lineWidth = random.range(5, 15);

      context.beginPath();
      // color de arcos
      context.strokeStyle = 'white';
      // forma del arco
      context.arc(25, 15, radius * random.range(2, 1.0), slice * random.range(1, -5), slice * random.range(1, 5));
      context.stroke();
      context.restore();
      
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      
      // random grosor de lineas circulo central
      context.lineWidth = random.range(0.1, 10);

      context.beginPath();
      // color de lineas circulo central
      context.strokeStyle = 'white';
      context.arc(0, 0, radius * random.range(0.3, 0.7 ), slice * random.range(1, -8), slice * random.range(1, 8));
      context.stroke();
      context.restore();


    } 
  };
};

canvasSketch(sketch, settings);
