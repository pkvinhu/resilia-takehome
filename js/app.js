const getNotifications = (session) => {
  /* prepare api call */
  axios.defaults.withCredentials = true;
  let payload = {
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  axios
    .get("/notifications", payload.headers)
    .then((res) => {
      if(res.data.notifications.length) {

        let item = document.getElementById("notifications-section");
        item.innerHTML = "";
        res.data.notifications.forEach((notification, i) => {
            let div = document.createElement("div");
            div.className = `notification`;
            div.innerHTML = `${i+1} ${notification}`
            item.appendChild(div)
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return;
    });
  return;
};
