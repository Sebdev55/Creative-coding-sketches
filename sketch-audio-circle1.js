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
  const numCircles = 9;
  const numSlices = 20;
  const slice = Math.PI * 2 / numSlices + 10;
  const radius = 25;

  const bins = [];
  const lineWidths = [];
  
  let lineWidth, bin, mapped; 


  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 128);
    if (random.value() > 0.5) bin = 0;
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 150 + 5;
    lineWidths.push(lineWidth);
  }

  
  return ({ context, width, height }) => {
    let myGradient = context.createLinearGradient(0, 0, 250, 500);
    myGradient.addColorStop(0, '#261501');
    myGradient.addColorStop(0.2, '#8C5511');
    myGradient.addColorStop(0.4, '#D9A23D');
    myGradient.addColorStop(0.7, '#F2CA50');
    myGradient.addColorStop(1, "#F2CA50");  

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);
    
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.strokeStyle = myGradient;

    let cradius = radius;
    
    for (let i = 0; i < numCircles; i++) {
      context.save();
      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];
        if (!bin) continue;

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        lineWidth = lineWidths[i] * mapped;
        if (lineWidth < 1) continue;

        context.lineWidth = lineWidth;
        //context.lineCap = 'round'
    
        context.beginPath();
        context.arc(0, 0, cradius + context.lineWidth * 0.5, 0, slice,);
        context.stroke();

      }
      cradius += lineWidths[i];

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
  //audio.src = 'audio/Blawan.mp3';
  audio.src = 'audio/Senki.mp3';
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

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();



