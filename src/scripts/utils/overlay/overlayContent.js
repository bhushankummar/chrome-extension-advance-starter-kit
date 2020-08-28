// import * as apiService from '../../service/apiService.js';

// const src = chrome.runtime.getURL('../../service/apiService.js');
// const apiService = import(src);
// apiService.main();

// const baseUrl = 'users/';

// import { apiService } from '../apiService';

// console.log('Content script executing.');
const $$ = window.$;

const overlayDiv = $$('<div id=\'overlay\'><button id=\'btnSubmit\'>Click here</button></div>');

const displayOverlay = () => {
    console.log('Adding overlay to page.');
    $$('body').prepend(overlayDiv);
    btnSubmitClickEvent();
};

const btnSubmitClickEvent = () => {
    document.getElementById('btnSubmit').addEventListener('click', () => {
        console.log('Inside btnSubmit');
        // apiService.post(baseUrl, { email: 'abc@gmail.com', password: '12345678' });
    });
};

const removeOverlay = () => {
    console.log('Removing overlay!');
    $$('#overlay').detach();
};

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension');
        if (request.message === 'close overlay') {
            removeOverlay();
            sendResponse({ message: 'goodbye!' });
        } else if (request.message === 'open overlay') {
            displayOverlay();
            sendResponse({ message: 'hello!' });
        }
    }
);
