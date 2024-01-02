const { ipcRenderer } = require('electron');

window.onload = () => {
  const clipboardTextElement = document.getElementById('clipboard-text');
  const translatedTextElement = document.getElementById('translated-text');


  ipcRenderer.on('update-clipboard', (_, arg) => {
    clipboardTextElement.textContent = arg[0];
    translatedTextElement.textContent = arg[1];
  });

 
};
