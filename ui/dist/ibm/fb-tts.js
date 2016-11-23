

var TTSModule = (function() {
  'use strict';
  var audio = null; // Initialize audio to null

  return {
    playCurrentAudio : playCurrentAudio
  };

  // Stops the audio for an older message and plays audio for current message
  function playCurrentAudio(text) {
    fetch('/api/text-to-speech/token') // Retrieve TTS token
      .then(function(response) {
        return response.text();
      }).then(function(token) {
          // Takes text, voice, and token and returns speech
          if (text) { // If payload.text is defined
            // Pauses the audio for older message if there is a more current message
            if (audio !== null && !audio.ended) {
              audio.pause();
            }
            audio = WatsonSpeech.TextToSpeech.synthesize({
              text: text, // Output text/response
              voice: 'en-US_MichaelVoice', // Default Watson voice
              autoPlay: true, // Automatically plays audio
              token: token
            });
          } else {
            // Pauses the audio for older message if there is a more current message
            if (audio !== null && !audio.ended) {
              audio.pause();
            }
          }
      });
  }
})();
