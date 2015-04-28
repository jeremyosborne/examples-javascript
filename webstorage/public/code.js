window.onload = function() {

    var todoLists = {
        // localStorage list of todos.
        "perm": [],
        // sessionStorage list of todos.
        "temp": []
    };

    var todoTemplate = document.querySelector("#todo-template").text;
    todoTemplate = Handlebars.compile(todoTemplate);

    var notificationTemplate = document.querySelector("#notification-template").text;
    notificationTemplate = Handlebars.compile(notificationTemplate);

    var renderTodos = function() {
        document.querySelector("#sessionStorage-todos ul").innerHTML = todoTemplate({ todos: todoLists.temp });

        document.querySelector("#localStorage-todos ul").innerHTML = todoTemplate({ todos: todoLists.perm });
    };

    var notify = function(message) {
        var notificationContainer = document.querySelector("#notification-container");
        notificationContainer.innerHTML = notificationTemplate(message);
        setTimeout(function() {
            notificationContainer.innerHTML = "";
        }, 1500);
    };


    //---------------- Implement localStorage and sessionStorage.

    // You're probably not lacking local storage, but I've left this here anyway.
    if (!window.localStorage || !window.sessionStorage) {
        notify("You seem to be lacking Web Storage. Example will break");
        return;
    }

    // Writing to localStorage and sessionStorage is simple.
    // They're key value pairs, all data being strings.
    // There is no method to call to persist, we leave it to the browser
    // to flush from cache.
    // Web storage APIs are synchronous.
    var createTodo = function(who, what, temp) {
        var todo = {
            "when": (new Date()).toLocaleString(),
            "who": who,
            "what": what
        };
        if (!temp) {
            todoLists.perm.push(todo);
            localStorage.todos = JSON.stringify(todoLists.perm);
        }
        else {
            todoLists.temp.push(todo);
            sessionStorage.todos = JSON.stringify(todoLists.temp);
        }
    };

    document.querySelector("#todo-submission").onsubmit = function(e) {
        var who = this.querySelector("#who").value;
        var what = this.querySelector("#what").value;
        var temp = this.querySelector("#temp").checked;

        e.preventDefault();

        if (who && what) {
            createTodo(who, what, temp);
            renderTodos();
        }
    };

    // We can delete specific keys, or we can clear the storage completely
    // for this domain.
    document.querySelector("#clear-storage").onclick = function() {
        localStorage.clear();
        sessionStorage.clear();
        todoLists = {
            "perm": [],
            "temp": []
        };

        notify("localStorage and sessionStorage cleared.");

        renderTodos();
    };

    // Reading from either localStorage or sessionStorage is equivalent
    // to getting the key/property from the respective object.
    // Key doesn't exist, probably not stored.
    // If data is serialized as JSON, we can unserialize it with JSON.parse.
    if (localStorage.todos) {
        try {
            todoLists.perm = JSON.parse(localStorage.todos);
        }
        catch(e) {
            console.error("Failure parsing localStorage.todos", e);
        }
        if (!Array.isArray(todoLists.perm)) {
            todoLists.perm = [];
        }
    }

    if (sessionStorage.todos) {
        try {
            todoLists.temp = JSON.parse(sessionStorage.todos);
        }
        catch(e) {
            console.error("Failure parsing sessionStorage.todos", e);
        }
        if (!Array.isArray(todoLists.temp)) {
            todoLists.temp = [];
        }
    }

    // Draws any todos we have pulled from local storage.
    renderTodos();
};
