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
        <audio id="audio1" controls crossorigin="anonymous" loop>
          <source src="./assets/audio/smooth-dark-type-beat-lonely-121871.mp3" type="audio/mpeg">
          Votre navigateur ne supporte pas l'élément audio.
        </audio>

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

          dddd
          <webaudio-knob id="knob1"
          src="./components/images/LittlePhatty.png" 
          value="50" step="1" 
          diameter="64" 
          tooltip="Knob1 tooltip %d">
          </webaudio-knob>
          ddd
          <div class='webaudio-switch-body' tabindex='1' touch-action='none'><div class='webaudioctrl-tooltip'></div><div part="label" class="webaudioctrl-label"><slot></slot>dd</div></div>
        
        
          

          </div>

      </div>
    `;

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

    this.knob = this.shadowRoot.querySelector('webaudio-knob');
    let knob = this.shadowRoot.getElementById('knob1');


    /**
    let gain5 = this.shadowRoot.getElementById('gain5');
    let gain4 = this.shadowRoot.getElementById('gain4');
    let gain3 = this.shadowRoot.getElementById('gain3');
    let gain2 = this.shadowRoot.getElementById('gain2');
    let gain1 = this.shadowRoot.getElementById('gain1');

    let gains = [gain1, gain2, gain3, gain4, gain5];
 */

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


    knob.addEventListener('input', () => {
      audio.volume = this.knob.value;
      console.log(audio.volume); // Log the volume for debugging
    });


/**

    let audioContext;
    let gainNode;

    // get the AudioContext
    audioContext = new AudioContext();

    // the audio element

    // fix for autoplay policy
    audio.addEventListener('play', () => audioContext.resume());

    //buildAudioGraph();

    // create source and gain node
    let gainMediaElementSource = audioContext.createMediaElementSource(audio);
    gainNode = audioContext.createGain();

    // connect nodes together
    gainMediaElementSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

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




    

    var filters = [];
    [60, 170, 350, 1000, 3500, 10000].forEach(function(freq, i) {
      var eq = audioContext.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      filters.push(eq);
    });
    gainMediaElementSource.connect(filters[0]);
    for(var i = 0; i < filters.length - 1; i++) {
       filters[i].connect(filters[i+1]);
     }
     filters[filters.length - 1].connect(audioContext.destination);
     function changeGain(sliderVal,nbFilter) {
      var value = parseFloat(sliderVal);
      filters[nbFilter].gain.value = value;
      var output = document.querySelector("#gain"+nbFilter);
      output.value = value + " dB";
    }
    */




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
