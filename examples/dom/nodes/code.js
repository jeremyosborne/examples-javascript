window.onload = function() {

    var notepad = document.getElementById("notepad"),
        // Add a reference to the trashcan.
        trash = document.getElementById("trash");

    document.forms[0].onsubmit = function() {
        var note = document.getElementById("new-note"),
            text = document.createTextNode(note.value),
            p = document.createElement("p");

        p.appendChild(text);
        // The formal DOM way of setting attributes to an element are with
        // the setAttribute method. Rarely needed in real life, but it does
        // allow for access to the real attribute name (like "class" vs.
        // "className").
        p.setAttribute("class", "note")

        // Another point in favor of using DOM objects (sometimes) is when
        // we want to add DOM event listeners at the time of creation.
        // We want to allow the user to click on the element and,
        // if the note is still in the notepad, move it to the trash
        // or
        // if the note is already in the trash, delete it
        p.onclick = function() {
            // We can always get access to the parentNode of an element.
            // parentNode will only be null if the element is the HTML element
            // or the element has not yet been added to the page.
            // While it is rarely required, we can use the getAttribute
            // method to get an attribute value from a node.
            if (this.parentNode.getAttribute("id") == "notepad") {
                // We're still in the notepad, move to trash.
                // Append child acts as a "move", not a copy for elements.
                trash.appendChild(this);
            }
            else {
                // We must be in the trash, delete.
                // To remove a node from the page, we must call removeChild,
                // and it must be called on the parent of the node we
                // want to remove (silly or not, that's the way it is).
                this.parentNode.removeChild(this);
            }
        };

        notepad.insertBefore(p, notepad.firstChild);

        return false;
    };
};
