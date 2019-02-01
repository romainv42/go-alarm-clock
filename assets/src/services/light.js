const m = require("mithril");

const Light = {
  state: { isOn: false, level: 64 },
  load: () => {
    return m.request({
      method: "GET",
      url: "/api/light"
    })
      .then(result => {
        Light.state = result
      });
  },
  switch: () => {
    Light.state.isOn = !Light.state.isOn;
    Light.save();
  },
  changeState: v => {
    if (Light.state.isOn) {
      Light.state.level = parseInt(v);
      Light.save();
    }
  },
  save: () => {
    return m.request({
      method: "POST",
      url: `/api/light`,
      data: Light.state
    });
  }
};

module.exports = Light;
