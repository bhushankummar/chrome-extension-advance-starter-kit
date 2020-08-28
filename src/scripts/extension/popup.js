window.console = chrome.extension.getBackgroundPage().console;
import * as overlayUtils from '../utils/overlay/overlay.js';

const init = () => {
    // console.log('Init popup.js');
    buttonItemClick();
};

const buttonItemClick = () => {
    document.getElementById('btnItems').addEventListener('click', () => {
        // console.log('Inside button click.');
        overlayUtils.initOverlay();
    });
};

window.onload = init;
