// components/pageChatbot.js
const blessed = require('blessed');
const http = require('http');
const config = require('../config');

function renderChatbot(parentContainer) {
  // 1. Conteneur principal de la page
  const mainBox = blessed.box({
    parent: parentContainer,
    top: 1,
    bottom: 1,
    left: 0,
    width: '100%'
  });

  // 2. Zone d'historique des messages (Prend 70% de la hauteur)
  const historyBox = blessed.box({
    parent: mainBox,
    top: 0,
    height: '70%',
    width: '100%',
    label: ' ╔ 💬 DISCUSSION LLAMA 3.1 ╗ ',
    content: '  {cyan-fg}[Système]{/cyan-fg} Tape ton message en bas et appuie sur ENTRÉE.\n',
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'cyan' },
      label: { fg: 'cyan', bold: true }
    }
  });

  // 3. Zone d'input texte (Prend les 30% restants en bas)
  const inputBox = blessed.textarea({
    parent: mainBox,
    bottom: 0,
    height: '30%',
    width: '100%',
    label: ' ╔ ⌨️ ENTRÉE TEXTE ╗ ',
    inputOnFocus: true,
    keys: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'yellow' },
      label: { fg: 'yellow', bold: true },
      focus: { border: { fg: 'green' } }
    }
  });

  // Fonction pour envoyer le message au serveur PC
  function sendMessage(text) {
    if (!text.trim()) return;

    historyBox.pushLine(`  {yellow-fg}[Moi]:{/yellow-fg} ${text}`);
    historyBox.setScrollPerc(100); // Scroll automatique vers le bas
    parentContainer.screen.render();

    // Préparation de la requête JSON pour le PC
    const postData = JSON.stringify({ message: text });

    const options = {
      host: config.pcAddress,
      port: config.port,
      path: '/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const resJson = JSON.parse(data);
          historyBox.pushLine(`  {green-fg}[Llama3.1]:{/green-fg} ${resJson.reply}`);
        } catch (e) {
          historyBox.pushLine('  {red-fg}[Erreur]:{/red-fg} Réponse serveur illisible.');
        }
        historyBox.setScrollPerc(100);
        parentContainer.screen.render();
      });
    });

    req.on('error', () => {
      historyBox.pushLine('  {red-fg}[Erreur]:{/red-fg} Impossible de joindre le serveur IA sur PC.');
      parentContainer.screen.render();
    });

    req.write(postData);
    req.end();
  }

  // Événement d'envoi lors de l'appui sur la touche ENTRÉE
  inputBox.key(['enter'], function () {
    const text = inputBox.getValue();
    inputBox.setValue(''); // Vide la zone de saisie
    sendMessage(text.trim());
    inputBox.focus(); // Garde le focus sur le clavier
  });

  // Forcer le focus sur la zone de texte dès l'ouverture de la page
  setTimeout(() => {
    inputBox.focus();
    parentContainer.screen.render();
  }, 100);

  return mainBox;
}

module.exports = renderChatbot;