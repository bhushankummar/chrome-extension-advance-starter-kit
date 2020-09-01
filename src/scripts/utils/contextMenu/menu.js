import { getActiveTab } from '../tabUtils.js';

const ZERO_INDEX = 0;

export const initContentMenu = () => {
    let contextMenuItems = [
        {
            id: 'chromeSample',
            title: 'Chrome Sample',
            contexts: [ 'selection' ]
        },
        {
            title: 'Add ',
            parentId: 'chromeSample',
            id: 'menuAdd',
            contexts: [ 'selection' ]
        },
        {
            title: 'Update',
            parentId: 'chromeSample',
            id: 'menuUpdate',
            contexts: [ 'selection' ]
        }
    ];

    for (let index in contextMenuItems) {
        if (contextMenuItems[ index ]) {
            chrome.contextMenus.create(contextMenuItems[ index ]);
        }
    }
    chrome.contextMenus.onClicked.addListener((clickData) => {
        if (clickData.menuItemId === 'menuAdd' && clickData.selectionText) {
            addMenuClickEvent();
        } else if (clickData.menuItemId === 'menuUpdate' && clickData.selectionText) {
            updateMenuClickEvent();
        }
    });
};

const getSelectedText = () => {
    return new Promise((resolve) => {
        chrome.tabs.executeScript({
            code: 'window.getSelection().toString();'
        }, (selection) => {
            const content = selection[ ZERO_INDEX ];
            // console.log(' content ', content);
            return resolve(content);
        });
    });
};

const addMenuClickEvent = async () => {
    console.log('Inside addMenuClickEvent');
    try {
        const content = await getSelectedText();
        console.log(' content ', content);
        // chrome.runtime.sendMessage({
        //     action: 'contentReceived',
        //     source: {
        //         action: 'menuAdd',
        //         content: content
        //     }
        // });
        try {
            const activeTab = await getActiveTab();
            const tabId = activeTab.id;
            // console.log('tabId ', tabId);
            chrome.tabs.sendMessage(
                tabId,
                {
                    message: 'menuAdd',
                    content: content
                },
                (response) => {
                    console.log(`Response: ${response}`);
                }
            );
        } catch (error) {
            console.log('error', error);
        }
    } catch (error) {
        console.log('error ', error);
    }
};

const updateMenuClickEvent = () => {
    console.log('Inside updateMenuClickEvent');
};
