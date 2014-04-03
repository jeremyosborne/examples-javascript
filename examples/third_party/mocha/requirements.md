# Activity: Words on a webpage



## Summary

Using a language of your choice, write unit tests and a method that count the number of content words on a web page.

For this exercise, write all tests before writing any code to fulfill the tests.



## Requirements

Using a programming language of your choice:

* Expose utility methods named `web_word_counter` and `get_web_page`.
    * The package/class/object/module that this method belongs to is up to you and should be governed by the best practices of your programming language.
* `web_word_counter` must accept 1 argument, and that argument is a url.
* `web_word_counter` should delegate to `get_web_page`.
* `get_web_page` should return a parsed web document, containing all content of the `body` element from the web page.
* `web_word_counter` should parse the content string returned from `get_web_page` and count the number of words on the page.
* `web_word_counter` should return an integer of the number of words counted on the page, or 0 if the web content contained no words.
* `web_word_counter` should raise an exception if, for some reason, the web page retrieved is not parseable or returns something other than a 200 status code for the HTTP request.



## Notes

* Your job is to test `web_word_counter` and mock out `get_web_page`.
    * These are meant to be unit tests, do not initiate HTTP requests.
* Your tests should correctly pass expected output.
* Your tests should test for, and pass if an exception is raised, in expected exceptional situations.
* When you are complete with the tests and code, make sure to test with a real web page, hopefully something simple, where you can confirm or deny the results.
