document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("oracle-button");
    const headline = document.getElementById("headline");
  
    button.addEventListener("click", () => {
      console.log("Button clicked!");
  
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
      if (!SpeechRecognition) {
        console.error("🚫 SpeechRecognition not supported");
        headline.innerText = "Oracle™ needs Chrome with mic access.";
        return;
      }
  
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
  
      recognition.onstart = () => {
        console.log("🎤 Oracle is listening...");
        headline.innerText = "Listening...";
      };
  
      recognition.onresult = async (event) => {
        const userSpeech = event.results[0][0].transcript;
        console.log("🗣️ Transcript:", userSpeech);
        headline.innerText = "Oracle™ is thinking...";
  
        try {
          const res = await fetch("/oracle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: userSpeech })
          });
  
          const data = await res.json();
          console.log("🔮 GPT Response:", data);
          headline.innerText = data.output || "Oracle™ is silent.";
        } catch (err) {
          console.error("Fetch error:", err);
          headline.innerText = "Oracle™ encountered a glitch.";
        }
      };
  
      recognition.onerror = (event) => {
        console.error("Speech error:", event.error);
        headline.innerText = "Oracle™ couldn’t hear you clearly.";
      };
  
      recognition.start();
    });
  });
  
  