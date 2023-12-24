// music-visualizer-component.js
class MusicVisualizerComponent1 extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = `
    <style>
    
    </style>
    <script src="music-visualizer-script.js"></script>
    
Hi

    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    
  }



  connectedCallback() {

    
    let elements = this.shadowRoot.querySelectorAll('img, webaudio-knob, webaudio-switch');
    

    elements.forEach((e) => {
      let elementPath = e.getAttribute('src');
      // if the image path isn't already absolute, make it absolute

    });

    
    const fileInput = this.shadowRoot.getElementById("file-input");
    const canvas = this.shadowRoot.getElementById("canvas");
    const audio = this.shadowRoot.getElementById("audio");

    let dixMille = this.shadowRoot.getElementById('dixMille');
    let troisMilleCinqCent = this.shadowRoot.getElementById('troisMilleCinqCent');
    let mille = this.shadowRoot.getElementById('mille');
    let troisCentsCinquante = this.shadowRoot.getElementById('troisCentsCinquante');
    let centSoixanteDix = this.shadowRoot.getElementById('centSoixanteDix');
    let soixante = this.shadowRoot.getElementById('soixante');
    

    const context = new AudioContext();
    let src = context.createMediaElementSource(audio);

    fileInput.onchange = function() {
      const files = this.files;
      console.log('FILES[0]: ', files[0]);
      audio.src = URL.createObjectURL(files[0]);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");

      //const context = new AudioContext();
      //let src = context.createMediaElementSource(audio);
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


      dixMille.addEventListener('input', () => {
        console.log("dixMille");
        changeGain(dixMille.value, 5); // Appelez la fonction changeGain avec la valeur du curseur
      });
  
      troisMilleCinqCent.addEventListener('input', () => {
        console.log("troisMilleCinqCent");
        changeGain(troisMilleCinqCent.value, 4); // Appelez la fonction changeGain avec la valeur du curseur
      });
  
      mille.addEventListener('input', () => {
        console.log("mille");
        changeGain(mille.value, 3); // Appelez la fonction changeGain avec la valeur du curseur
      });
  
      troisCentsCinquante.addEventListener('input', () => {
        console.log("troisCentsCinquante");
        changeGain(troisCentsCinquante.value, 2); // Appelez la fonction changeGain avec la valeur du curseur
      });
  
      centSoixanteDix.addEventListener('input', () => {
        console.log("soixante");
        changeGain(centSoixanteDix.value, 1); // Appelez la fonction changeGain avec la valeur du curseur
      });
  
      soixante.addEventListener('input', () => {
        console.log("soixante");
        changeGain(soixante.value, 0); // Appelez la fonction changeGain avec la valeur du curseur
      });




     
    

    };
    
    let playerPanner, pannerNode;
    let pannerSlider;

    window.onload = () => {       
    
    // the audio element
   playerPanner = this.shadowRoot.getElementById("audio");
   playerPanner.onplay = (e) => {context.resume();}
  
   
      pannerSlider = this.shadowRoot.getElementById('pannerSlider');
      //console.log("toto1" + pannerSlider);
      buildAudioGraphPanner();
      //console.log("toto1.1" + pannerSlider);
     // input listener on the gain slider
     pannerSlider.oninput = (evt) => {
      //console.log("toto" + pannerSlider);
       pannerNode.pan.value = evt.target.value;
       console.log("testtest2");
     }; 


     /*
     pannerSlider.addEventListener('input', () => {
      var value = parseFloat(pannerSlider.value);
      pannerNode.pan.value = value;
      pannerSlider.value = value;
      console.log("testtest1");
    });
    */


   };
   

   function buildAudioGraphPanner() {
       // create source and gain node
       //let source = context.createMediaElementSource(playerPanner);

       pannerNode = context.createStereoPanner();
     
       // connect nodes together
       src.connect(pannerNode);
       pannerNode.connect(context.destination);
   

   }


    let playButton = this.shadowRoot.getElementById('playButton');
    let pauseButton = this.shadowRoot.getElementById('pauseButton');
    let stopButton = this.shadowRoot.getElementById('stopButton');
    let volumeControl = this.shadowRoot.getElementById('volumeControl');
    let volumeControl1 = this.shadowRoot.getElementById('volumeControl1');
    let muteButton = this.shadowRoot.getElementById('muteButton');
    let increaseVolumeButton = this.shadowRoot.getElementById('increaseVolumeButton');
    let decreaseVolumeButton = this.shadowRoot.getElementById('decreaseVolumeButton');
    let skipForwardButton = this.shadowRoot.getElementById('skipForwardButton');
    let skipBackwardButton = this.shadowRoot.getElementById('skipBackwardButton');
    let progressBar = this.shadowRoot.getElementById('progressBar');
    
    let muteImage = this.shadowRoot.getElementById('muteImage');


    //let sourceNode = context.createMediaElementSource(audio);



    var filters = [];

    // Set filters
    [60, 170, 350, 1000, 3500, 10000].forEach(function(freq, i) {
      var eq = context.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      filters.push(eq);
    });

    src.connect(filters[0]);
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
     // console.log("TOTO"+value);
      //var output = "gain"+nbFilter;

      //output.value = value + " dB";
     // console.log("TOTOnbFilter"+nbFilter);

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

      var hostElement = document.querySelector('music-visualizer-component1'); // Replace with your actual host element's selector
      var gainElement = hostElement.shadowRoot.getElementById(elementId);

      //var gainElement = this.shadowRoot.getElementById(elementId);

      if (gainElement) {
        // Update the value of the found element
     //   console.log("nbFilter"+value);
        gainElement.value = value + " dB";
      } else {
        console.error("Element with ID '" + elementId + "' not found.");
      }
    }









    playButton.addEventListener('click', () => {
      context.resume().then(() => {
        audio.play();
      });
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
      console.log(audio.volume);
    });

    volumeControl1.addEventListener('input', ({ target: { value }}) => {
      audio.volume = parseFloat(value, 10);
      console.log(audio.volume);
    });

    //pannerSlider.addEventListener('input', () => {
    //  audio.pan.value = pannerSlider.value;
    //  console.log(audio.pan.value);
    //});







    muteButton.addEventListener('click', () => {
      if (audio.muted) {
        audio.muted = false;
        muteImage.src = 'https://img.icons8.com/metro/26/mute.png';
      } else {
        audio.muted = true;
        muteImage.src = 'https://img.icons8.com/metro/26/high-volume.png';
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

    //rateControl.addEventListener('input', () => {
    //  audio.playbackRate = rateControl.value;
    //});


    //knob.addEventListener('input', () => {
    //  audio.volume = this.knob.value;
    //  console.log(audio.volume); // Log the volume for debugging
    //});



  }
}

customElements.define('music-visualizer-component1', MusicVisualizerComponent1);
