let card = {
  type: "vertical",
  elements: [
    {
      type: "image",
      url:
        "https://aldprod01store.blob.core.windows.net/dcr/images/sevenroom-650px.jpg",
      tooltip: "HELLO"
    },
    {
      type: "text",
      text: "product name",
      tooltip: "text tooltip",
      style: {
        bold: true,
        size: "large"
      }
    },
    {
      type: "text",
      text: "product description",
      tooltip: "text tooltip"
    },
    {
      type: "button",
      tooltip: "Navigate to Address on Google Maps",
      title: "Address",
      click: {
        actions: [
          {
            type: "link",
            name: "Address",
            uri: "https://maps.google.com/?q="
          }
        ]
      }
    }
  ]
};

let entities = {
  image: {
    type: "image",
    url:
      "https://aldprod01store.blob.core.windows.net/dcr/images/sevenroom-650px.jpg",
    tooltip: "HELLO"
  },
  text: {
    type: "text",
    text: "product description",
    tooltip: "text tooltip",
    style: {}
  },
  button: {
    type: "button",
    tooltip: "Navigate to Address on Google Maps",
    title: "Address",
    click: {
      actions: [
        {
          type: "link",
          name: "Address",
          uri: "https://maps.google.com/?q="
        }
      ]
    }
  }
};
