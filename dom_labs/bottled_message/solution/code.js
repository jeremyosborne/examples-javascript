window.onload = function() {
    // Assuming a minimum of IE 9 throughout.
    var template = function(message) {
        var template = document.querySelector("#template");
        template = template.textContent || template.innerHTML;
        return template.replace("{{message}}", message)
    };
    var sizer = document.querySelector("#sizer");

    document.querySelector("form").addEventListener("submit", function(e) {
        var message = document.querySelector("#message").value;
        var el;

        e.preventDefault();
        if (message) {
            sizer.innerHTML = template(message);
            el = sizer.querySelector(".bottle");

            (function() {
                var startingTop = window.innerHeight - el.clientHeight;
                var startingLeft = Math.floor(Math.random() * (window.innerWidth - el.clientWidth));
                var msPerFrame = 60;

                el.style.left = startingLeft + "px";
                el.style.top = startingTop + "px";

                // Animate with JavaScript.
                setTimeout(function() {
                    if (el.offsetTop > -el.clientHeight) {
                        el.style.top = el.offsetTop - 4 + "px";
                        setTimeout(arguments.callee, msPerFrame);
                    }
                    else {
                        el.parentNode.removeChild(el);
                    }
                }, msPerFrame);
                // Animate with CSS3
                // NOTE: Need the following CSS added to the style.css file.
                /*
                .bottle {
                    -moz-transition: all 3s ease;
                    -o-transition: all 3s ease;
                    -webkit-transition: all 3s ease;
                    transition: all 3s ease;
                }
                */
                /*
                setTimeout(function() {
                    el.style.OTransform = "translateY(-" + window.innerHeight + "px)";
                    el.style.MozTransform = "translateY(-" + window.innerHeight + "px)";
                    el.style.webkitTransform = "translateY(-" + window.innerHeight + "px)";
                }, 0);
                var removeMe = function() {
                    this.parentNode.removeChild(this);
                };
                el.addEventListener("transitionend", removeMe);
                el.addEventListener("oTransitionEnd", removeMe);
                el.addEventListener("webkitTransitionEnd", removeMe);
                */
            })();

            document.body.appendChild(el);
        }
    }, false);
};
