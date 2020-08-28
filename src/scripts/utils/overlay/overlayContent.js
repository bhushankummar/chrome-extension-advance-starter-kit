// console.log('Content script executing.');
const $$ = window.$;

const overlayDiv = $$('<div id=\'overlay\'/>');

/* A TODO: asynchronously add our content to overlay div element
  The idea is that the content is loaded only the first time the extension icon is clicked.
  Beyond that, content is not changed (except maybe refreshing), but the overlay is simply hidden or re-added.
*/
const displayOverlay = () => {
    console.log('Adding overlay to page.');
    $$('body').prepend(overlayDiv);
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
