# Lab: File API

Serve the files in `public/`. Some ways to single line serve the files:

node

    npm install -g node-static
    static -p 8000 public

[Other single line web servers](https://gist.github.com/willurd/5720255).


* Lab work should be confined to code.js (shouldn't need to modify other files).
* Implement the ability for users to drag and drop files into the browser onto the #drop-zone.
* List meta information about the file: name, size, and type, if they are available, within the file-info tag.
* Read out the contents (using a FileReader) of a text file into the file-contents HTML element.
* Use the included "text.txt" to test things out.
