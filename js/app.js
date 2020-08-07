let currentPage = 1;
let allCards = {};
let city = "";
let content;
let resultCount;
let pages;
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
  // const sc_button = document.querySelector(".submit");

  // sc_button.addEventListener("click", () => {
  //   event.preventDefault();

  // });

  const renderCardsPerPage = (page, data, makeCard) => {};

  // let long;
  // let lat;
  // let tempDesc = document.querySelector(".temperature-description");
  // let tempDegree = document.querySelector(".temperature-degree");
  // let locationTimezone = document.querySelector(".location-timezone");
  // let tempSection = document.querySelector(".temperature");
  // let tempSpan = document.querySelector(".temperature span");

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(position => {
  //     //console.log(position);
  //     long = position.coords.longitude;
  //     lat = position.coords.latitude;

  //     const proxy = `https://cors-anywhere.herokuapp.com/`;
  //     // For reference: https://www.weatherapi.com/docs/
  //     let apiKey = "ad1317a20aba40eeb7f203434201407";
  //     let baseUrl = "http://api.weatherapi.com/v1";
  //     let api = `${proxy}${baseUrl}/current.json?key=${apiKey}&q=${lat},${long}`;
  //     fetch(api)
  //       .then(res => {
  //         return res.json();
  //       })
  //       .then(data => {
  //         console.log(data);
  //         const { temp_c, temp_f } = data.current;
  //         const { tz_id } = data.location;
  //         const { text, icon } = data.current.condition;
  //         //Set DOM elements from the api
  //         tempDegree.textContent = temp_f;
  //         tempDesc.textContent = text;
  //         locationTimezone.textContent = tz_id;
  //         //set icon
  //         setIcons(text, document.querySelector(".icon"));

  //         //change tem to celsius/fah
  //         tempSection.addEventListener('click', () => {
  //             if(tempSpan.textContent === "F") {
  //                 tempDegree.textContent = temp_c
  //                 tempSpan.textContent = "C"
  //             } else {
  //                 tempDegree.textContent = temp_f;
  //                 tempSpan.textContent = "F"
  //             }
  //         })
  //       });
  //   });
  // } else {
  //   h1.textContent =
  //     "hey this isn't working because geolocation is not rendering";
  // }

  // function setIcons(icon, iconId) {
  //   const skycons = new Skycons({ color: "white" });
  //   const currentIcon = icon.replace(/ /g, "_").toUpperCase() + "_DAY";
  //   console.log(currentIcon);
  //   skycons.play();
  //   return skycons.set(iconId, Skycons[currentIcon]);
  // }
});
