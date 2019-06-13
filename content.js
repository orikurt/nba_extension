chrome.runtime.onConnect.addListener(function (port){
    console.log("connected to background", port);
    port.onMessage.addListener( 
        function(request, sender, sendResponse) {
            console.log("time of game is", request.time);
    });
});