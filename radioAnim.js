// click on headshell to play the audio. 
// use the volume slider to control the volume...
// tested in the Firefox browser.
// audio source: (free music) youtube audio library – Sunshine (by Telecasted).

let input = document.getElementById("headshell");
let audio = document.getElementById("player");

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

function audioVolume(amount) {
  let changevolume = document.getElementsByTagName("audio")[0];
  changevolume.volume = amount;
}
