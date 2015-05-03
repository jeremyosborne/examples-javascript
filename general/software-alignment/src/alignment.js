/**
 * @fileoverview Software Alignment interactivity control code.
 */

(function() {

// Data is loaded synchronously and is a global object
var details_data = window.details_data;
  
// Compile templates
var details_template = Handlebars.compile($("#software-alignment-details-template").html());

$("#software-alignment td").hover(
    // Mouse over
    function() {
        // Highlight, but only if it is not already selected
        if (!$(this).hasClass("selected")) {
            $(this).addClass("highlight");
        }
    },
    // Mouse out
    function() {
        // Remove highlight
        $(this).removeClass("highlight");
    }
);

$("#software-alignment td").click(function() {
        // Law through chaos
    var xaxis,
        // good through evil
        yaxis; 

    // Return early if already selected
    if ($(this).hasClass("selected")) {
        return;
    }

    // Hide the initial instructions message
    $("#click-for-details-message").hide();

    // Remove the selected highlight from all table cells in case something
    // was selected before
    $("#software-alignment td").removeClass("highlight selected");
    $(this).addClass("selected");

    // Build our hackish data key from the class names.
    xaxis = (this.className).match(/([A-Za-z]*)-xaxis/)[1];
    yaxis = (this.className).match(/([A-Za-z]*)-yaxis/)[1];

    $("#software-alignment-details")
        .html(details_template(details_data[xaxis+"-"+yaxis]))
        .show();
});

})();

