let voiceSpeak;
let recognition;
let utterance;

if(window.SpeechRecognition == undefined && window.webkitSpeechRecognition == undefined && window.mozSpeechRecognition == undefined && window.msSpeechRecognition == undefined) {
  alert('Please try on Google Chrome or any other browser that supports Speech Recognition');
} else {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
}

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
window.speechSynthesis.onvoiceschanged = function() {
    let voices = window.speechSynthesis.getVoices();
    voices.forEach(voice => {
      if(voice.name === 'Monica') {
        voiceSpeak = voice;
      }
    })
};

recognition.onresult = event => {
    let translate = event.results[0][0].transcript;
    fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170729T221010Z.5c4f9485fbc7dffe.e8f1afc5701d0f8d4ecaaac9412f103d04d83b9c&text=${translate}&lang=en-es`).then(response =>{
      return response.json();
    }).then(response => {
      utterance  = new SpeechSynthesisUtterance();
      utterance.voice = voiceSpeak;
      utterance.text = response.text[0];
      utterance.lang = 'es';
      speechSynthesis.speak(utterance);
      document.querySelector(".response").textContent = response.text[0];
      document.querySelector(".mouth-top-dot").style.display = "none";
      document.querySelector(".mouth-top").className += " top-speak";
      document.querySelector(".mouth-bottom").className += " bottom-speak";
      utterance.onend = event => {
        document.getElementById("top").className = document.getElementById("top").className.replace(/top-speak/,'');
        document.getElementById("bottom").className =document.getElementById("bottom").className.replace(/bottom-speak/,'');
        document.querySelector(".mouth-top-dot").style.display = "block";
      }
    });
};

let startRecording = () => {
    recognition.start();
};

document.querySelector("button").addEventListener('click', startRecording);
