const ZERO_INDEX = 0;

export const tabUtils = {
    openLinkInNewTab: (newURL) => {
        // console.log('newURL ', newURL);
        // chrome.tabs.create({url: newURL}, callback);
        return new Promise((resolve) => {
            chrome.tabs.create({ url: newURL }, (response) => {
                return resolve(response);
            });
        });
    },

    close: (tabId) => {
        // console.log('tabId ', tabId);
        return new Promise((resolve) => {
            chrome.tabs.remove(tabId, (response) => {
                return resolve(response);
            });
        });
    },

    getActiveTab: () => {
        return new Promise((resolve) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                return resolve(tabs[ ZERO_INDEX ]);
            });
        });
    }
};
