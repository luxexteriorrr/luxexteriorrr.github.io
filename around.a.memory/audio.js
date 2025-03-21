let audioContext;
let audioElement;
let track;
let gainNode;
let filterNode;

inject.html{
    <audio src="assets/audio/background.mp3" id="audio"></audio>
    <button data-playing="false" id="play">Play</button>
    <input id="volume" type="range" min="0" max="1" step="0.01" value="1" />
}

document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.querySelector("#play");

    playButton.addEventListener("click", () => {
        // Initialize once
        if (!audioContext) {
            initAudio(); // This sets up the nodes
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        audioElement.play().catch(err => console.error("Audio playback failed:", err));
    });
});

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioElement = document.querySelector("#audio");

    if (!audioElement) {
        console.error("❌ No audio element found with ID 'audio'");
        return;
    }

    audioElement.loop = true;

    track = audioContext.createMediaElementSource(audioElement);

    // 🎚️ Gain
    gainNode = audioContext.createGain();
    gainNode.gain.value = 1;

    // 🎛️ Filter
    filterNode = audioContext.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.value = 20000;

    // 🔗 Connect nodes
    //track.connect(gainNode)connect(filterNode).connect(audioContext.destination);

    gainNode.connect(filterNode);
    filterNode.connect(audioContext.destination)
}

