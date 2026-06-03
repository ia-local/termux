// server.js
// 1. Initialisation des SDK

// server.js (A exécuter sur ton ordinateur)
const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');
const http = require('http');
require('dotenv').config();

const bot = new Telegraf('6387827879:AAHBJtsLndCnnoluZcVHZeqRgvVL1lkdIXk', {
    telegram: {
      webhookReply: true,
    },
  });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let botStatus = "EN LIGNE";
let totalMessagesProcessed = 0;
let lastInteraction = "Aucune";

bot.start((ctx) => ctx.reply('🤖 Système CVNU Central activé.'));

bot.on('text', async (ctx) => {
  totalMessagesProcessed++;
  lastInteraction = `@${ctx.from.username || ctx.from.first_name} : ${ctx.message.text.substring(0, 15)}...`;
  console.log(`[Bot] Message de ${ctx.from.first_name}: ${ctx.message.text}`);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Tu es un assistant IA précis.' },
        { role: 'user', content: ctx.message.text }
      ],
      model: 'llama-3.1-8b-instant',
    });
    await ctx.reply(chatCompletion.choices[0].message.content);
  } catch (error) {
    await ctx.reply('⚠️ Erreur Groq.');
  }
});

bot.launch();

// Partie d'écoute HTTP modifiée pour le réseau local
const server = http.createServer((req, res) => {
  // Ajout des permissions CORS pour éviter les blocages de sécurité réseau
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: botStatus,
      processed: totalMessagesProcessed,
      lastEvent: lastInteraction
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
// CRUCIAL : On écoute sur '0.0.0.0' pour ouvrir le port au téléphone connecté au même WiFi
server.listen(PORT, '0.0.0.0', () => {
  console.log(`📊 API Monitoring active sur le réseau local sur le port ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));