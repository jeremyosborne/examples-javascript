window.onload = function() {
    var tests = {
        email: function(val) {
            // See: http://regexpal.com/
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*$/;
            return re.test(val);
        },
        text: function(val) {
            // For the rules of the lab, text fields two words, and no
            // more than two words.
            var re = /^\w+\s\w+$/;
            return re.test(val)
        }
    };

    var validate = function(form) {
        var inputs = form.querySelectorAll("input[type=text], input[type=email]");
        var i, input;
        for (var i = 0; i < inputs.length; i++) {
            input = inputs[i];
            if (tests[input.type](input.value)) {
                //alert("GOOD");
                input.className = input.className
                    .replace(/\s?invalid\s?/, "");
                input.parentNode.className = input.className
                    .replace(/\s?invalid\s?/, "");
            }
            else {
                //alert("BAD");
                if (input.className.indexOf("invalid") == -1) {
                    input.className = input.className + " invalid";
                    input.parentNode.className = input.parentNode.className + " invalid";
                }
            }
        }
    };

    document.querySelector("form").onsubmit = function(e) {
        // W3C || IE
        e = e || window.event;
        if (e.preventDefault) {
            // !IE
            e.preventDefault();
        }
        else {
            // IE
            e.returnValue = false;
        }

        try {
            validate(this);
        }
        catch(err) {
            console.log(err);
        }
    };
};


