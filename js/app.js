let currentPage = 1;
let allCards = {};
let city = "";
let content;
let resultCount;
let pages;
let addedToSC = {};
let r = document.querySelector(".page-right");
let l = document.querySelector(".page-left");
let numbers = document.querySelector(".numbers");
let item = document.getElementById("inner-container");
let carousel = {
  type: "carousel",
  padding: 10,
  elements: []
};
try {
  var notificationHandler = function(data) {
    console.log(data);
  };

  var focusHandler = function() {
    console.log("visitor is focused");
  };

  var blurHandler = function() {
    console.log("visitor is blurred");
  };
  let initiated = lpTag.agentSDK.init({
    notificationCallback: notificationHandler,
    visitorFocusedCallback: focusHandler,
    visitorBlurredCallback: blurHandler
  });
  
} catch (e) {
  console.log(e);
}

window.addEventListener("load", async () => {
  console.log("hi");
  console.log(card);
  console.log(JsonPollock);
  var onSuccess = function(data) {
    if(data) {
    console.log("Agent SDK is initiated: ", data);
    let body = document.getElementsByTagName("body")[0];
    body.style.visibility = "visible";
    }
  };

  var onError = function(err) {
    console.log(err);
  };

  var pathToData = "visitorInfo.visitorName";

  lpTag.agentSDK.get(pathToData, onSuccess, onError);
  const rooEl = JsonPollock.render(card);
  document.getElementById("inner-container").appendChild(rooEl);
});
