// components/menu.js
const blessed = require('blessed');

function createMenu(parentContainer) {
  return blessed.box({
    parent: parentContainer,
    top: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: '[1] ACCUEIL │ [2] CAPTEURS │ [3] SERVEUR │ [4] CHAT IA │ [5] AIDE',
    align: 'center',
    valign: 'middle',
    style: {
      bg: 'blue',
      fg: 'white',
      bold: true
    }
  });
}

module.exports = createMenu;