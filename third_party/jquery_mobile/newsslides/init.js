$(document).bind("mobileinit", function(){
    // default: "Loading..."
    $.mobile.loader.prototype.options.text = "Wait please";
    // default: false
    $.mobile.loader.prototype.options.textVisible = true;
});