# Lab: Web Storage

Serve the files in `public/`. Some ways to single line serve the files:

node

    npm install -g node-static
    static -p 8000 public

[Other single line web servers](https://gist.github.com/willurd/5720255).

Files for the lab live in the `public/` directory. All work should be done in the `public/code.js` file.

Steps:

* Check for the existence of web storage and notify the user if it is missing.
* If web storage exists:
    * attach a listener to the form submit event
    * when a user submits the form
        * prevent the default behavior
        * save the name field to localStorage
        * save the email field to sessionStorage
        * reload the page
    * when a user clicks the clear button
        * clear localStorage and sessionStorage
    * when the page has loaded/DOM ready
        * check for name in localStorage
            * if it exists, place the name in the #name-storage
            * if it doesn't exist, place the string "N/A"
        * check for email in sessionStorage
            * if it exists, place the email in the #email-storage
            * if it doesn't exist, place the string "N/A"
