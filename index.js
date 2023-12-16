import './components/libs/webaudiocontrols.js';

const getBaseUrl = () => {
    return "https://dorian-chapoulie.github.io/tp_webcomponents/components";
  }

const template = document.createElement("template");
template.innerHTML = /*html*/`
    <style>
    </style>
    <webaudio-knob
        id="balance"
        src="${getBaseUrl()}/assets/img/LittlePhatty.png"
        value=0
        min=-1
        max=1
        step=0.1
        diameter=64
        tooltip="Balance"
        style="position: absolute; left: 850px; top: 310px; margin-bottom: 0px;"
    >
    <p style="margin-top: 0; display: flex;">Left - Right</p>
    </webaudio-knob>
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
        this.getElements();
        this.init();
        this.setListeners();
    }

    init() {
        const interval = setInterval(() => {
            if (this.context) {
                this.pannerNode = this.context.createStereoPanner();
                this.addAudioNode(this.pannerNode);
                clearInterval(interval);
            }
        }, 500);
    }

    getElements() {
        this.balance = this.shadowRoot.getElementById("balance");
    }

    setListeners() {
        this.balance.addEventListener('input', ({ target: { value }}) => {
            if (this.pannerNode) {
                //this.pannerNode.pan.value = parseFloat(value, 10);
                console.log("Balance");
            }
        });
    }

}

customElements.define("my-balance", Balance);
