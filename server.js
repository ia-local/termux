// server.js

  // server.js (À exécuter sur ton ordinateur)
const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');
const http = require('http');
require('dotenv').config();


const bot = new Telegraf('7281441282:AAHag3EqGPG5Z9qrYqJ0x5RN4rwykBsynRs', {
    telegram: {
      webhookReply: true,
    },
  });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let botStatus = "EN LIGNE";
let totalMessagesProcessed = 0;
let lastInteraction = "Aucune";

// --- LOGIQUE TELEGRAM ---
bot.start((ctx) => ctx.reply('🤖 Système CVNU Central activé.'));
bot.on('text', async (ctx) => {
  totalMessagesProcessed++;
  lastInteraction = `@${ctx.from.username || ctx.from.first_name} (TG)`;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: ctx.message.text }],
      model: 'qwen/qwen3.8-27b',
    });
    await ctx.reply(chatCompletion.choices[0].message.content);
  } catch (e) { console.error(e); }
});
bot.launch();

// --- SERVEUR API POUR TERMUX ---
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Route 1 : Status Monitoring
  if (req.url === '/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: botStatus, processed: totalMessagesProcessed, lastEvent: lastInteraction }));
  } 
  // Route 2 : NOUVEAU - Requête Chatbot depuis le téléphone
  else if (req.url === '/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body);
        totalMessagesProcessed++;
        lastInteraction = "Termux HUD (App)";

        // Appel direct à Groq Llama 3.1
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: 'Tu es une IA affichée en mode ASCII sur le Termux Android de ton développeur. Réponds de manière concise (maximum 3 phrases) pour que le texte tienne sur son petit écran.' },
            { role: 'user', content: parsed.message }
          ],
          model: 'qwen/qwen3.8-27b',
        });

        const aiReply = chatCompletion.choices[0].message.content;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: aiReply }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: "Erreur interne de traitement Groq." }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log(`📊 Serveur connecté et prêt sur le port 3000`);
});