const switchDisplay = function (toBig) {
    [...document.getElementsByClassName("big")].forEach(element => {
        element.className = "small"
    });
    document.getElementById(toBig).className = "big";
}


module.exports = {
    switchDisplay
};