const getBaseUrl = () => {
    return "https://dorian-chapoulie.github.io/tp_webcomponents/components";
  }

const template = document.createElement("template");
template.innerHTML = /*html*/`
    <link rel="stylesheet" href="css/style.css">
    <link rel="FaviconIcon" href="favicon.ico" type="image/x-icon">
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

class Disque extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.filters = [];
    }

    connectedCallback() {
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
              audio.play();
              audio.currentTime = 0;
              input.innerHTML = "Pause";
            } else {
              audio.pause();
              input.innerHTML = "Play";
            }
        });

        let volumeControl = this.shadowRoot.getElementById('volume-control');
        volumeControl.addEventListener('input', () => {
            audio.volume = volumeControl.value;
            console.log(audio.volume);
          });  
    }
}
customElements.define("my-disque", Disque);