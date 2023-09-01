const btnSummarise = document.getElementById("summarise");
const btnTextToSpeech = document.getElementById("textToSpeech");
const speed = document.getElementById("speed");
const outputTextArea = document.getElementById("output");
const loader = document.getElementById("loader");
const heading = document.getElementById("heading");
const select = document.getElementById("select");

speed.style.display = "none";
let summarizedText = "";

function populateVoiceList() {
    const voices = speechSynthesis.getVoices();
    voices.forEach(voice => {
        const option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });
}
populateVoiceList();

function showLoader() {
    loader.style.display = "block";
    btnSummarise.style.display = "none";
    outputTextArea.innerHTML = "";
    select.innerHTML = "";
    heading.innerHTML = "";
    btnTextToSpeech.style.display = "none";
    speed.style.display = "none";
}

function hideLoaderAndShowText() {
    loader.style.display = "none";
    btnSummarise.disabled = false;
    btnSummarise.innerHTML = "Summarise";
    select.innerHTML = "Select Speed for TextToSpeech";
    btnTextToSpeech.style.display = "inline";
    speed.style.display = "block";
}

btnSummarise.addEventListener("click", function() {
    showLoader();
    btnSummarise.disabled = true;
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        var url = tabs[0].url;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://127.0.0.1:5000/summary?url=" + url, true);
        xhr.onload = function() {
            var text = xhr.responseText;
            const p = document.getElementById("output");
            p.innerHTML = text;
            summarizedText = text;
            hideLoaderAndShowText();
        };
        xhr.send();
    });
});

btnTextToSpeech.addEventListener("click", function() {
    if (summarizedText.length > 0) {
        const selectedRate = parseFloat(document.querySelector('input[name="radio-group"]:checked').value);
        
        if (!isNaN(selectedRate)) {
            const utterance = new SpeechSynthesisUtterance(summarizedText);
            utterance.rate = selectedRate;
            speechSynthesis.speak(utterance);
        } else {
            alert("Invalid speech rate.");
        }
    } else {
        alert("There's no text to speak.");
    }
});
 

