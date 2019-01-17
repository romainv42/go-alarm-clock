const m = require("mithril");

const Alarms = {
  loadNext: () => {
    return m.request({
      method: "GET",
      url: "/api/alarm/next"
    })
      .then(result => Alarms.next = new Date(result.next))
  },
  loadList: () => {
    return m.request({
      method: "GET",
      url: "/api/alarm/list"
    })
      .then(result => Alarms.list = result)
  },
  saveState: (index, state) => {
    const row = Alarms.list[index];
    row.enable = state;
    Alarms.save(index, row);
  },
  save: (index, data) => {
    console.log(data);
    return m.request({
      method: "POST",
      url: `/api/alarm/save/${index}`,
      data: data
    })
      .then(() => Alarms.loadList());
  },
  list: [],
  next: null
};

module.exports = Alarms;
