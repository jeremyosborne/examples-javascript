// TODO: Find the other TODO items in the code below and implement client
// side storage of data using localStorage and sessionStorage.
//
// NOTE: Chrome works well for testing this offline and without a server.
// Firefox has been known to disallow access to localStorage and 
// sessionStorage when testing a file from the file:// protocol.
window.onload = function() {

        // nameStorage and emailStorage are elements that will be used to
        // display the contents from localStorage and sessionStorage.
    var nameStorage = document.querySelector("#name-storage"),
        emailStorage = document.querySelector("#email-storage"),
        // When clearButton is clicked, we will erase localStorage and
        // sessionStorage.
        clearButton = document.querySelector("#clear-storage"),
        // The message element is used for diagnostic messages.
        message = document.querySelector("#reload-message"),
        // The form on the page that the user can use to submit their name
        // and email for insertion into Web Storage.
        form = document.querySelector("#test");


    // TODO: Check for the existence of localStorage and sessionStorage
    // objects before continuing.
    if (!window.localStorage || !window.sessionStorage) {
        alert("Sorry, we require a browser with the Web Storage functionality.");
        return;
    }

    // else....
    // Setup the form submit listener, which will trigger the save of
    // two strings into localStorage and sessionStorage.
    form.onsubmit = function(e) {
        // Retrieve the name and email from the form.
        var name = this.querySelector("#name").value,
            email = this.querySelector("#email").value;
            
        e.preventDefault();

        // TODO: If name and email exist, add the name to the name property
        // of localStorage and the email to the email property of 
        // sessionStorage.
        if (name && email) {
            localStorage.name = name;
            sessionStorage.email = email;

            // The page will reload, which will cause the page to re-read 
            // localStorage and sessionStorage (see below).
            message.innerHTML = "Reloading in just a second...";
            message.style.display = "block";
            setTimeout(function() {
                window.location.reload();                
            }, 1500);
        }
    };
    
    // Clicking on the clear button will clear the properties from
    // localStorage and sessionStorage.
    clearButton.onclick = function() {
        // TODO: Clear the used properties on localStorage and sessionStorage.
        localStorage.clear();
        sessionStorage.clear();
        
        // We refresh to prove that the properties have been cleared.
        message.innerHTML = "localStorage and sessionStorage cleared, refreshing page...";
        message.style.display = "block";
        setTimeout(function() {
            window.location.reload();                
        }, 1500);            
    };
    
    // During the page load, read from localStorage and sessionStorage.
    // We read and apply these separately to allow for experimentation
    // with the main difference between localStorage and sessionStorage.
    // After completing the code, try closing the browser tab and reopening
    // and you should see localStorage items still exist, but not 
    // sessionStorage.
    //
    //
    // TODO: Check for the existince of the name key in localStorage
    // and, if it exists, show the stored name within the nameStorage
    // element. If it does not exist, display "N/A".
    if (localStorage.name) {
        nameStorage.innerHTML = localStorage.name;
    }
    else {
        nameStorage.innerHTML = "N/A"
    }

    // TODO: Check for the existince of the email key in sessionStorage
    // and, if it exists, show the stored name within the emailStorage
    // element. If it does not exist, display "N/A".
    if (sessionStorage.email) {
        emailStorage.innerHTML = sessionStorage.email;
    }
    else {
        emailStorage.innerHTML = "N/A";
    }

};
