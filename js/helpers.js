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

  // console.log("CURRENT PAGE: ", currentPage);

  // if (allCards[currentPage]) {
  cards = allCards[currentPage];
  let item = document.getElementById("inner-container");
  item.innerHTML = "";
  // console.log(cards);
  for (let i = 0; i < cards.length; i++) {
    let topicName = cards[i].topicName;
    console.log(topicName);
    let card = makeCard(cards[i]);
    let rooEl = JsonPollock.render(card);
    let div = document.createElement("div");
    div.id = i + 1;
    div.className = `card-container`;
    item.appendChild(div);
    let child = item.childNodes[item.children.length - 1];
    child.style.minWidth = "150px";
    child.style.padding = "3px";
    let btn = `<a class="add_sc page-${currentPage}-card-${i}" href="#" name="page-${currentPage}-card-${i}" onclick="editStructuredContentExample(${i}, ${currentPage})">${
      addedToSC[`page-${currentPage}-card-${i}`]
        ? "Remove from Card"
        : "Add Card to SC"
    }</a>`;
    child.innerHTML = btn;
    child.prepend(rooEl);
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
    add.click.actions[0].uri =
      `https://maps.google.com/?q=loc:${attr.Latitude},${attr.Longitude}` || "";
    el.push(add);
  }
  newCard = contentTypeFilter(newCard, c);
  // console.log(newCard);
  return newCard;
};

const getStructuredContent = () => {
  console.log("hit structured content button");
  /* get city from input bar 
       reset allCards, currentPage, and city if different from original */
  let city_input = document.querySelector(".city-input").value;
  if (city_input !== city) {
    console.log("hit reset");
    allCards = {};
    currentPage = 1;
    city = city_input;
    addedToSC = {};
    carousel.elements = [];
    let wrapper = document.querySelector(".wrapper");
    console.log(wrapper.lastChild.id)
    if(wrapper.lastChild.id !== "form") {
      wrapper.removeChild(wrapper.lastChild);
    }
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
  console.log("finished grabbing content types");

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
          if (i && i % 10 == 0) page++;
          let card = makeCard(data.responses[i]);
          let rooEl = JsonPollock.render(card);
          if (!allCards[page]) allCards[page] = [data.responses[i]];
          else allCards[page].push(data.responses[i]);
          if (i < 10) {
            let topicName = data.responses[i].topicName;
            console.log(topicName);
            let div = document.createElement("div");
            div.id = i + 1;
            div.className = `card-container`;
            item.appendChild(div);
            let child = item.childNodes[item.children.length - 1];
            child.style.minWidth = "150px";
            child.style.padding = "3px";
            let btn = `<a class="add_sc page-1-card-${i}" href="#" name="page-1-card-${i}" onclick="editStructuredContentExample(${i}, 1)">${
              addedToSC[`page-1-card-${i}`]
                ? "Remove from Card"
                : "Add Card to SC"
            }</a>`;
            child.innerHTML = btn;
            child.prepend(rooEl);
          }
        }
        // console.log(allCards)
      }
      editStructuredContentExample();
    })
    .catch(err => console.log(err));
};

const getPerkAvailability = avail => {
  if (avail == "Active") {
    return true;
  } else {
    return false;
  }
};

const contentTypeFilter = (cardInProgress, body) => {
  let el = cardInProgress.elements;
  let perk;
  if (!body.attributes["Perk Availability"]) {
    return cardInProgress;
  } else {
    perk = body.attributes["Perk Availability"][0];
  }
  let avail = getPerkAvailability(perk);
  let template = {
    ...entities.text,
    style: { bold: true },
    text: ``
  };
  let te;

  switch (body.attributes["Content Type"][0]) {
    case "Dining":
      if (avail) {
        te = { ...template, text: "Ask me about amenities" };
        el.push(te);
      }
      return cardInProgress;
    case "Hotels":
      if (avail) {
        te = { ...template, text: "Ask me about benefits" };
      } else {
        te = { ...template, text: "Ask me about reservations" };
      }
      el.push(te);
      return cardInProgress;
    case "Nightlife":
      if (avail) {
        te = { ...template, text: "Ask me about benefits" };
      } else {
        te = { ...template, text: "Ask me about access" };
      }
      el.push(te);
      return cardInProgress;
    case "Tours":
    case "Vacation Packages":
    case "Cruises":
    case "Experiences":
      if (avail) {
        te = { ...template, text: "Ask me about this offer" };
      } else {
        te = { ...template, text: "Customize your trip" };
      }
      el.push(te);
      return cardInProgress;
  }
};

const editStructuredContentExample = (number, page) => {
  console.log("hit edit structured content: ", page, number);
  console.log(addedToSC);
  /* number is card number on page
     page is page number 
     name is the title name of card */
  let div;
  let wrapper = document.querySelector(".wrapper");
  if (number === undefined) {
    div = document.createElement("div");
    div.innerHTML = "No cards selected for structured content yet";
    div.className = "sc-placeholder";
    wrapper.append(div);
  } else if (number >= 0) {
    console.log(allCards[page][number]);
    let button = document.querySelector(`.page-${page}-card-${number}`);
    /* if card is not currently added to sample, add it */
    if (!addedToSC[`page-${page}-card-${number}`]) {
      button.innerHTML = "Remove from card";
      addedToSC[`page-${page}-card-${number}`] = true;
      let card = makeCard(allCards[page][number]);
      if (carousel.elements.length == 0) {
        let rooEl = JsonPollock.render(card);
        wrapper.removeChild(wrapper.lastChild);
        wrapper.appendChild(rooEl);
        carousel.elements.push(card);
      } else if (carousel.elements.length > 0) {
        carousel.elements.push(card);
        let rooEl = JsonPollock.render(carousel);
        wrapper.removeChild(wrapper.lastChild);
        wrapper.appendChild(rooEl);
      }
    } else {
      button.innerHTML = "Add to card";
      /* if card is in sample, remove it */
      addedToSC[`page-${page}-card-${number}`] = false;
      let cardToRemove;
      let el = carousel.elements;
      let name = allCards[page][number].topicName;
      for (let i = 0; i < el.length; i++) {
        console.log(el[i]);
        if (el[i].elements[1].text === name) {
          cardToRemove = i;
          break;
        }
      }
      el = el.slice(0, cardToRemove).concat(el.slice(cardToRemove + 1));
      console.log(el)
      carousel.elements = el;
      wrapper.removeChild(wrapper.lastChild);
      if (el.length) {
        let rooEl;
        if(el.length > 1) {
          console.log(carousel)
          rooEl = JsonPollock.render(carousel);
        } else {
          rooEl = JsonPollock.render(el[0])
        }
        wrapper.appendChild(rooEl);
      } else {
        div = document.createElement("div");
        div.className = "sc-example";
        div.innerHTML = "No cards selected for structured content yet";
        div.className = "sc-placeholder";
        wrapper.append(div);
      }
    }
  }
};
