// components/pageHome.js
const blessed = require('blessed');

function renderHome(parentContainer) {
  const box = blessed.box({
    parent: parentContainer,
    top: 1,         // Démarre juste après le menu (qui fait 1 ligne)
    bottom: 1,      // S'arrête juste avant le footer (qui fait 1 ligne)
    left: 0,
    width: '100%',
    label: ' ╔ ACCUEIL ╗ ',
    content: '\n' +
             '  [✔] INTERFACE VERROUILLÉE\n\n' +
             '  Le menu reste désormais visible,\n' +
             '  même avec le clavier ouvert.\n\n' +
             '  Navigation :\n' +
             '  ► Touche [1] : Accueil\n' +
             '  ► Touche [2] : Aide\n' +
             '  ► Touche [Q] : Quitter',
    border: { type: 'line' },
    style: {
      border: { fg: 'cyan' },
      label: { fg: 'cyan', bold: true }
    }
  });

  return box;
}

module.exports = renderHome;