// TODO: 
// -> Implement a web worker (worker.js) that, when we post the word "count"
//    to it, begins counting to 10 billion.
// -> Start the counting when the user submits the "#counter" form.
// -> Every 1 billion, have the worker post a message back to the web page.
// -> Have the worker messages be displayed in the "#results" div of the page.
window.onload = function() {

    var worker = new Worker('worker.js');
    worker.onmessage = function (event) {
        var i,
            results = document.querySelector("#results");
        
        results.innerHTML += event.data + "<br/>";
    };
    
    document.querySelector('#counter').onsubmit = function() {
        worker.postMessage("count");
        return false;
    };              
    
};
