'use strict';

let ports = {};
let games = {};

const connectTab = function(tabId){
  ports[tabId] = chrome.tabs.connect(tabId, {name: "time"});
  console.log("connected to tab", tabId, ports[tabId]);
  ports[tabId].onDisconnect.addListener(function(){
    console.warn(`Disconnect on tab ${tabId}`);
    delete ports[tabId];
  });
}

const setGameMeta = function(tabId, url){
  const meta = url.split("/game/")[1];
  const date = meta.split("/")[0];
  const teams = meta.split("/")[1];
  const game = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8) + "/" + teams.slice(0, 3) + ":" + teams.slice(3, 6);
  games[tabId] = game;
}

chrome.runtime.onInstalled.addListener(function() {
  console.log(chrome.runtime.getURL(""));
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (!ports[tabId] && tab.url.indexOf("watch.nba.com/game") > -1){
    connectTab(tabId);
    try{
      setGameMeta(tabId, tab.url);
    }
    catch(e){
      console.error(e);
    }
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(request){
    for (let portId in ports){
      try{
        ports[portId].postMessage({time: parseInt(request.url.split("Time=")[1].split(".")[0])/1000});
      }
      catch(e){
        console.error(e);
      }
    };
  }, 
  {urls: ["*://nbanlds245vod.akamaized.net/*"]},
);
