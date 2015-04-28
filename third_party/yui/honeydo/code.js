////////////////////////////////////////////////////////////////////////////////
// Rebuilding a very basic note pad with YUI.
//
// YUI is a well known JavaScript framework that is very full featured
// and is used to deal with the usual problematic pieces of JavaScript --
// DOM manipulation, events, cross browser problems -- but provides a
// larger set of tools beyond the basics.
//

// The YUI use statement performs, behind the scenes, a load event check
// before firing.
// We declare the libraries that we wish to use in our code and they are
// loaded into our application asynchronously. They are made available to
// the callback function, and by default the sandboxed YUI object is named
// Y.
YUI().use("node", "event", "anim", function(Y) {
        // YUI uses selectors.
    var notepad = Y.one("#notepad"),
        trash = Y.one("#trash");
    
    Y.one("form").on("submit", function(e) {
            // The "get" and "set" methods are common in YUI and are used
            // to get a computed version of the DOM properties.
        var text = Y.one("#new-note").get("value"),
            // YUI can chain common methods together.
            note = Y.Node.create("<div>").setHTML(text).addClass("note");
            
        notepad.insert(note, 0);

        note.on("click", function() {
            var anim;
            // In YUI, the this reference is a YUI Node, not the DOM element.
            if (notepad.compareTo(this.get("parentNode"))) {
                trash.append(this);
            }
            else {
                anim = new Y.Anim({
                    node: this,
                    to: { opacity: 0 }
                });
                anim.on("end", function() {
                    // this === anim
                    var node = this.get('node'); 
                    node.remove();
                });
                anim.run();
            }
        });

        // In YUI, since the event is always available, it should be
        // used to kill the form submit.
        e.preventDefault();

    });
    
});
