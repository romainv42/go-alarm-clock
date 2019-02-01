const m = require("mithril");

const Settings = {
  volume: 0,
  brightness: 0,
  auto: true,
  load: () => {
    m.request({
      method: "GET",
      url: "/api/settings"
    })
      .then(result => Settings.volume = parseInt(result.volume));
  },
  save: (item, v) => {
    Settings[item] = parseInt(v);
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
