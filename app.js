// app.js
const blessed = require('blessed');

// Importation des composants complets
const createMenu = require('./components/menu.js');
const renderHome = require('./components/pageHome.js');
const renderSensors = require('./components/pageSensors.js');
const renderServer = require('./components/pageServer.js');
const renderChatbot = require('./components/pageChatbot.js');
const renderHelp = require('./components/pageHelp.js');

const screen = blessed.screen({ smartCSR: true, title: 'Termux IA HUD' });
let mainContainer = null;
let currentPageComponent = null;
let activePageName = 'home';

function drawInterface() {
  if (mainContainer) mainContainer.destroy();

  mainContainer = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: screen.width,
    height: screen.height,
    bg: 'black'
  });

  createMenu(mainContainer);

  blessed.box({
    parent: mainContainer,
    top: mainContainer.height - 1,
    left: 0,
    width: '100%',
    height: 1,
    content: ` IA CORE ACTIVE │ PAGE: ${activePageName.toUpperCase()} `,
    align: 'right',
    style: { bg: 'white', fg: 'black', bold: true }
  });

  switch(activePageName) {
    case 'home':    currentPageComponent = renderHome(mainContainer); break;
    case 'sensors': currentPageComponent = renderSensors(mainContainer); break;
    case 'server':  currentPageComponent = renderServer(mainContainer); break;
    case 'chatbot': currentPageComponent = renderChatbot(mainContainer); break; // Nouveau
    case 'help':    currentPageComponent = renderHelp(mainContainer); break;
  }

  screen.render();
}

screen.on('resize', () => { drawInterface(); });

// Configuration du pavé numérique étendu (1 à 5)
screen.key(['1'], () => { activePageName = 'home'; drawInterface(); });
screen.key(['2'], () => { activePageName = 'sensors'; drawInterface(); });
screen.key(['3'], () => { activePageName = 'server'; drawInterface(); });
screen.key(['4'], () => { activePageName = 'chatbot'; drawInterface(); }); // Nouveau
screen.key(['5'], () => { activePageName = 'help'; drawInterface(); });
screen.key(['q', 'Q', 'C-c'], () => { process.exit(0); });

drawInterface();