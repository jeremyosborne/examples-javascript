// Sample Backbone.js application.
$(document).ready(function() {



// Client side wrapper for model data retrieved from the server.
var Reagent = Backbone.Model.extend({
    // Make the name the id.
    idAttribute: "name",
    // Cache.
    _columns: null,
    // Describe the columns of our models.
    columns: function() {
        if (!this._columns) {
            this._columns = this.keys();
        }
        return this._columns;
    },
    // Mashup for alchemy details.
    _alchemyURL: "/alchemy",
    // Cache for alchemy information.
    _alchemy: null,
    // Helper to get details.
    _retrieveAlchemy: function() {
        var self = this;
        $.ajax({
                url: this._alchemyURL,
                dataType: "json",
                // params
                data: {
                    reagent: this.get("name")
                }
            })
            .success(function(data) {
                if (!data.length) {
                    //console.error("No alchemical recipes for:", self.get("name"));
                    data = [];
                }
                self.set("alchemy", data);
            })
            .fail(function(jqXHR) {
                console.log("Sorry, there was a failure: "+jqXHR.status+", "+jqXHR.statusText);
            });
    },
    // Override the get (not something you normally need to do).
    get: function(attr) {
        var val = Backbone.Model.prototype.get.apply(this, arguments);
        if (attr == "alchemy" && !val) {
            // Trigger a fetch of remote data not normally a part of our model.
            this._retrieveAlchemy();
        }

        return val;
    }
});



// Manage group of models.
// Publishes `model-selection-change` event through itself.
var ItemsController = Backbone.Collection.extend({

    initialize: function(models, options) {
        // URL will not be set automatically.
        this.url = options.url;

        // Keep reference to our selection router.
        this.selectedRouter = options.selectedRouter;

        this.selectedRouter.once("selected-route", _.bind(this.firstRoute, this));

        this.listenTo(this, "model-selected", this.selectModel);
    },

    // Which model, if any, is currently selected?
    // There can be only one (in this app).
    selectedModel: null,

    // Eventlistener to determine model we're dealing with.
    // Custom event, not a dom event. Expects {model: someModelReference}
    // as argument.
    // Passing a null reference cancels the selection.
    // Passing in the same reference cancels the selection.
    selectModel: function(ev) {
        var model = ev.model === this.selectedModel ? null : ev.model;
        this.selectedModel = model;
        this.trigger("model-selection-change", {model: this.selectedModel});

        // Persist in url.
        if (model) {
            this.selectedRouter.navigate("selected" + model.id);
        }
        else {
            this.selectedRouter.navigate("");
        }
    },

    // Eventlistener for the attached selection router, used once.
    // Expects {id: someModelId}
    firstRoute: function(ev) {
        var model = this.get(ev.id);
        if (!model) {
            // We're done before first load (since we don't bootstrap data).
            // Queue up for later load.
            this.retryFirstRouteId = ev.id;
            this.once("reset", this.retryFirstRoute);
        }
        else {
            this.selectModel({
                model: model
            });
        }
    },

    retryFirstRouteId: null,
    // Attempt to find the selection.
    retryFirstRoute: function() {
        var model = this.get(this.retryFirstRouteId);
        if (model) {
            this.selectModel({
                model: model
            });
        }
        else {
            console.warn("attempting to route to non existent selection:", this.retryFirstRouteId);
        }
    },

    // Describe the "columns" of our models contained in our collection.
    // Convenience.
    columns: function() {
        if (this.length) {
            return this.at(0).columns();
        }
        else {
            return [];
        }
    }
});



// Individual item view in the table.
// Publishes `model-selected` event through provided collection.
var ItemsTableRowView = Backbone.View.extend({

    // We need a reference to the collection/controller for pub/sub.
    collection: null,

    // The specific model we are viewing.
    model: null,

    // What events we are listening for.
    events: {
        "mouseenter": function(e) {
            this.$el.addClass("hover");
        },
        "mouseleave": function(e) {
            this.$el.removeClass("hover");
        },
        "click": function(e) {
            // Custom event.
            this.collection.trigger("model-selected", {
                model: this.model
            });
        }
    },

    // Since views are not really abstracted away from the DOM, the container
    // of the view can be set here to cut down on an unnecessary layer of
    // DOMSoup elements, and we can at least use that to keep our templates
    // one element lighter.
    tagName: "tr",
    className: "item-row",

    // We assume that our view will be loaded after the document is ready.
    // The template is located in the index.html.
    template: TEMPLATES.tableRow,

    // On construction of our view...
    initialize: function() {
        //...listen to the collection change event and rerender.
        // Looks like Backbone keeps context straight so I don't have to pass
        // a context object.
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        // Each view has an encapsulating element, which is created and
        // referenced by $el by the time we get here.
        // As long as .$el (the container) is in the page, this is what
        // facilitates only updating the changes to a specific element
        // in the page.
        this.$el.html(this.template({
            model: this.model,
            columns: this.model.columns()
        }));
        return this;
    }

});



// The row of headers for our table, which allows for dynamic creation of
// table header labels as well as sorting of the table.
var ItemsTableHeaderView = Backbone.View.extend({

    tagName: "thead",

    template: TEMPLATES.tableHeader,

    render: function() {
        var columns = this.collection.columns();
        var labels = _.map(columns, function(prop) {
            return Util.propToLabel(prop);
        });
        this.$el.html(this.template({labels: labels}));
        return this;
    }
});


// Manage a collection of reagents as a standard list.
var ItemsTableView = Backbone.View.extend({
    // We bind to a collection of reagents.
    collection: null,

    // Since we need a container, make this a table.
    tagName: "table",
    className: "items-table",
    // And we have some template for filler table header info.
    template: TEMPLATES.table,

    // Handles the header.
    _headerView: null,

    // What will our table be made of?
    initialize: function() {
        this._headerView = new ItemsTableHeaderView({
            collection: this.collection
        });
    },

    render: function() {
        var tableView = this;

        // Apply our base template to ourselves.
        this.$el.html(this.template());

        // Build our header.
        this.$el.prepend(this._headerView.render().$el);

        // Build our body.
        this.collection.forEach(function(model) {
            // We manage our own child views, one for each reagent.
            var reagentView = new ItemsTableRowView({
                collection: tableView.collection,
                model: model
            });

            tableView.$el.find("tbody").append(reagentView.render().$el);
        });

        return this;
    }
});



// Detail view for a particular reagent.
var ItemDetailView = Backbone.View.extend({
    // The collection/controller will tell us what is selected.
    collection: null,

    tagName: "div",
    className: "item-detail",
    template: TEMPLATES.itemDetail,

    // Whatever we consider the current selection.
    // Reference used for event cleanup.
    currentSelection: null,

    initialize: function() {
        this.listenTo(this.collection, "model-selection-change", this.modelSelected);
    },

    modelSelected: function() {
        if (this.currentSelection) {
            // cleanup previous listeners.
            this.currentSelection.off("change", this.render);
        }
        this.currentSelection = this.collection.selectedModel;
        if (this.currentSelection) {
            // Redraw if the model changes data.
            this.listenTo(this.currentSelection, "change", this.render);
        }

        // Always redraw on change.
        this.render();
    },

    render: function() {
        var model = this.collection.selectedModel;
        if (model) {
            // organize the model the way we want for this view, which will
            // trigger lazy loading.
            model = {
                name: model.get("name"),
                forageLevel: model.get("forageLevel"),
                value: model.get("value"),
                alchemy: model.get("alchemy")
            };
        }
        this.$el.html(this.template({
            selectedModel: model
        }));
        return this;
    }
});



// Following the trend of other frameworks, our top level object will be an
// App object.
var ItemsCompositeView = Backbone.View.extend({
    // We need to manage our own child views.
    itemsTableView: null,
    itemDetailView: null,

    // Kick everything off for our app.
    initialize: function(args) {
        this.itemsTableView = new ItemsTableView({
            collection: this.collection
        });
        this.itemDetailView = new ItemDetailView({
            collection: this.collection
        });

        this.listenTo(this.collection, "reset", this.render);

        this.render();
    },

    // We use our render view to perform an initial page load.
    render: function() {
        // we are the page, add everything to us.
        this.$el.append(this.itemsTableView.render().$el);
        this.$el.append(this.itemDetailView.render().$el);
        return this;
    }
});



// Keeps selected state in url fragment for page reload.
var SelectedRouter = Backbone.Router.extend({
    // Which paths we care about.
    routes: {
        "selected(:id)": "selected"
    },
    // Callback.
    selected: function(id) {
        this.trigger("selected-route", {
            id: id
        });
    }
});



// Backbone doesn't care how the app is organized, nor if we have an
// `App` object.
var App = function() {
    // Empty controller with override options.
    this.collection = new ItemsController([], {
        // What we wrap around raw objects added to the controller.
        model: Reagent,
        // Where can we get the JSON serialized objects.
        url: "/reagents",
        // Inject a router, used here only for pageload.
        selectedRouter: new SelectedRouter()
    });
    this.collection.fetch({
        reset: true
    });
    this.itemsView = new ItemsCompositeView({
        el: $("#main"),
        collection: this.collection
    });

    // Access history (to trigger routes on page load).
    Backbone.history.start();
};

var app = new App();

});
