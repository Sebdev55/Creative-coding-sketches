const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

const sketch = () => {
  const numCircles = 16;
  const numSlices = 3;
  const slice = Math.PI * 2 / numSlices;
  const radius = 50;

  const bins = [];
  const lineWidths = [];
  const rotationOffsets = [];
  
  let lineWidth, bin, mapped, phi; 

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 128);
    bins.push(bin);
  }
  
  for (let i = 0; i < numCircles * numSlices; i++) {
    rotationOffsets.push(random.range(Math.PI * -0.25, Math.PI * 0.25) - Math.PI * 0.9)
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 50 + 10;
    lineWidths.push(lineWidth);
  }

  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);
    
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.scale(1, -1);
    context.lineCap = 'round';
    context.strokeStyle = 'black'; 

    let cradius = radius;

    let myGradient = context.createRadialGradient(0, 0, 0, 0, 0, 360);
        myGradient.addColorStop(0.2, "white");
        myGradient.addColorStop(0.6, "#DAFDBA");
        myGradient.addColorStop(1, "#45C4B0");
    
    for (let i = 0; i < numCircles; i++) {
      context.save();
      //context.rotate(rotationOffsets[i]);

      cradius += lineWidths[i] * 0.5 + 2;

      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        phi = slice * mapped;
        
        context.strokeStyle = myGradient;
        context.beginPath();
        context.arc(0, 0, cradius, 0, phi);
        context.stroke();
      }
      cradius += lineWidths[i] * 0.5;

      context.restore();
    }
    context.restore();
  };
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    }
    else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement('audio');
  //audio.src = 'audio/Senki.mp3';
  audio.src = 'audio/Sams.mp3';
  //audio.src = 'audio/Bimbongo.mp3';

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  analyserNodesmoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);

  // console.log(audioData.length);
};

const getAverage = (data) => {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }

  return sum / data.length;
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();