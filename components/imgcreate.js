const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: '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',
});

async function createImageOpenAI(text) {
    
  try {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: "1024x1024",
    });
    return image_url = response.data.data[0].url;
    
    
  } catch (error) {
    console.error(error); // Manejar cualquier error que ocurra durante la ejecución de la función
  }
}

module.exports = {
    createImageOpenAI
}

