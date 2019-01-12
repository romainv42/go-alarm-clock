const m = require("mithril")
const { timeBox } = require("./time");
const alarmBox = require("./alarm");

const main = {
    view: () => {
        return m(".container", [
          m(timeBox),
          m(alarmBox)
        ]);
    }
};

module.exports = {
    main
};
