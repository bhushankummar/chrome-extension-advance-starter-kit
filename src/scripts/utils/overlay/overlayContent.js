const baseUrl = 'users/';

let apiService = {};
(async () => {
    // const src = chrome.runtime.getURL('../../service/apiService.js');
    apiService = await (await import('../../service/apiService.js')).apiService;
    console.log('apiService ', apiService);
})();

const jQuery = window.jQuery;

const overlayDiv = jQuery('<div id=\'overlay\'><button id=\'btnSubmit\'>Click here</button></div>');

const displayOverlay = () => {
    console.log('Adding overlay to page.');
    jQuery('body').prepend(overlayDiv);
    btnSubmitClickEvent();
};

const btnSubmitClickEvent = () => {
    document.getElementById('btnSubmit').addEventListener('click', () => {
        console.log('Inside btnSubmit');
        apiService.post(baseUrl, { email: 'abc@gmail.com', password: '12345678' });
    });
};

const removeOverlay = () => {
    console.log('Removing overlay!');
    jQuery('#overlay').detach();
};

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log('onMessage ', request);
        console.log(sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension');
        if (request.message === 'close overlay') {
            removeOverlay();
            sendResponse({ message: 'goodbye!' });
        } else if (request.message === 'open overlay') {
            displayOverlay();
            sendResponse({ message: 'hello!' });
        } else if (request.message === 'contentReceived') {
            console.log('contentReceived ', request);
            // Set content into the TextBox
        }
    }
);
