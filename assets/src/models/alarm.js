const m = require("mithril");

const Alarms = {
  loadNext: () => {
    return m.request({
      method: "GET",
      url: "/api/alarm/next"
    })
      .then(result => Alarms.next = new Date(result.next * 1000))
  },
  loadList: () => {
    return m.request({
      method: "GET",
      url: "/api/alarm/list"
    })
      .then(result => {
        Alarms.list = result.data;
        Alarms.checksum = result.checksum;
      })
  },
  saveState: (index, state) => {
    const row = Alarms.list[index];
    row.enable = state;
    Alarms.save(index, row);
  },
  save: (index, data) => {
    return m.request({
      method: "PUT",
      url: `/api/alarm/${index}`,
      data: {
        data,
        checksum: Alarms.checksum
      }
    }).then(() => Alarms.loadList());
  },
  insert: (data) => {
    return m.request({
      method: "POST",
      url: `/api/alarm`,
      data: {
        data,
        checksum: Alarms.checksum
      }
    }).then(() => Alarms.loadList());
  },
  remove: (index) => {
    return m.request({
      method: "DELETE",
      url: `/api/alarm/${index}`,
      data: {
        checksum: Alarms.checksum
      }
    }).then(() => Alarms.loadList());
  },
  checksum: null,
  list: [],
  next: null
};

module.exports = Alarms;
