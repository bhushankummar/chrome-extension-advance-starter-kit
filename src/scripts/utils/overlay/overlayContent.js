const baseUrl = 'users/';

let post = {};
let get = {};
(async () => {
    post = await (await import('../../service/apiService.js')).post;
    get = await (await import('../../service/apiService.js')).get;
    console.log('post ', post);
    console.log('get ', get);
})();

const jQuery = window.jQuery;

const overlayDiv =
jQuery('<div id=\'overlay\'><input type=\'text\' id=\'inputText\'/><button id=\'btnSubmit\'>Submit</button></div>');

const displayOverlay = () => {
    console.log('Adding overlay to page.');
    jQuery('body').prepend(overlayDiv);
    btnSubmitClickEvent();
};

const btnSubmitClickEvent = () => {
    document.getElementById('btnSubmit').addEventListener('click', async () => {
        const email = document.getElementById('inputText').value;
        const value = await post(baseUrl, { email: email, password: '12345678' });
        console.log(value);
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
        } else if (request.message === 'menuAdd') {
            console.log('Context menuAdd event ', request);
            document.getElementById('inputText').value = request.content;
        }
    }
);
