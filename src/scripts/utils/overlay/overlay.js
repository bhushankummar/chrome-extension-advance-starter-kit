const initialized = {};
const overlayed = {};

export const buttonItemClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[ 0 ].id;
        if (!initialized[ tabId ]) {
            // This is the first time the icon was clicked for the current tab, initialize content script
            initializeOverlay(tabId);
        } else {
            // Content script is running, we just need to tell it to show or hide the overlay
            toggleOverlayVisibility(tabId);
        }
    });
};

// when the URL changes or the page is refreshed, both initialized and overlayed need to change to false for that tab
chrome.webNavigation.onCommitted.addListener((details) => {
    if (details.frameId === 0) { // only reset if the nav is tab-level
        resetTabOverlayState(details.tabId);
    }
});

const initializeOverlay = (tabId) => {
    console.log('Adding first overlay to page!');
    chrome.tabs.insertCSS(tabId, { file: 'src/css/style.css' }, () => {
        executeScripts(tabId, [
            { file: 'src/vendor/jquery/jquery-2.1.4.min.js' },
            { file: 'src/scripts/utils/overlay/overlayContent.js' }
        ], () => {
            openOverlay(tabId);
            console.log('Overlay loaded and opened.');
            initialized[ tabId ] = true;
            overlayed[ tabId ] = true;
        });
    });
};

const resetTabOverlayState = (tabId) => {
    // console.log(`Setting tab ${details.tabId} to uninitialized.`);
    initialized[ tabId ] = false;
    overlayed[ tabId ] = false;
};

const toggleOverlayVisibility = (tabId) => {
    if (overlayed[ tabId ]) {
        closeOverlay(tabId);
    } else {
        openOverlay(tabId);
    }
};

const openOverlay = (tabId) => {
    sendMessageToTab(tabId, 'open overlay');
    overlayed[ tabId ] = true;
};

const closeOverlay = (tabId) => {
    sendMessageToTab(tabId, 'close overlay');
    overlayed[ tabId ] = false;
};

const sendMessageToTab = (tabId, message_) => {
    console.log(`Sending message ${message_} to tab ${tabId}`);
    chrome.tabs.sendMessage(
        tabId,
        { message: message_ },
        (response) => {
            console.log(`Response: ${response.message}`);
        }
    );
};

const executeScripts = (tabId, injectDetailsArray, callback) => {
    const createCallback = (innerTabId, injectDetails, innerCallback) => {
        return () => {
            chrome.tabs.executeScript(innerTabId, injectDetails, innerCallback);
        };
    };
    for (let item = injectDetailsArray.length - 1; item >= 0; --item) {
        callback = createCallback(tabId, injectDetailsArray[ item ], callback);
    }
    if (callback !== null) {
        return callback(); // execute outermost function
    }
};
