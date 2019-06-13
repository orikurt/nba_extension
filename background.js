'use strict';

let tabs = {};

chrome.runtime.onInstalled.addListener(function() {
  console.log(chrome.runtime.getURL(""));
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (!tabs[tabId] && tab.url.indexOf("watch.nba.com") > -1){
    tabs[tabId] = chrome.tabs.connect(tabId, {name: "time"});
    console.log("connected to tab", tab.id, tabs[tabId]);
    tabs[tabId].onDisconnect.addListener(function(port){
      console.warn(`Disconnect on tab ${tabId}`);
      delete tabs[tabId];
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(request){
    for (let portId in tabs){
      try{
        tabs[portId].postMessage({time: parseInt(request.url.split("Time=")[1].split(".")[0])/1000});
      }
      catch(e){
        console.error(e);
      }
    };
  }, 
  {urls: ["*://nbanlds245vod.akamaized.net/*"]},
);
