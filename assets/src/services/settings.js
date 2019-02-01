const m = require("mithril");

const Settings = {
  volume: 0,
  load: () => {
    m.request({
      method: "GET",
      url: "/api/settings"
    })
      .then(result => Settings.volume = parseInt(result.volume));
  },
  save: (v) => {
    Settings.volume = parseInt(v);
    m.request({
      method: "POST",
      url: "/api/settings",
      data: Settings
    })
  }
}


module.exports = {
  Settings
};
