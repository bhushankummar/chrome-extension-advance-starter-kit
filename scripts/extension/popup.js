window.console = chrome.extension.getBackgroundPage().console;

const init = () => {
    console.log('Init popup.js');
    buttonItemClick();
};

const buttonItemClick = () => {
    document.getElementById('btnItems').addEventListener('click', ()=>{
        console.log('Inside button click.')
      });
};

window.onload = init;
