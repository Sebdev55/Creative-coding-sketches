const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;

const sketch = () => {
  const numCircles = 2;
  const numSlices = 2 ;
  const bins = [];

  
  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 16);
    if (random.value() > 0.5) bin = 0;
    bins.push(bin);
  }
  
  
  return ({ context, width, height }) => {
    context.fillStyle = '#042326';
    context.fillRect(0, 0, width, height);

    
    let myGradient = context.createLinearGradient(0, 0, 0, 500);
    myGradient.addColorStop(0, '#1D7373');
    myGradient.addColorStop(0.2, '#107361');
    myGradient.addColorStop(1, "#0A3A40");  
    
    if (!audioContext) return;
    
    analyserNode.getFloatFrequencyData(audioData);
    
    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];
      const mapped = math.mapRange(audioData[bin], analyserNode.minDecibels, analyserNode.maxDecibels, 0, 1, true);
      const radius = mapped * 500;
      
      context.save();
      context.translate(width * 0.5, height * 0.5);
      context.lineWidth = bin
      context.strokeStyle = myGradient;
      
      context.beginPath();
      context.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    };
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
  audio.src = 'audio/Bimbongo.mp3';

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  analyserNodesmoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

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