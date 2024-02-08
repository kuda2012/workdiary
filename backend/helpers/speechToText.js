const { Deepgram } = require("@deepgram/sdk");
const { DEEPGRAM_API_KEY } = require("../config");
exports.speechToText = async (base64DataURI) => {
  const base64Data = base64DataURI.split(",")[1];
  const buffer = Buffer.from(base64Data, "base64");
  const deepgram = new Deepgram(DEEPGRAM_API_KEY);
  const source = {
    buffer,
    mimetype: "audio/wav",
  };
  const response = await deepgram.transcription.preRecorded(source, {
    smart_format: true,
    model: "nova-2",
    detect_language: true,
  });
  return response.results.channels[0].alternatives[0].transcript;
};
