export const initContentMenu = () => {
    let contextMenuItem = {
        id: 'chromeSample',
        title: 'Chrome Sample',
        contexts: [ 'selection' ]
    };

    chrome.contextMenus.create(contextMenuItem);

    chrome.contextMenus.create({
        title: 'Add ',
        parentId: 'chromeSample',
        id: 'menuAdd',
        contexts: [ 'selection' ]
    });

    chrome.contextMenus.create({
        title: 'Update',
        parentId: 'chromeSample',
        id: 'menuUpdate',
        contexts: [ 'selection' ]
    });

    chrome.contextMenus.onClicked.addListener((clickData) => {
        if (clickData.menuItemId === 'menuAdd' && clickData.selectionText) {
            addMenuClickEvent();
        } else if (clickData.menuItemId === 'menuUpdate' && clickData.selectionText) {
            updateMenuClickEvent();
        }
    });
};

const addMenuClickEvent = () => {
    console.log('Inside addMenuClickEvent');
};


const updateMenuClickEvent = () => {
    console.log('Inside updateMenuClickEvent');
};
