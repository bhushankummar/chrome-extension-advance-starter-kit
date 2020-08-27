window.console = chrome.extension.getBackgroundPage().console;
import { contentUtils } from '../utils/contentUtils.js';

const init = () => {
    console.log('Init popup.js');
    buttonItemClick();
};

const buttonItemClick = () => {
    document.getElementById('btnItems').addEventListener('click', ()=>{
        console.log('Inside button click.');
        chrome.tabs.query({active: true, currentWindow: true}, (tabs)=> {
            console.log('tabs[0].id ',tabs[0].id);
            contentUtils.createOverlayOnPage(tabs[0].id);
        });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            const tabId = tabs[0].id;
            if(!initialized[tabId]){
              // This is the first time the icon was clicked for the current tab, initialize content script
              initializeOverlay(tabId);
            }else{
              // Content script is running, we just need to tell it to show or hide the overlay
              toggleOverlayVisibility(tabId);
            }
          });
      });
};

const initialized = {};
const overlayed = {};

// when the URL changes or the page is refreshed, both initialized and overlayed need to change to false for that tab
chrome.webNavigation.onCommitted.addListener(function(details){
  if(details.frameId == 0){ // only reset if the nav is tab-level
    resetTabOverlayState(details.tabId);
  }
});

function initializeOverlay(tabId){
  console.log('Adding first overlay to page!');
  chrome.tabs.insertCSS(tabId, {file: "css/style.css"}, function(){
    executeScripts(tabId,[
      { file: "jquery/jquery-2.1.4.min.js" },
      { file: "scripts/utils/content_script.js" }
    ], function(){
      openOverlay(tabId);
      console.log("Overlay loaded and opened.");
      initialized[tabId] = true;
      overlayed[tabId] = true;
    });
  });
}

function resetTabOverlayState(tabId){
  console.log("Setting tab " + details.tabId + " to uninitialized.")
  initialized[tabId] = false;
  overlayed[tabId] = false;
}

function toggleOverlayVisibility(tabId){
  if(overlayed[tabId]){
    closeOverlay(tabId);
  }else{
    openOverlay(tabId);
  }
}

function openOverlay(tabId) {
  sendMessageToTab(tabId, "open overlay")
  overlayed[tabId] = true;
}

function closeOverlay(tabId) {
  sendMessageToTab(tabId, "close overlay")
  overlayed[tabId] = false;
}

function sendMessageToTab(tabId, message_){
  console.log("Sending message '" + message_ + "' to tab " + tabId);
  chrome.tabs.sendMessage(
    tabId,
    {message: message_},
    function(response) {
      console.log("Response: '" + response.message + "'");
    }
  );
}

function executeScripts(tabId, injectDetailsArray, callback){
    function createCallback(tabId, injectDetails, innerCallback) {
      return function () {
        chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
      };
    }
    for (var i = injectDetailsArray.length - 1; i >= 0; --i){
      callback = createCallback(tabId, injectDetailsArray[i], callback);
    }
    if (callback !== null){
      callback();   // execute outermost function
    }
}


window.onload = init;
