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

const addInfoToCustom = (e, type, val) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    if (type === "img") {
      let wr = document.querySelector(".custom-img");
      customCardContent.img = val;
      wr.innerHTML = `<img class="custom-click" onclick="changeToInput('img')" title="hi" src=${val}/>`;
    } else if (type === "title") {
      let wr = document.querySelector(".custom-title");
      customCardContent.title = val;
      wr.innerHTML = `<div class="custom-click" onclick="changeToInput('title')">${val}</div>`;
    } else if (type === "desc") {
      let wr = document.querySelector(".custom-desc");
      customCardContent.description = val;
      wr.innerHTML = `<div class="custom-click" onclick="changeToInput('desc')">${val}</div>`;
    }
  }

  // console.log(customCardContent);
  const { img, title, description } = customCardContent;
  if (img && title && description) {
    let c = document.querySelector(".custom-card-container");
    let last_c = c.childNodes[c.childNodes.length - 1];
    let node = last_c.nodeName;
    if (node != "A") {
      let html =
        c.innerHTML +
        `<a class="add_sc" href="#" name="custom" onclick="generateFromCustom()">Generate Card</a>`;
      c.innerHTML = html;
    }
  }
};

const generateFromCustom = () => {
  // console.log("hit generate: ", customCardContent);
  let card = makeCard(customCardContent);
  let rooEl = JsonPollock.render(card);
  let label = document.createElement("div");
  label.innerHTML = "Generated Card";
  label.className = "custom-label";
  let generated_container = document.querySelector(".custom-card-container-2");

  if (generated_container.childNodes.length)
    generated_container.removeChild(generated_container.firstChild);
  if (generated_container.childNodes.length)
    generated_container.removeChild(generated_container.firstChild);
  generated_container.prepend(rooEl);
  generated_container.prepend(label);

  let btn =
    generated_container.innerHTML +
    `<a class="add_sc" href="#" name="" onclick="addCustomToSC()">Add Card to SC</a>`;
  generated_container.innerHTML =
    generated_container.childNodes.length > 2 && allCards
      ? generated_container.innerHTML
      : btn;
  if (carousel.elements.length === 5) {
    let gen_cont = document.querySelector(".custom-card-container-2");
    gen_cont.lastChild.style.display = "none";
  }
};

const addLinkToCustom = e => {
  e.preventDefault();
  let add_form = document.querySelector(".address-form");
  let addr = add_form.elements[0].value;
  let link = add_form.elements[1].value;
  customCardContent.address.title = addr;
  customCardContent.address.uri = link;
  add_form.innerHTML = `<div class="custom-click" onclick="changeToInput('link')">${addr}</div>`;
};

const changeToInput = type => {
  if (type === "img") {
    let wr = document.querySelector(".custom-img");
    let inp = `<input placeholder='Please input link to cover image' onkeypress='addInfoToCustom(event, "img", this.value)' value='${customCardContent.img}'/>`;
    wr.innerHTML = inp;
  } else if (type === "title") {
    let wr = document.querySelector(".custom-title");
    let inp = `<input placeholder='Please input text for title' onkeypress='addInfoToCustom(event, "title", this.value)' value='${customCardContent.title}'/>`;
    wr.innerHTML = inp;
  } else if (type === "desc") {
    let wr = document.querySelector(".custom-desc");
    let inp = `<input placeholder='Please input text for description' onkeypress='addInfoToCustom(event, "desc", this.value)' value='${customCardContent.description}'/>`;
    wr.innerHTML = inp;
  } else if (type === "link") {
    let wr = document.querySelector(".custom-link");
    let inp = `<form class='address-form' onSubmit='addLinkToCustom(event)'><input placeholder='Please input address' value='${customCardContent.address.title}'/><input placeholder='Please input URL to address' value='${customCardContent.address.uri}'/><button type-'submit'>Add Address</button></form>`;
    wr.innerHTML = inp;
  }
};

const makeCard = body => {
  /* straight forward: all structured content is in [image, text, link, text[, text]] format */
  let newCard = {
    type: "vertical",
    elements: []
  };
  let el = newCard.elements;

  /* if custom card */
  if (!body.attributes) {
    if (body.img) {
      el.push({ ...entities.image, url: body.img });
    }
    if (body.title) {
      el.push({
        ...entities.text,
        text: body.title,
        style: { bold: true, size: "large" }
      });
    }
    if (body.description) {
      el.push({ ...entities.text, text: body.description });
    }
    if (body.address.title) {
      let address = { ...entities.button, title: body.address.title };
      if (body.address.uri) {
        address.click.actions[0].uri =
          body.address.uri.slice(0, 8) !== "https://"
            ? "https://" + body.address.uri
            : body.address.uri;
      }
      el.push(address);
    }
    return newCard;
  } else {
    let c = body;
    let attr = c.attributes;
    let address = `${attr.Address_1 || ""} ${attr.City || ""}, ${
      attr.State ? attr.State[0] || "" : ""
    }`;
    /* image */
    let image = {
      ...entities.image,
      url: attr["Image_1 URL"] || "no_image.jpg"
    };
    el.push(image);

    /* title */
    let title = {
      ...entities.text,
      text: c.topicName || "",
      style: { bold: true, size: "large" }
    };
    el.push(title);

    /* description */
    let description = {
      ...entities.text,
      text: attr["Short Description"] || ""
    };
    el.push(description);

    /* address */
    if (address) {
      let add = {
        ...entities.button,
        title: address || "No Address Available"
      };
      add.click.actions[0].uri =
        `https://maps.google.com/?q=loc:${attr.Latitude},${attr.Longitude}` ||
        "";
      el.push(add);
    }
    newCard = contentTypeFilter(newCard, c);
    return newCard;
  }
};

const getStructuredContent = () => {
  console.log("hit structured content button");
  /* get city from input bar 
     reset allCards, currentPage, and city if different from original */
  let city_input = document.querySelector(".city-input").value;
  if (city_input !== city) {
    allCards = {};
    customAddedToSC = {};
    currentPage = 1;
    city = city_input;
    addedToSC = {};
    carousel.elements = [];
    let wrapper = document.querySelector(".wrapper");
    let generated = document.querySelector(".custom-card-container-2");
    generated.innerHTML = "";
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
  let request = [];
  for (let i = 0; i < content.length; i++) {
    request = request.concat(request_values[content[i]]);
  }

  /* prepare api call */
  axios.defaults.withCredentials = true;
  let payload = {
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: {
      city: [city],
      content,
      page: currentPage,
      request_values: request
    }
  };
  axios
    .post("/content", payload.body, payload.headers)
    .then(data => {
      data = data.data;
      data.responses = data.responses.sort((a, b) =>
        a.topicName.localeCompare(b.topicName)
      );
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

const addCustomToSC = () => {
  console.log("hit add custom to sc");
  let sendBtn;
  let scSample = document.querySelector(".sc-placeholder");
  let custom = document.querySelector(".custom-card-container-2");
  scSample.style.border = "none";
  sendBtn = document.querySelector(".send-sc-btn");
  sendBtn.style.display = "flex";
  let c = Object.keys(customAddedToSC);
  customAddedToSC[`custom-${c.length + 1}`] = customCardContent.title;
  scSample = checkCarousel(customCardContent, scSample);
  let html =
    custom.innerHTML +
    `<a class="add_sc remove_sc" href="#" onclick="removeCustomFromSC(${c.length +
      1})">Remove Custom Card ${c.length + 1}</a>`;
  custom.innerHTML = html;
};

const removeCustomFromSC = ind => {
  // console.log("hit remove custom to sc", ind);
  let scSample = document.querySelector(".sc-placeholder");
  scSample = removeFromCarousel("custom", scSample, ind);
  let custom = document.querySelector(".custom-card-container-2");
  custom.removeChild(custom.lastChild);
  let keys = Object.keys(customAddedToSC);
  let vals = Object.values(customAddedToSC);
  customAddedToSC = {};
  for (let i = 0; i < keys.length - 1; i++) {
    customAddedToSC[keys[i]] = vals[i >= ind - 1 ? i + 1 : i];
  }
  // console.log("End of remove: ", customAddedToSC)
};

let checkCarousel = (card, scSample) => {
  card = makeCard(card);
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
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent == "Add Card to SC") {
          elements[i].style.display = "none";
        }
      }
    }
  }
  return scSample;
};

let removeFromCarousel = (type, scSample, number, page) => {
  let cardToRemove;
  let el = carousel.elements;
  let name;
  if (type === "auto") {
    addedToSC[`page-${page}-card-${number}`] = false;
    name = allCards[page][number].topicName;
  }
  if (type === "custom") {
    name = customAddedToSC[`custom-${number}`];
    console.log("FROM remove: ", number, name);
  }
  for (let i = 0; i < el.length; i++) {
    if (el[i].elements[1].text === name) {
      cardToRemove = i;
      break;
    }
  }

  el = el.slice(0, cardToRemove).concat(el.slice(cardToRemove + 1));
  carousel.elements = el;
  scSample.removeChild(scSample.firstChild);
  if (el.length) {
    let rooEl;
    if (el.length > 1) {
      rooEl = JsonPollock.render(carousel);
    } else {
      rooEl = JsonPollock.render(el[0]);
    }
    scSample.prepend(rooEl);
  } else {
    let sendBtn = document.querySelector(".send-sc-btn");
    sendBtn.style.display = "none";
    div = document.querySelector(".sc-placeholder");
    div.innerHTML = "No cards selected for structured content yet";
    div.style.border = "1px solid black";
  }

  let buttons = document.querySelectorAll(".add_sc");
  if ((buttons[0].style.display = "none")) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "flex";
    }
  }
  return scSample;
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
  if (number === undefined && !document.querySelector(".sc-sample")) {
    scSample = document.createElement("div");
    scSample.className = "sc-sample";
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
      scSample = checkCarousel(allCards[page][number], scSample);
    } else {
      button.innerHTML = "Add Card to SC";
      /* if card is in sample, remove it */
      scSample = removeFromCarousel("auto", scSample, number, page);
    }
    let btn = document.querySelector(".send-sc-btn");
    let fn = "sendStructuredContent()";
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
  console.log(json);
  var cmdName = "Write StructuredContent"; //lpTag.agentSDK.cmdNames.writeSC;
  var data = {
    json,
    metadata: [
      //metadata is optional
      { type: "ExternalId", id: "running364" },
      { type: "ExternalId", id: "soccer486" }
    ]
  };

  lpTag.agentSDK.command(cmdName, data, notifyWhenDone);
};
