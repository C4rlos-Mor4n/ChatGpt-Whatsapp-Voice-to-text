const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require("dotenv").config();

async function transcribeAudio(filePath) {
  const unixFilePath = filePath.substring(2).replace(/\\/g, '/');
    let data = new FormData();
    data.append('model', 'whisper-1');
    data.append('file', fs.createReadStream(unixFilePath));
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/audio/transcriptions',
      headers: { 
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY_VOICE_TO_TEXT}` , 
        ...data.getHeaders()
      },
      data : data
    };
    
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
};


module.exports = {
    transcribeAudio
};
