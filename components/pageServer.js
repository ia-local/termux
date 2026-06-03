// components/pageServer.js
const blessed = require('blessed');
const http = require('http');
const config = require('../config'); // On importe la configuration globale

function renderServer(parentContainer) {
  const box = blessed.box({
    parent: parentContainer,
    top: 1,
    bottom: 1,
    left: 0,
    width: '100%',
    label: ' ╔ 🤖 MONITORING TELEGRAM BOT ╗ ',
    content: `\n  Connexion vers l'ordinateur (${config.pcAddress})...`,
    border: { type: 'line' },
    style: {
      border: { fg: 'green' },
      label: { fg: 'green', bold: true }
    }
  });

  function checkBotStatus() {
    if (!box.parent) return;

    // Utilisation des variables dynamiques de config.js
    const options = {
      host: config.pcAddress,
      port: config.port,
      path: '/status',
      timeout: 1500 // Évite de bloquer l'interface si le PC ne répond pas
    };

    const req = http.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const stats = JSON.parse(data);
          box.setContent(
            `\n` +
            `  [🤖] BOT SUR PC : ${stats.status === 'EN LIGNE' ? '{green-fg}EN LIGNE{/green-fg}' : '{red-fg}' + stats.status + '{/red-fg}'}\n` +
            `  [🌐] IP CIBLE   : ${config.pcAddress}:${config.port}\n\n` +
            `  [📊] Messages traités : ${stats.processed}\n` +
            `  [🔔] Dernier Event   : ${stats.lastEvent}\n\n` +
            `  {dim}Actualisation synchronisée (2s){/dim}`
          );
        } catch (e) {
          box.setContent('\n  [❌] Erreur d\'analyse du flux de monitoring.');
        }
        parentContainer.screen.render();
      });
    });

    req.on('error', () => {
      box.setContent(
        `\n  [❌] SERVEUR PC INTROUVABLE\n\n` +
        `  Vérifie que :\n` +
        `  1. Le serveur tourne sur ton PC (node server.js)\n` +
        `  2. Ton téléphone est bien sur le MEME WiFi\n` +
        `  3. L'IP '${config.pcAddress}' est bien celle de ton PC.`
      );
      parentContainer.screen.render();
    });

    req.end();
  }

  // Lancement de la boucle d'interrogation
  checkBotStatus();
  const intervalId = setInterval(checkBotStatus, 2000);

  box.on('destroy', () => {
    clearInterval(intervalId);
  });

  return box;
}

module.exports = renderServer;