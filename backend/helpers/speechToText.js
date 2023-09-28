const { Deepgram } = require("@deepgram/sdk");
const { DEEPGRAM_API_KEY } = require("../config");
exports.speechToText = async (req) => {
  const deepgram = new Deepgram(DEEPGRAM_API_KEY);
  const source = {
    buffer: req.file.buffer,
    mimetype: "audio/wav",
  };
  const response = await deepgram.transcription.preRecorded(source, {
    smart_format: true,
    model: "nova",
    summarize: "v2",
  });

  return response.results.channels[0].alternatives[0].transcript;
};
