//Backgroup web site in addon chrome
var i = 1;
chrome.webNavigation.onCompleted.addListener(function (details) {
    i++;
//    chrome.browserAction.setBadgeText({text: "+" + i});
});

// chrome.runtime.onUpdateAvailable.addListener(function (details){
//   console.log("Has new version");
//   console.log(details);
//   chrome.runtime.reload();
// });
