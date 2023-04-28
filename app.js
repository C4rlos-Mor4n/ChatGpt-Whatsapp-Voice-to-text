const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    EVENTS,
} = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const chatGPTclass = require("./class/chatgpt.class");


const createBotGPT = async ({ provider, database }) => {
    return new chatGPTclass(database, provider);
};


const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([]);
    const adapterProvider = createProvider(BaileysProvider);

    createBotGPT({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
    
};

main();