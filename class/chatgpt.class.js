const { downloadMediaMessage } = require("@adiwajshing/baileys");
const { transcribeAudio } = require("../components/voz-a-texto");
const { convertAudio } = require("../components/convertidor-audio");
const { CoreClass } = require("@bot-whatsapp/bot");
const Spinner = require("cli-spinner").Spinner;
const { writeFile } = require("fs/promises");
const cliProgress = require("cli-progress");
const spinners = require("cli-spinners");
const colors = require("ansi-colors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

class chatGPTclass extends CoreClass {
  queue = [];
  optionsGPT = { model: "gpt-4" };
  openai = undefined;
  constructor(_database, _provider) {
    super(null, _database, _provider);
    this.init().then();
  }

  init = async () => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  };

  handleMsg = async (ctx) => {
    const { default: chalk } = await import("chalk");

    if (/^_event_voice_note_/.test(ctx.body)) {
      const progressBar = new cliProgress.SingleBar(
        {
          format:
            "{currentAction}: |" +
            colors.cyan("{bar}") +
            "| {percentage}% || {value}/{total}||",
        },
        cliProgress.Presets.shades_classic
      );
      console.log("\n");
      progressBar.start(100, 0, {
        currentAction: "Comenzando descarga de audio",
      });
      const buffer = await downloadMediaMessage(ctx, "buffer");
      progressBar.update(25, {
        currentAction: "Audio descargado, guardando archivo",
      });
      const filePath = path.resolve(__dirname, "audio", `${ctx.from}.ogg`);
      await fs.promises.writeFile(filePath, buffer);
      progressBar.update(50, {
        currentAction: "Archivo guardado, convirtiendo a formato .ogg",
      });
      const fileogg = await convertAudio(filePath);
      progressBar.update(75, {
        currentAction: "Archivo convertido, comenzando transcripción",
      });
      const Prueba = await transcribeAudio(fileogg);
      ctx.body = await Prueba.text;
      progressBar.update(100, { currentAction: `Transcripción finalizada` });
      progressBar.stop(`${ctx.from}`);
    }

    const { from, body } = ctx;

    const spinner = new Spinner({
      text: "Pensando...",
      spinner: spinners.dots12,
    });

    console.log("\n");
    spinner.start();

    const completada = await this.openai.sendMessage(body, {
      conversationId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].conversationId,
      parentMessageId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].id,
    });

    this.queue.push(completada);
    const parseMessage = {
      ...completada,
      answer: completada.text,
    };

    spinner.stop("Listo");
    setTimeout(async () => {
      console.log(
        `Este es el numero de la Persona: ${chalk.green(ctx.from)}` +
          ` Esta es la pregunta que hace a la AI: ${chalk.green(ctx.body)}`
      );
      console.log("\n");
      console.log(`Respuesta de OpenAI: ${chalk.green(completada.text)}`);
    }, 1000); // espera 2 segundos antes de imprimir la respuesta

    this.sendFlowSimple([parseMessage], from);
  };
}
module.exports = chatGPTclass;
