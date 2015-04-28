// Moustache/handlebar like templates.
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g,
    evaluate: /\{\%(.+?)\%\}/g
};

// Relies on being loaded after template script tags are available.
var TEMPLATES = {
    tableRow: _.template($("#table-row-template").html()),
    tableHeader: _.template($("#table-header-template").html()),
    table: _.template($("#table-template").html()),
    itemDetail: _.template($("#item-detail-template").html())
};
