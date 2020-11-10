let currentPage = 1;
let allCards = {};
let city = "";
let customCardContent = {
  img: "",
  title: "",
  description: "",
  address: {
    title: "",
    uri: ""
  }
}
let content;
let resultCount;
let pages;
let addedToSC = {};
let customAddedToSC = {};
let r = document.querySelector(".page-right");
let l = document.querySelector(".page-left");
let numbers = document.querySelector(".numbers");
let item = document.getElementById("inner-container");
let carousel = {
  type: "carousel",
  padding: 10,
  elements: []
};

const request_values = {
  "Attractions": [ "C CAMPING/PARKS", "C LOCAL EVENTS", "C MUSEUM & GALLERY", "C SIGHTSEEING/TOURS", "E THEME PARK", "I DESTINATION INFORMATION" ],
  "Cruises": [ "T CRUISE" ],
  "Dining": [ "D RESTAURANT", "D FOOD ORDER", "D PRIVATE CHEF", "D WINE" ],
  "Experiences": [ "E EXPERIENCES" ],
  "Hotels": [ "T HOTEL AND B&B" ],
  "Nightlife": [ "E NIGHTLIFE" ],
  "Shopping": [ "G SHOPPING INFORMATION" ],
  "Spas": [ "P SPA/SALON" ],
  "Tours": [ "C SIGHTSEEING/TOURS" ],
  "Vacation Packages": [ "X SPECIAL TRAVEL PACKAGE (VIA PARTNERS)"]
}

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
  // let body = document.getElementsByTagName("body")[0];
  // body.style.visibility = "visible";

  const rooEl = JsonPollock.render(card);
  document.getElementById("inner-container").appendChild(rooEl);

});
