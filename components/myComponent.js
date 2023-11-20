// music-visualizer-component.js
class MusicVisualizerComponent extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = `
    <style>
    
body {
}

#file-input {
  position: fixed;
  z-index: 3;
}

#canvas {
  position: absolute;
  padding-right : 40%;
  width: 1016px;
  justify-content: center;
  align-items: center;
  height: 55%;
  display: flex;
  padding-top: 5%;
}

audio {
  position: absolute;
  left: 500px;
  bottom: 50px;
  z-index: 3;
}

#name {
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 3;
  color: #eeeeee;
  font-family: monospace;
}

#background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-size: 100% 7px;
  animation: bg 1s infinite linear;
  z-index: 2;
  opacity: 0.3;
}

@keyframes bg {
  0%{ background-position: 0 0; }
  100%{ background-position: 8px 8px; }
}
    


    </style>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css" rel="stylesheet">
      <div class="box1">
        Welcome to media player
        <br>



      <input type="file" id="file-input" accept="audio/*,video/*,image/*" />
      <canvas id="canvas"></canvas>
      <h3 id="name"></h3>
      <audio id="audio" controls></audio>
      <div id="background"></div>
      <script src="music-visualizer-script.js"></script>







        <div class="audio-controls">
        
          <audio id="audio2" controls style="display: none;">
            <source src="./assets/audio/international-travel-113293.mp3" type="audio/mpeg">
            Votre navigateur ne supporte pas l'élément audio.
          </audio>

          <div class="media-controls">
            <div class="media-progress" id="mediaProgress"></div>
            <div class="media-thumb" id="mediaThumb"></div>
          </div>

          <button id="playButton">Play</button>
          <button id="pauseButton">Pause</button>
          <button id="stopButton">Replay</button>
          <button id="decreaseVolumeButton" class="btn btn-secondary">Volume -</button>
          <input type="range" id="volumeControl" min="0" max="1" step="0.1">
          <button id="increaseVolumeButton" class="btn btn-secondary">Volume +</button>
          <button id="muteButton" class="btn btn-secondary"><i class="bi bi-volume-up"></i></button>
          <button id="skipBackwardButton" class="btn btn-secondary">-5s</button>
          <button id="skipForwardButton" class="btn btn-secondary">+5s</button>
          <progress id="progressBar" value="0" max="100"></progress>

          <br>
          <label for="rateControl">Rate:</label>
          <input type="range" id="rateControl" min="0.2" max="3" step="0.1">

          <br>
          <label for="gainSlider">Gain:</label>
          <input type="range" min="0" max="1" step="0.01" value="1" id="gainSlider" />


          <div class="controls">
            <label for="rateControlOne">60Hz</label>
            <input type="range" id="soixante" value="0" step="1" min="-30" max="30"></input>
          <output id="gain0">0 dB</output>
          </div>
          <div class="controls">
            <label>170Hz</label>
            <input type="range" id="centSoixanteDix" value="0" step="1" min="-30" max="30"></input>
            <output id="gain1">0 dB</output>
          </div>
          <div class="controls">
            <label>350Hz</label>
            <input type="range" id="troisCentsCinquante" value="0" step="1" min="-30" max="30"></input>
            <output id="gain2">0 dB</output>
          </div>
          <div class="controls">
            <label>1000Hz</label>
            <input type="range" id="mille" value="0" step="1" min="-30" max="30"></input>
            <output id="gain3">0 dB</output>
          </div>
          <div class="controls">
            <label>3500Hz</label>
            <input type="range" id="troisMilleCinqCent" value="0" step="1" min="-30" max="30"></input>
            <output id="gain4">0 dB</output>
          </div>
          <div class="controls">
            <label for="dixMille">10000Hz</label>
            <input type="range" id="dixMille" value="0" step="1" min="-30" max="30"></input>
            <output id="gain5">0 dB</output>
          </div>
          
          <webaudio-knob id="knob1"
          src="./components/images/LittlePhatty.png" 
          value="1"
          step="0.1"
          min="0"
          max="1"
          diameter="64"
          tooltip="60 Hz">
          </webaudio-knob>
          
         

        
          

          </div>

      </div>






      
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const fileInput = this.shadowRoot.getElementById("file-input");
    const canvas = this.shadowRoot.getElementById("canvas");
    const h3 = this.shadowRoot.getElementById('name');
    const audio = this.shadowRoot.getElementById("audio");

    fileInput.onchange = function() {
      const files = this.files;
      console.log('FILES[0]: ', files[0]);
      audio.src = URL.createObjectURL(files[0]);
      const name = files[0].name;
      h3.innerText = `${name}`;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");

      const context = new AudioContext();
      let src = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 4096;//16384;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      console.log('DATA-ARRAY: ', dataArray);

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      console.log('WIDTH: ', WIDTH, 'HEIGHT: ', HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 13;
      console.log('BARWIDTH: ', barWidth);
      console.log('TOTAL WIDTH: ', (117*10)+(118*barWidth));

      let barHeight;
      let x = 0;

      function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        let r, g, b;
        let bars = 118;

        for (let i = 0; i < bars; i++) {
          barHeight = (dataArray[i] * 2.5);

          if (dataArray[i] > 210) {
            r = 250;
            g = 0;
            b = 255;
          } else if (dataArray[i] > 200) {
            r = 250;
            g = 255;
            b = 0;
          } else if (dataArray[i] > 190) {
            r = 204;
            g = 255;
            b = 0;
          } else if (dataArray[i] > 180) {
            r = 0;
            g = 219;
            b = 131;
          } else {
            r = 0;
            g = 199;
            b = 255;
          }

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);
          x += barWidth + 10;
        }
      }

      audio.play();
      renderFrame();
    };
  }
}

customElements.define('music-visualizer-component', MusicVisualizerComponent);
