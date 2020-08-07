const paging = p => {
  //   let end;
  //   let beginning;
  let cards;
  if (p == "left") {
    //end = (currentPage - 1) * 10;
    //beginning = end - 10;
    currentPage--;
  } else if (p == "right") {
    //end = (currentPage + 1) * 10;
    //beginning = end - 10;
    currentPage++;
  } else {
    currentPage = Number(p);
    //end = currentPage * 10;
    //beginning = end - 10;
  }

  if (currentPage == 1) {
    r.className = "page-left p";
    l.className = "page-right p disabled";
  }
  if (currentPage == pages) {
    l.className = "page-right p";
    r.className = "page-left p disabled";
  }
  if (currentPage > 1 && currentPage < pages) {
    r.className = "page-left p";
    l.className = "page-right p";
  }

  console.log("CURRENT PAGE: ", currentPage);

    // if (allCards[currentPage]) {
      cards = allCards[currentPage];
      let item = document.getElementById("inner-container");
      item.innerHTML = "";
      console.log(cards);
      for (let i = 0; i < cards.length; i++) {
        let card = makeCard(cards[i]);
        let rooEl = JsonPollock.render(card);
        item.appendChild(rooEl);
        let child = item.childNodes[item.children.length - 1];
        child.style.minWidth = "150px";
      // }
  //   } else {
  // let payload = {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json, text/plain, */*",
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     city: [city],
  //     content,
  //     page: currentPage
  //   })
  // };
  // let res;
  // fetch("/content", payload)
  //   .then(res => {
  //     return res.json();
  //   })
  //   .then(res => {
  //     // console.log(res);
  //     cards = res.responses;
  //     allCards[currentPage] = [];
  //     item.innerHTML = "";
  //     for (let i = 0; i < cards.length; i++) {
  //         allCards[currentPage].push(cards[i]);
  //         let card = makeCard(cards[i]);
  //         // console.log(card);
  //         let rooEl = JsonPollock.render(card);
  //         item.appendChild(rooEl);
  //         let child = item.childNodes[item.children.length - 1];
  //         child.style.minWidth = "150px";
  //     }
  //   })
  //   .catch(e => {
  //     console.log("ERROR: ", e);
  //   });
    }
};

const makeCard = body => {
  let newCard = {
    type: "vertical",
    elements: []
  };
  let c = body;
  let el = newCard.elements;
  let attr = c.attributes;
  let address = `${attr.Address_1 || ""} ${attr.City || ""}, ${
    attr.State ? attr.State[0] || "" : ""
  }`;
  /* image */
  let image = { ...entities.image, url: attr["Image_1 URL"] || "no_image.jpg" };
  el.push(image);

  /* title */
  let title = {
    ...entities.text,
    text: c.topicName || "",
    style: { bold: true, size: "large" }
  };
  el.push(title);

  /* description */
  let description = { ...entities.text, text: attr["Short Description"] || "" };
  el.push(description);

  /* address */
  if (address) {
    let add = {
      ...entities.button,
      title: address || "No Address Available"
    };
    add.click.actions[0].uri = `https://maps.google.com/?q=loc:${attr.Latitude},${attr.Longitude}` || "";
    el.push(add);
  }
  console.log(newCard);
  return newCard;
};

const contentTypeFilter = (cardInProgress, body) => {
  switch (body.attributes["Content Type"][0]) {
    case "Dining":

    case "Hotels":

    case "Nightlife":

    case "Attractions":
    case "Shopping":
    case "Spas":

    case "Tours":
    case "Vacation Packages":
    case "Cruises":
    case "Experiences":
  }
};

const getStructuredContent = () => {
  console.log('hit structured content button')
  /* get city from input bar 
       reset allCards, currentPage, and city if different from original */
  let city_input = document.querySelector(".city-input").value;
  if (city_input !== city) {
    allCards = {};
    currentPage = 1;
    city = city_input;
  }

  /* grab content values */
  const ul = document.querySelector(".list-content-type");
  var items = ul.getElementsByTagName("li");
  content = [];
  for (let i = 0; i < items.length; i++) {
    let val = items[i].children[0];
    if (val.checked) {
      content.push(val.value);
    }
  }

  /* prepare api call */
  let payload = {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      city: [city],
      content,
      page: currentPage
    })
  };
  fetch("/content", payload)
    .then(res => {
      return res.json();
    })
    .then(async data => {
      /* establish total records to calculate pages of total entities 
           if result is not zero, proceed to prepare cards for rendering */
      resultCount = data.resultCount;
      if (data.resultCount) {
        /* grab paging arrows, number container, and toggle visibility */
        numbers.innerHTML = "";
        r.style.display = "inline";
        l.style.display = "inline";
        numbers.style.display = "inline";

        /* grab number of pages, create page buttons, and add to dom */
        pages = Math.ceil(data.resultCount / 10);
        for (let i = 0; i < pages; i++) {
          let a = document.createElement("a");
          a.href = "#";
          a.setAttribute("onclick", `paging(${i}+1)`);
          a.innerHTML = i + 1;
          a.className = "p";
          a["data-value"] = i + 1;
          a.style.display = "inline";
          numbers.appendChild(a);
        }
        r.className = "page-left p";
        l.className = "page-right p disabled";

        /* clear the cards container, 
          render all cards before storing in array,
          replace container nodes w/ first ten cards from search results */
        item.innerHTML = "";
        let page = 1;
        for (let i = 0; i < data.responses.length; i++) {
          if(i && i%10 == 0) page++;
          let card = makeCard(data.responses[i]);
          let rooEl = JsonPollock.render(card);
          if (!allCards[page]) allCards[page] = [data.responses[i]];
          else allCards[page].push(data.responses[i]);
          if(i < 10) {
          item.appendChild(rooEl);
          let child = item.childNodes[item.children.length - 1];
          child.style.minWidth = "150px";
          }
        }
        // console.log(allCards)
      }
    })
    .catch(err => console.log(err));
};
