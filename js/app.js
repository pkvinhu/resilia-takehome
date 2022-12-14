const notificationsApi = async (method) => {
  return await axios[method]("/notifications");
};

const getNotifications = async () => {
  try {
    const res = await notificationsApi("get");
    console.log(res);
    if (res.data.notifications.length) {
      let item = document.getElementById("notifications-container");
      item.innerHTML = "<h3>Notifications</h3><hr/>";
      res.data.notifications.forEach((notification, i) => {
        let div = document.createElement("div");
        div.className = `notification`;
        div.innerHTML = `${i + 1} ${notification}`;
        item.appendChild(div);
      });
    }
  } catch (err) {
    console.log(err);
    return;
  }
};

const clearNotifications = async () => {
  try {
    const res = await notificationsApi("delete");
    if (!res.data.notifications.length) {
      let item = document.getElementById("notifications-container");
      item.innerHTML = "";
      let div = document.createElement("div");
      div.innerHTML = "No Notifications!";
      item.appendChild(div);
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
