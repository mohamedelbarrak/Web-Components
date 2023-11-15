{
    class AudioPlayer extends HTMLElement {
      playing = false;
      volume = 0.4;
      prevVolume = 0.4;
      initialized = false;
      barWidth = 3;
      barGap = 1;
      bufferPercentage = 75;
      nonAudioAttributes = new Set(['title', 'bar-width', 'bar-gap', 'buffer-percentage']);
      
      constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
        this.render();
      }
      
      static get observedAttributes() {
        return [
          // audio tag attributes
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
          'src', 'muted', 'crossorigin', 'loop', 'preload', 'autoplay',
          // the name of the audio
          'title',
          // the size of the frequency bar
          'bar-width',
          // the size of the gap between the bars
          'bar-gap',
          // the percentage of the frequency buffer data to represent
          // if the dataArray contains 1024 data points only a percentage of data will
          // be used to draw on the canvas
          'buffer-percentage'
        ];
      }
      
      async attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
          case 'src':
            this.initialized = false;
            this.render();
            this.initializeAudio();
            break;
          case 'muted':
            this.toggleMute(Boolean(this.audio?.getAttribute('muted')));
            break;
          case 'title':
            this.titleElement.textContent = newValue;
            break;
          case 'bar-width':
            this.barWidth = Number(newValue) || 3;
            break;
          case 'bar-gap':
            this.barGap = Number(newValue) || 1;
            break;
          case 'buffer-percentage':
            this.bufferPercentage = Number(newValue) || 75;
            break;
          default:
        }
        
        this.updateAudioAttributes(name, newValue);
      }
      
      updateAudioAttributes(name, value) {
        if (!this.audio || this.nonAudioAttributes.has(name)) return;
        
        // if the attribute was explicitly set on the audio-player tag
        // set it otherwise remove it
        if (this.attributes.getNamedItem(name)) {
          this.audio.setAttribute(name, value ?? '')
        } else {
          this.audio.removeAttribute(name);
        }
      }
      
      initializeAudio() {
        if (this.initialized) return;
        
        this.initialized = true;
        
        this.audioCtx = new AudioContext();
        this.gainNode = this.audioCtx.createGain();
        this.analyserNode = this.audioCtx.createAnalyser();
        this.track = this.audioCtx.createMediaElementSource(this.audio);
        
        this.analyserNode.fftSize = 2048;
        this.bufferLength = this.analyserNode.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyserNode.getByteFrequencyData(this.dataArray);
        
        this.track
          .connect(this.gainNode)
          .connect(this.analyserNode)
          .connect(this.audioCtx.destination);
        
        this.changeVolume();
      }
      
      updateFrequency() {
        if (!this.playing) return;
        
        this.analyserNode.getByteFrequencyData(this.dataArray);
        
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barCount = (this.canvas.width / (this.barWidth + this.barGap)) - this.barGap;
        const bufferSize = (this.bufferLength * this.bufferPercentage) / 100;
        let x = 0;
        
        // this is a loss representation of the frequency
        // some data are loss to fit the size of the canvas
        for (let i = 0; i < barCount; i++) {
          // get percentage of i value
          const iPerc = Math.round((i * 100) / barCount);
          // what the i percentage maps to in the frequency data
          const pos = Math.round((bufferSize * iPerc) / 100);
          const frequency = this.dataArray[pos];
          // frequency value in percentage
          const frequencyPerc = (frequency * 100) / 255;
          // frequency percentage value in pixel in relation to the canvas height
          const barHeight = (frequencyPerc * this.canvas.height) / 100;
          // flip the height so the bar is drawn from the bottom
          const y = this.canvas.height - barHeight;
          
          this.canvasCtx.fillStyle = `rgba(${frequency}, 255, 100)`;
          this.canvasCtx.fillRect(x, y, this.barWidth, barHeight);
          
          x += (this.barWidth + this.barGap);
        }
        
        requestAnimationFrame(this.updateFrequency.bind(this))
      }
      
      attachEvents() {
        this.volumeBar.parentNode.addEventListener('click', e => {
          if (e.target === this.volumeBar.parentNode) {
            this.toggleMute();
          }
        }, false);
        
        this.playPauseBtn.addEventListener('click', this.togglePlay.bind(this), false);
        
        this.volumeBar.addEventListener('input', this.changeVolume.bind(this), false);
        
        this.progressBar.addEventListener('input', (e) => this.seekTo(this.progressBar.value), false);
        
        this.audio.addEventListener('loadedmetadata', () => {
          this.progressBar.max = this.audio.duration;
          this.durationEl.textContent = this.getTimeString(this.audio.duration);
          this.updateAudioTime();
        })
        
        this.audio.addEventListener('error', (e) => {
          this.titleElement.textContent = this.audio.error.message;
          this.playPauseBtn.disabled = true;
        })
        
        this.audio.addEventListener('timeupdate', () => {
          this.updateAudioTime(this.audio.currentTime);
        })
        
        this.audio.addEventListener('ended', () => {
          this.playing = false;
          this.playPauseBtn.textContent = 'play';
          this.playPauseBtn.classList.remove('playing');
        }, false);
        
        this.audio.addEventListener('pause', () => {
          this.playing = false;
          this.playPauseBtn.textContent = 'play';
          this.playPauseBtn.classList.remove('playing');
        }, false);
        
        this.audio.addEventListener('play', () => {
          this.playing = true;
          this.playPauseBtn.textContent = 'pause';
          this.playPauseBtn.classList.add('playing');
          this.updateFrequency();
        }, false);
      }
      
      async togglePlay() {
        if (this.audioCtx.state === 'suspended') {
          await this.audioCtx.resume();
        }
        
        if (this.playing) {
          return this.audio.pause();
        }
        
        return this.audio.play();
      }
      
      getTimeString(time) {
        const secs = `${parseInt(`${time % 60}`, 10)}`.padStart(2, '0');
        const min = parseInt(`${(time / 60) % 60}`, 10);
    
        return `${min}:${secs}`;
      }
      
      changeVolume() {
        this.volume = Number(this.volumeBar.value);
        
        if (Number(this.volume) > 1) {
          this.volumeBar.parentNode.className = 'volume-bar over';
        } else if (Number(this.volume) > 0) {
          this.volumeBar.parentNode.className = 'volume-bar half';
        } else {
          this.volumeBar.parentNode.className = 'volume-bar';
        }
        
        if (this.gainNode) {
          this.gainNode.gain.value = this.volume;
        }
      }
      
      toggleMute(muted = null) {
        this.volumeBar.value = muted || this.volume === 0 ? this.prevVolume : 0;
        this.changeVolume();
      }
      
      seekTo(value) {
        this.audio.currentTime = value;
      }
      
      updateAudioTime() {
        this.progressBar.value = this.audio.currentTime;
        this.currentTimeEl.textContent = this.getTimeString(this.audio.currentTime);
      }
      
      style() {
        return `
        <style>
          :host {
            width: 100%;
            max-width: 400px;
            font-family: sans-serif;
          }
          
          * {
              box-sizing: border-box;
          }
          
          .audio-player {
            background: blue;
            border-radius: 5px;
            padding: 5px;
            color: #fff;
            display: flex;
            align-items: center;
            position: relative;
            margin: 0 0 25px;
          }
          
          .audio-name {
               position: absolute;
              color: #fff;
              padding: 5px 10px;
              font-size: 12px;
              width: 100%;
              left: 0;
              z-index: 2;
              text-transform: capitalize;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-weight: 400;
              top: calc(100% + 2px);
              background: #111;
              margin: 0;
              border-radius: 3px;
          }
          
          .play-btn {
              width: 30px;
              min-width: 30px;
              height: 30px;
              background: url("./audio-player-icon-sprite.png") 0 center/500% 100% no-repeat;
              appearance: none;
              border: none;
              text-indent: -999999px;
              overflow: hidden;
          }
          
          .play-btn.playing {
              background: red
          }
          
          .volume-bar {
              width: 30px;
              min-width: 30px;
              height: 30px;
              background: url("./audio-player-icon-sprite.png") 50% center/500% 100% no-repeat;
              position: relative;
          }
          
          .volume-bar.half {
              background: red;
          }
          .volume-bar.over {
              background: url("./audio-player-icon-sprite.png") 100% center/500% 100% no-repeat;
          }
          
          .volume-field {
              display: none;
              position: absolute;
              appearance: none;
              height: 20px;
              right: 100%;
              top: 50%;
              transform: translateY(-50%) rotate(180deg);
              z-index: 5;
              margin: 0;
              border-radius: 2px;
              background: #ffffff;
          }
          
          .volume-field::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 10px;
              background: #6d78ff;
          }
          
          .volume-field::-moz-range-thumb {
              appearance: none;
              height: 20px;
              width: 10px;
              background: #6d78ff
          }
          
          .volume-field::-ms-thumb  {
              appearance: none;
              height: 20px;
              width: 10px;
              background: #6d78ff
          }
          
          .volume-bar:hover .volume-field {
              display: block;
          }
          
          .progress-indicator {
              display: flex;
              justify-content: flex-end;
              position: relative;
              flex: 1;
              font-size: 12px;
              align-items: center;
              height: 20px;
          }
          
          .progress-bar {
              flex: 1;
              position: absolute;
              top: 50%;
              left: 0;
              z-index: 2;
              transform: translateY(-50%);
              width: 100%;
              appearance: none;
              margin: 0;
              overflow: hidden;
              background: none;
          }
          
          .progress-bar::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 0;
              box-shadow: -300px 0 0 300px #ffffff38;
          }
          
          .progress-bar::-moz-range-thumb {
              appearance: none;
              height: 20px;
              width: 0;
              box-shadow: -300px 0 0 300px #ffffff21;
          }
          
          .progress-bar::-ms-thumb {
              appearance: none;
              height: 20px;
              width: 0;
              box-shadow: -300px 0 0 300px #ffffff21;
          }
          
          .duration,
          .current-time {
              position: relative;
              z-index: 1;
              text-shadow: 0 0 2px #111;
          }
          
          .duration {
              margin-left: 2px;
              margin-right: 5px;
          }
          
          .duration::before {
              content: '/';
              display: inline-block;
              margin-right: 2px;
          }
          
          canvas {
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              opacity: 0.4;
          }
        </style>
      `
      }
      
      render() {
        this.shadowRoot.innerHTML = `
         ${this.style()}
          <figure class="audio-player">
            <figcaption class="audio-name"></figcaption>
            <audio id="audio1" controls crossorigin="anonymous" loop style="display: none"></audio>
            <button class="play-btn" type="button">play</button>
            <div class="progress-indicator">
                <span class="current-time">0:0</span>
                <input type="range" max="100" value="0" class="progress-bar">
                <span class="duration">0:00</span>
                <canvas class="visualizer" style="width: 100%; height: 20px"></canvas>
            </div>
            <div class="volume-bar">
                <input type="range" min="0" max="2" step="0.01" value="${this.volume}" class="volume-field">
            </div>
          </figure>

          <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css" rel="stylesheet">
      <div class="box1">
        My Media player
        <br>
        <!--
        <audio id="audio2" controls crossorigin="anonymous" loop>
          <source src="./assets/audio/smooth-dark-type-beat-lonely-121871.mp3" type="audio/mpeg">
          Votre navigateur ne supporte pas l'élément audio.
        </audio>
    -->

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

          <div class='webaudio-switch-body' tabindex='1' touch-action='none'><div class='webaudioctrl-tooltip'></div><div part="label" class="webaudioctrl-label"><slot></slot>dd</div></div>
        </div>

      </div>
        `;
        
        this.audio = this.shadowRoot.querySelector('audio');
        this.playPauseBtn = this.shadowRoot.querySelector('.play-btn');
        this.titleElement = this.shadowRoot.querySelector('.audio-name');
        this.volumeBar = this.shadowRoot.querySelector('.volume-field');
        this.progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
        this.currentTimeEl = this.progressIndicator.children[0];
        this.progressBar = this.progressIndicator.children[1];
        this.durationEl = this.progressIndicator.children[2];
        this.canvas = this.shadowRoot.querySelector('canvas');



//*
let audio = this.shadowRoot.getElementById('audio2');

let playButton = this.shadowRoot.getElementById('playButton');
let pauseButton = this.shadowRoot.getElementById('pauseButton');
let stopButton = this.shadowRoot.getElementById('stopButton');
let volumeControl = this.shadowRoot.getElementById('volumeControl');
let muteButton = this.shadowRoot.getElementById('muteButton');
let increaseVolumeButton = this.shadowRoot.getElementById('increaseVolumeButton');
let decreaseVolumeButton = this.shadowRoot.getElementById('decreaseVolumeButton');
let skipForwardButton = this.shadowRoot.getElementById('skipForwardButton');
let skipBackwardButton = this.shadowRoot.getElementById('skipBackwardButton');
let progressBar = this.shadowRoot.getElementById('progressBar');

let rateControl = this.shadowRoot.getElementById('rateControl');
let dixMille = this.shadowRoot.getElementById('dixMille');
let troisMilleCinqCent = this.shadowRoot.getElementById('troisMilleCinqCent');
let mille = this.shadowRoot.getElementById('mille');
let troisCentsCinquante = this.shadowRoot.getElementById('troisCentsCinquante');
let centSoixanteDix = this.shadowRoot.getElementById('centSoixanteDix');
let soixante = this.shadowRoot.getElementById('soixante');




let gainSlider = this.shadowRoot.getElementById('gainSlider');

let isMuted = false;

volumeControl.value = audio.volume;

playButton.addEventListener('click', () => {
  audio.play();
});

pauseButton.addEventListener('click', () => {
  audio.pause();
});

stopButton.addEventListener('click', () => {
  audio.currentTime = 0;
  audio.play();
});

volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

muteButton.addEventListener('click', () => {
  if (audio.muted) {
    audio.muted = false;
    muteButton.innerHTML = '<i class="bi-volume-up"> </i>';
  } else {
    audio.muted = true;
    muteButton.innerHTML = '<i class="bi bi-volume-mute"></i>';
  }
});

increaseVolumeButton.addEventListener('click', () => {
  if (audio.volume < 1) {
    audio.volume += 0.1;
    volumeControl.value = audio.volume;
  }
});

decreaseVolumeButton.addEventListener('click', () => {
  if (audio.volume > 0) {
    audio.volume -= 0.1;
    volumeControl.value = audio.volume;
  }
});

skipForwardButton.addEventListener('click', () => {
  audio.currentTime += 5;
});

skipBackwardButton.addEventListener('click', () => {
  audio.currentTime -= 5;
});

audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    const progress = (currentTime / duration) * 100;
    progressBar.value = progress;
  }
});

rateControl.addEventListener('input', () => {
  audio.playbackRate = rateControl.value;
});




let context = new AudioContext();

//let mediaElement = document.getElementById('player');
let sourceNode = context.createMediaElementSource(audio);

//audio.onplay = () => {
//  context.resume();
//}
// create the equalizer. It's a set of biquad Filters

var filters = [];

    // Set filters
    [60, 170, 350, 1000, 3500, 10000].forEach(function(freq, i) {
      var eq = context.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      filters.push(eq);
    });

// Connect filters in serie
  sourceNode.connect(filters[0]);
  for(var i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i+1]);
    }

// connect the last filter to the speakers
filters[filters.length - 1].connect(context.destination);

function changeGain(sliderVal,nbFilter) {
  var value = parseFloat(sliderVal);
  filters[nbFilter].gain.value = value;
  
  // update output labels
  //var output = document.querySelector("#gain"+nbFilter);
  //let output = this.shadowRoot.getElementById('gain5');
  //let output = this.shadowRoot.getElementById('gain5');
  console.log("TOTO"+value);
  //var output = "gain"+nbFilter;

  //output.value = value + " dB";
  console.log("TOTOnbFilter"+nbFilter);

  /**
  if (nbFilter >= 0 && nbFilter <= gains.length) {
    console.log("nbFilter"+nbFilter);
    // Update the value of the selected gain
    gains[nbFilter].value = value + " dB";
  } else {
    console.error("Invalid nbFilter value. It should be between 0 and " + (gains.length - 1));
  }
*/

  // Construct the ID of the element to access
  var elementId = "gain" + nbFilter;

  // Try to find the element in the shadowRoot

  var hostElement = document.querySelector('my-box'); // Replace with your actual host element's selector
  var gainElement = hostElement.shadowRoot.getElementById(elementId);

  //var gainElement = this.shadowRoot.getElementById(elementId);

  if (gainElement) {
    // Update the value of the found element
    console.log("nbFilter"+value);
    gainElement.value = value + " dB";
  } else {
    console.error("Element with ID '" + elementId + "' not found.");
  }



}

dixMille.addEventListener('input', () => {
  changeGain(dixMille.value, 5); // Appelez la fonction changeGain avec la valeur du curseur
});

troisMilleCinqCent.addEventListener('input', () => {
  changeGain(troisMilleCinqCent.value, 4); // Appelez la fonction changeGain avec la valeur du curseur
});

mille.addEventListener('input', () => {
  changeGain(mille.value, 3); // Appelez la fonction changeGain avec la valeur du curseur
});

troisCentsCinquante.addEventListener('input', () => {
  changeGain(troisCentsCinquante.value, 2); // Appelez la fonction changeGain avec la valeur du curseur
});

centSoixanteDix.addEventListener('input', () => {
  changeGain(centSoixanteDix.value, 1); // Appelez la fonction changeGain avec la valeur du curseur
});

soixante.addEventListener('input', () => {
  changeGain(soixante.value, 0); // Appelez la fonction changeGain avec la valeur du curseur
});
//** */
        
        this.canvasCtx = this.canvas.getContext("2d");
        // support retina display on canvas for a more crispy/HD look
        const scale = window.devicePixelRatio;
        this.canvas.width = Math.floor(this.canvas.width* scale);
        this.canvas.height = Math.floor(this.canvas.height * scale);
        this.titleElement.textContent = this.attributes.getNamedItem('src')
          ? this.attributes.getNamedItem('title').value ?? 'untitled'
          : 'No Audio Source Provided';
        this.volumeBar.value = this.volume;
        
        // if rendering or re-rendering all audio attributes need to be reset
        for (let i = 0; i < this.attributes.length; i++) {
          const attr = this.attributes[i];
          this.updateAudioAttributes(attr.name, attr.value);
        }
        
        this.attachEvents();
      }
    }
    
    customElements.define('audio-player', AudioPlayer);
  }