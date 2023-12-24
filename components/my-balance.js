const getBaseUrl = () => {
    return "https://dorian-chapoulie.github.io/tp_webcomponents/components";
  }

const template = document.createElement("template");
template.innerHTML = /*html*/`
    <style>
    </style>
    <link rel="stylesheet" href="css/style.css">
  <link rel="FaviconIcon" href="favicon.ico" type="image/x-icon">
  <script src="music-visualizer-component.js" type="module"></script>
  <script src="components/libs/webaudiocontrols.js"></script>

    <div class="record-player">
    <input type="checkbox" id="headshell">
    <label class="headshell" for="headshell"></label>
    <audio id="player">
    <source id="audioSource" src="" type="audio/mpeg"/>
    </audio>
    <input type="range" max="1" min="0" step="0.1" id="volume-control">
    <div class="plinth"></div>
    <div class="platter"></div>
    <div class="vinyl"></div>
    <div class="top-circle"></div>
  </div>

`;

class Balance extends HTMLElement {
    constructor() {
        console.log("Balance0");
        super();
        this.attachShadow({ mode: "open" });
        this.filters = [];
    }

    connectedCallback() {
        console.log("Balance connectedCallback 0");
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.init();
    }

    init() {
        const interval = setInterval(() => {
            if (this.context) {
                this.pannerNode = this.context.createStereoPanner();
                this.addAudioNode(this.pannerNode);
                clearInterval(interval);
            }
        }, 500);
        
        const audioSource = this.shadowRoot.getElementById('audioSource');
        const audioPath = this.getAttribute('audio-path');
        audioSource.src = audioPath;

        let input = this.shadowRoot.getElementById("headshell");
        let audio = this.shadowRoot.getElementById("player");

        input.addEventListener("click", function(){
            if(audio.paused){
            //pannerNode.play();
              audio.play();
              audio.currentTime = 0;
              input.innerHTML = "Pause";
              dispatchEvent(new Event('music-play'));
            } else {
                //this.pannerNode.pause();
              audio.pause();
              input.innerHTML = "Play";
              dispatchEvent(new Event('music-pause'));
            }
        });

        let volumeControl = this.shadowRoot.getElementById('volume-control');
        volumeControl.addEventListener('input', () => {
            audio.volume = volumeControl.value;
            console.log(audio.volume);
          });
          
    }


}

customElements.define("my-balance", Balance);
