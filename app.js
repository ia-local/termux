// app.js
const blessed = require('blessed');

// Importation des composants complets
const createMenu = require('./components/menu.js');
const renderHome = require('./components/pageHome.js');
const renderSensors = require('./components/pageSensors.js');
const renderServer = require('./components/pageServer.js');
const renderHelp = require('./components/pageHelp.js');

const screen = blessed.screen({
  smartCSR: true,
  title: 'Termux Automation HUD'
});

let mainContainer = null;
let currentPageComponent = null;
let activePageName = 'home';

function drawInterface() {
  if (mainContainer) {
    mainContainer.destroy();
  }

  // Conteneur adaptatif plein écran (s'ajuste au clavier)
  mainContainer = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: screen.width,
    height: screen.height,
    bg: 'black'
  });

  // Injection du Header
  createMenu(mainContainer);

  // Injection du Footer
  blessed.box({
    parent: mainContainer,
    top: mainContainer.height - 1,
    left: 0,
    width: '100%',
    height: 1,
    content: ` NETWORK: ACTIVE │ HUB: ${activePageName.toUpperCase()} `,
    align: 'right',
    style: { bg: 'white', fg: 'black', bold: true }
  });

  // Routage des pages via pavé numérique
  switch(activePageName) {
    case 'home':
      currentPageComponent = renderHome(mainContainer);
      break;
    case 'sensors':
      currentPageComponent = renderSensors(mainContainer);
      break;
    case 'server':
      currentPageComponent = renderServer(mainContainer);
      break;
    case 'help':
      currentPageComponent = renderHelp(mainContainer);
      break;
  }

  screen.render();
}

// Événement de redimensionnement (Clavier Android ouvert/fermé)
screen.on('resize', () => {
  drawInterface();
});

// Écouteurs d'événements du pavé numérique
screen.key(['1'], () => { activePageName = 'home'; drawInterface(); });
screen.key(['2'], () => { activePageName = 'sensors'; drawInterface(); });
screen.key(['3'], () => { activePageName = 'server'; drawInterface(); });
screen.key(['4'], () => { activePageName = 'help'; drawInterface(); });
screen.key(['q', 'Q', 'C-c'], () => { process.exit(0); });

// Lancement
drawInterface();