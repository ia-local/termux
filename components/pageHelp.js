// components/pageHelp.js
const blessed = require('blessed');

function renderHelp(screen) {
  const box = blessed.box({
    parent: screen,
    top: 2,
    bottom: 1,
    left: 0,
    width: '100%',
    label: ' ╔ ACCES_RAPIDE / AIDE ╗ ',
    content: '\n' +
             '  [💡] GUIDE DE SÉCURITÉ TERMUX\n\n' +
             '  • Pour copier/coller dans Termux :\n' +
             '    Fais un appui long sur l\'écran.\n\n' +
             '  • Problème d\'affichage ?\n' +
             '    Ferme et rouvre ton clavier virtuel\n' +
             '    pour forcer le rafraîchissement.\n\n' +
             '  • Sortie forcée :\n' +
             '    Le raccourci CTRL+C fonctionne toujours.',
    border: { type: 'line' },
    style: {
      border: { fg: 'yellow' },
      label: { fg: 'yellow', bold: true }
    }
  });

  return box;
}

module.exports = renderHelp;