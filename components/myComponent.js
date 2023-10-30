class MyBox extends HTMLElement {
  constructor() {
    super();
    /*
    const shadow = this.attachShadow({ mode: 'open' });

    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = 'Ma Belle Box';

    shadow.appendChild(box);
    */

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css" rel="stylesheet">
      <div class="box1">
        My Media player
        <br>
        <audio id="gainExample1" controls class="box1">
          <source src="./assets/audio/smooth-dark-type-beat-lonely-121871.mp3" type="audio/mpeg">
          Votre navigateur ne supporte pas l'élément audio.
        </audio>

        <div class="audio-controls">
          <audio id="gainExample2" controls style="display: none;">
            <source src="./assets/audio/smooth-dark-type-beat-lonely-121871.mp3" type="audio/mpeg">
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
            <label>60Hz</label>
            <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 0);"></input>
            <output id="gain0">0 dB</output>
          </div>
          <div class="controls">
            <label>170Hz</label>
            <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 1);"></input>
            <output id="gain1">0 dB</output>
          </div>
          <div class="controls">
            <label>350Hz</label>
            <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 2);"></input>
            <output id="gain2">0 dB</output>
          </div>
          <div class="controls">
            <label>1000Hz</label>
            <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 3);"></input>
        <output id="gain3">0 dB</output>
          </div>
          <div class="controls">
            <label>3500Hz</label>
            <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 4);"></input>
            <output id="gain4">0 dB</output>
          </div>
          <div class="controls">
            <label>10000Hz</label>
            <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 5);"></input>
            <output id="gain5">0 dB</output>
          </div>

        </div>

      </div>
    `;

    const audio = this.shadowRoot.getElementById('gainExample2');

    const playButton = this.shadowRoot.getElementById('playButton');
    const pauseButton = this.shadowRoot.getElementById('pauseButton');
    const stopButton = this.shadowRoot.getElementById('stopButton');
    const volumeControl = this.shadowRoot.getElementById('volumeControl');
    const muteButton = this.shadowRoot.getElementById('muteButton');
    const increaseVolumeButton = this.shadowRoot.getElementById('increaseVolumeButton');
    const decreaseVolumeButton = this.shadowRoot.getElementById('decreaseVolumeButton');
    const skipForwardButton = this.shadowRoot.getElementById('skipForwardButton');
    const skipBackwardButton = this.shadowRoot.getElementById('skipBackwardButton');
    const progressBar = this.shadowRoot.getElementById('progressBar');

    const rateControl = this.shadowRoot.getElementById('rateControl');
    const gainSlider = this.shadowRoot.getElementById('gainSlider');

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



    let audioContext;
    let gainNode;

    // get the AudioContext
    audioContext = new AudioContext();

    // the audio element

    // fix for autoplay policy
    audio.addEventListener('play', () => audioContext.resume());

    buildAudioGraph();

    // input listener on the gain slider
    gainSlider.oninput = (evt) => {
      gainNode.gain.value = evt.target.value;
    };

    function buildAudioGraph() {
      // create source and gain node
      let gainMediaElementSource = audioContext.createMediaElementSource(audio);
      gainNode = audioContext.createGain();

      // connect nodes together
      gainMediaElementSource.connect(gainNode);
      gainNode.connect(audioContext.destination);
    }







/*

let context = new AudioContext();

let mediaElement = document.getElementById('player');
let sourceNode = context.createMediaElementSource(mediaElement);

mediaElement.onplay = () => {
  context.resume();
}
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
  var output = document.querySelector("#gain"+nbFilter);
  output.value = value + " dB";
}


*/










  }
}

customElements.define('my-box', MyBox);
