(function() {

var randomNumberList = [],
    i;

for (i = 1; i <= 75; i++) {
    randomNumberList[i-1] = i;
}

var random = function() {
    var total = randomNumberList.length,
        index = Math.floor(Math.random() * total),
        value = randomNumberList[index];

        randomNumberList.splice(index, 1);

        return value
};

var newCard = function() {
    var i,
        el;

    for (i = 0; i < 24; i++) {
        var newNum = random();

        el = document.getElementById("square" + i) ;
        el.innerHTML = newNum;
        el.onclick = function() {

            if (!this.className) {
                this.className = "marker";
            }
            else {
                this.className = "";
            }
        };
    }

    document.getElementById("cdate").innerHTML = new Date();
};

window.onload = newCard;

})();
