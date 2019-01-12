const m = require("mithril")
const { timeBox } = require("./time");

const main = {
    view: () => {
        return m(".container", m(timeBox));
    }
};

module.exports = {
    main
};
