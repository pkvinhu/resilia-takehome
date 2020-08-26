const paging = p => {
  let cards;
  /* establish current page */
  if (p == "left") {
    currentPage--;
  } else if (p == "right") {
    currentPage++;
  } else {
    currentPage = Number(p);
  }

  /* establish pagination l/r disabled */
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

  /* render cards according to current page from all cards hash map */
  cards = allCards[currentPage];
  let item = document.getElementById("inner-container");
  item.innerHTML = "";
  for (let i = 0; i < cards.length; i++) {
    /* construct structured content and pass to json-pollock */
    let card = makeCard(cards[i]);
    let rooEl = JsonPollock.render(card);
    /* create node container to throw cards into */
    let div = document.createElement("div");
    div.id = i + 1;
    div.className = `card-container`;
    item.appendChild(div);
    let child = item.childNodes[item.children.length - 1];
    child.style.minWidth = "150px";
    child.style.padding = "3px";
    /* create add/remove button to add to sample structured content view */
    let btn = `<a class="add_sc page-${currentPage}-card-${i}" href="#" style="display:${
      carousel.elements.length == 5 &&
      !addedToSC[`page-${currentPage}-card-${i}`]
        ? "none"
        : "flex"
    }" name="page-${currentPage}-card-${i}" onclick="editStructuredContentExample(${i}, ${currentPage})">${
      addedToSC[`page-${currentPage}-card-${i}`]
        ? "Remove from Card"
        : "Add Card to SC"
    }</a>`;
    child.innerHTML = btn;
    child.prepend(rooEl);
  }
  return;
};

const makeCard = body => {
  /* straight forward: all structured content is in [image, text, link, text[, text]] format */
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
    console.log(wrapper.lastChild.id);
    if (wrapper.lastChild.id !== "form") {
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
  // const controller = new AbortController();
  axios.defaults.withCredentials = true;
  let payload = {
    // method: "POST",
    // signal: controller.signal,
    // timeout: 5000,
    crossDomain: true,
    headers: {
      // credentials: 'include',
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded"
      // SameSite: "Secure"
    },
    body: {
      city: [city],
      content,
      page: currentPage
    }
  };
  // const timeoutId = setTimeout(() => controller.abort(), 5000);
  axios
    .post("/content", payload.body, payload.headers)
    // .then(res => {
    //   return res.json();
    // })
    .then(data => {
      data = data.data;
      /* establish total records to calculate pages of total entities 
         if result is not zero, proceed to prepare cards for rendering
         else alert agent to try search again */
      resultCount = data.resultCount;
      if (data.resultCount) {
        let v = document.querySelector(".validation");
        if (v) {
          document.removeChild(v);
        }
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

        /* store results in hashmap by page:cards[], 
          render only first ten cards */
        item.innerHTML = "";
        let page = 1;
        for (let i = 0; i < data.responses.length; i++) {
          if (i && i % 10 == 0) page++;
          let card = makeCard(data.responses[i]);
          if (!allCards[page]) allCards[page] = [data.responses[i]];
          else allCards[page].push(data.responses[i]);
          if (i < 10) {
            let rooEl = JsonPollock.render(card);
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
        /* render empty structured content sample for framing */
        return editStructuredContentExample();
      } else {
        alert(`There were no results found. Please update your search terms.`);
      }
    })
    .catch(err => {
      console.log(err);
      return;
      // clearTimeout(timeoutId);
    });
  return;
};

const getPerkAvailability = avail => {
  if (avail == "Active") {
    return true;
  } else {
    return false;
  }
};

const contentTypeFilter = (cardInProgress, body) => {
  /* switch case to render different additional entities 
     to cards relative to response type */
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
  /* number is card number on page
     page is page number 
     name is the title name of card */
  let div;
  let sendBtn;
  let wrapper = document.querySelector(".wrapper");
  let scSample = document.querySelector(".sc-placeholder");
  if (number === undefined) {
    scSample = document.createElement("div");
    div = document.createElement("div");
    div.innerHTML = "No cards selected for structured content yet";
    div.className = "sc-placeholder";
    scSample.append(div);
    wrapper.append(scSample);
    sendBtn = document.createElement("a");
    sendBtn.className = "send-sc-btn";
    sendBtn.href = "#";
    sendBtn.innerHTML = "Send to Conversation";
    sendBtn.style.display = "none";
    // sendBtn.setAttribute('onclick',
    // carousel.elements.length <= 1
    //   ? `sendStructuredContent(${carousel.elements[0]})`
    //   : `sendStructuredContent(${carousel})`);
    scSample.append(sendBtn);
  } else if (number >= 0) {
    scSample.style.border = "none";
    sendBtn = document.querySelector(".send-sc-btn");
    sendBtn.style.display = "flex";
    let button = document.querySelector(`.page-${page}-card-${number}`);
    /* if card is not currently added to sample, add it */
    if (!addedToSC[`page-${page}-card-${number}`]) {
      button.innerHTML = "Remove from card";
      addedToSC[`page-${page}-card-${number}`] = true;
      let card = makeCard(allCards[page][number]);
      if (carousel.elements.length == 0) {
        let rooEl = JsonPollock.render(card);
        scSample.removeChild(scSample.firstChild);
        scSample.prepend(rooEl);
        carousel.elements.push(card);
      } else if (carousel.elements.length > 0) {
        carousel.elements.push(card);
        let rooEl = JsonPollock.render(carousel);
        scSample.removeChild(scSample.firstChild);
        scSample.prepend(rooEl);
        if (carousel.elements.length == 5) {
          var elements = document.querySelectorAll(".add_sc");
          // console.log("hit 5: ", elements.length, elements[0].textContent);
          for (var i = 0; i < elements.length; i++) {
            if (elements[i].textContent == "Add Card to SC") {
              elements[i].style.display = "none";
            }
          }
        }
      }
    } else {
      button.innerHTML = "Add to card";
      /* if card is in sample, remove it */
      addedToSC[`page-${page}-card-${number}`] = false;
      let cardToRemove;
      let el = carousel.elements;
      let name = allCards[page][number].topicName;
      for (let i = 0; i < el.length; i++) {
        // console.log(el[i]);
        if (el[i].elements[1].text === name) {
          cardToRemove = i;
          break;
        }
      }
      el = el.slice(0, cardToRemove).concat(el.slice(cardToRemove + 1));
      // console.log(el);
      carousel.elements = el;
      scSample.removeChild(scSample.firstChild);
      if (el.length) {
        let rooEl;
        if (el.length > 1) {
          // console.log(carousel);
          rooEl = JsonPollock.render(carousel);
        } else {
          rooEl = JsonPollock.render(el[0]);
        }
        scSample.prepend(rooEl);
      } else {
        sendBtn = document.querySelector(".send-sc-btn");
        sendBtn.style.display = "none";
        div = document.querySelector(".sc-placeholder");
        div.innerHTML = "No cards selected for structured content yet";
      }

      let buttons = document.querySelectorAll(".add_sc");
      console.log(buttons[0]);
      if ((buttons[0].style.display = "none")) {
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].style.display = "flex";
        }
      }
    }
    let btn = document.querySelector(".send-sc-btn");
    let fn = "sendStructuredContent()"
      // carousel.elements.length <= 1
      //   ? `sendStructuredContent(${carousel.elements[0]})`
      //   : `sendStructuredContent(${carousel})`;
    console.log(fn);
    if (carousel.elements.length) {
      btn.setAttribute("onclick", fn);
    }
  }
  return;
};

const sendStructuredContent = () => {
  console.log("hit send sc");
  
  /* prepare notify cb, cmd, and data before binding to agent SDK */
  var notifyWhenDone = function(err) {
    if (err) {
      console.log(err);
    }
    console.log("The deed is done.");
  };
  let json = carousel.elements.length == 1 ? carousel.elements[0] : carousel;
  console.log(json)
  var cmdName = "Write StructuredContent"; //lpTag.agentSDK.cmdNames.writeSC;
  var data = {
    json,
		metadata: [	//metadata is optional
			{"type":"ExternalId","id":"running364"},
			{"type":"ExternalId","id":"soccer486"}
		]
  };

  lpTag.agentSDK.command(cmdName, data, notifyWhenDone);
};
