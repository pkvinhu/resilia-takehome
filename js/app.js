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

window.addEventListener("load", () => {
  console.log("hi");
  console.log(card);
  console.log(JsonPollock);
  
  const rooEl = JsonPollock.render(card);
  document.getElementById("inner-container").appendChild(rooEl);
});
