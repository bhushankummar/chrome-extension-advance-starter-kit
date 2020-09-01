import { getActiveTab } from '../tabUtils.js';
const initialized = {};
const overlaid = {};
const ZERO_INDEX = 0;

export const initOverlay = async () => {
    // when the URL changes or the page is refreshed, both initialized and overlaid need to change to false for that tab
    chrome.webNavigation.onCommitted.addListener((details) => {
        if (details.frameId === ZERO_INDEX) { // only reset if the nav is tab-level
            resetTabOverlayState(details.tabId);
        }
    });

    try {
        const activeTab = await getActiveTab();
        const tabId = activeTab.id;
        if (!initialized[ tabId ]) {
            // This is the first time the icon was clicked for the current tab, initialize content script
            initializeOverlay(tabId);
        } else {
            // Content script is running, we just need to tell it to show or hide the overlay
            toggleOverlayVisibility(tabId);
        }
    } catch (error) {
        console.log('error', error);
    }
};

const initializeOverlay = (tabId) => {
    console.log('Adding first overlay to page!');
    chrome.tabs.insertCSS(tabId, { file: 'src/css/style.css' }, () => {
        executeScripts(tabId, [
            { file: 'src/scripts/utils/overlay/overlayContent.js' },
            { file: 'src/vendor/jquery/jquery-2.1.4.min.js' }
        ], () => {
            openOverlay(tabId);
            console.log('Overlay loaded and opened.');
            initialized[ tabId ] = true;
            overlaid[ tabId ] = true;
        });
    });
};

const createCallback = (innerTabId, injectDetails, innerCallback) => {
    return () => {
        chrome.tabs.executeScript(innerTabId, injectDetails, innerCallback);
    };
};

const executeScripts = (tabId, files, callback) => {
    // console.log('callback ', callback);
    let callbackStack = callback;
    for (let item in files) {
        if (files[ item ]) {
            callbackStack = createCallback(tabId, files[ item ], callbackStack);
        }
    }
    // console.log('callbackStack ', callbackStack);
    if (callbackStack !== null) {
        return callbackStack(); // execute outermost function
    }
};

const resetTabOverlayState = (tabId) => {
    // console.log(`Setting tab ${details.tabId} to uninitialized.`);
    initialized[ tabId ] = false;
    overlaid[ tabId ] = false;
};

const toggleOverlayVisibility = (tabId) => {
    if (overlaid[ tabId ]) {
        closeOverlay(tabId);
    } else {
        openOverlay(tabId);
    }
};

const openOverlay = (tabId) => {
    sendMessageToTab(tabId, 'open overlay');
    overlaid[ tabId ] = true;
};

const closeOverlay = (tabId) => {
    sendMessageToTab(tabId, 'close overlay');
    overlaid[ tabId ] = false;
};

const sendMessageToTab = (tabId, message_) => {
    console.log(`Sending message ${message_} to tab ${tabId}`);
    chrome.tabs.sendMessage(
        tabId,
        { message: message_ },
        (response) => {
            console.log(`Response: ${response}`);
        }
    );
};
