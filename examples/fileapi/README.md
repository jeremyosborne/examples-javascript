Assuming you have [Node.js](http://nodejs.org) installed:

    npm install
    node server

* Open the browser to localhost and the correct port.
* Grab an image from your computer.
* Drop the image into the browser.
* Image is drawn in canvas.
* Repeat.

Images are not stored and will disappear on refresh.

Example makes use of [canvas](https://developer.mozilla.org/en-US/docs/HTML/Canvas).

Example focuses on the [FileReader](http://dev.w3.org/2006/webapi/FileAPI/#dfn-filereader) object of the `File API`.

The server does nothing but serve the files, which is a prerequisite for getting the Drag and Drop ability to work, which gives the FileReader something to work with.
