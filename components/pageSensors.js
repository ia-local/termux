// components/pageSensors.js
const blessed = require('blessed');
const { exec } = require('child_process');

function renderSensors(parentContainer) {
  const box = blessed.box({
    parent: parentContainer,
    top: 1,
    bottom: 1,
    left: 0,
    width: '100%',
    label: ' ╔ 📱 CAPTEURS ANDROID ╗ ',
    content: '\n  [🔋] Batterie : Chargement...\n  [📶] Réseau   : Recherche...\n  [📍] GPS      : Inactif',
    border: { type: 'line' },
    style: {
      border: { fg: 'magenta' },
      label: { fg: 'magenta', bold: true }
    }
  });

  // Fonction interne pour mettre à jour les vraies données de la batterie via Termux
  exec('termux-battery-status', (err, stdout) => {
    if (!err) {
      try {
        const data = JSON.parse(stdout);
        box.setContent(`\n  [🔋] Batterie : ${data.percentage}% (${data.status})\n  [🌡️] Temp     : ${(data.temperature / 10).toFixed(1)}°C\n  [📶] Réseau   : Connecté\n  [📍] GPS      : En attente`);
        parentContainer.screen.render();
      } catch(e) {
        // Mode démo si termux-api n'est pas installé sur le téléphone
        box.setContent('\n  [🔋] Batterie : 87% (Simulé)\n  [🌡️] Temp     : 24.5°C\n  [📶] Réseau   : WiFi Local\n  [📍] GPS      : Prêt');
      }
    }
  });

  return box;
}

module.exports = renderSensors;