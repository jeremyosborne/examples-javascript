var handleFiles = function(evt) {
    var files = evt.dataTransfer.files;
    var i;
    var f;
    var fr;
    var output = [];

    evt.stopPropagation();
    evt.preventDefault();

    for (i = 0; f = files[i]; i++) {
            output.push(
               '<li><strong>',
            f.name,
            '</strong> (',
            f.type || 'n/a',
            ') - ',
            f.size,
            ' bytes',
            '</li>'
        );

        fr = new FileReader();
        fr.onload = function(ev) {
                document.querySelector("#file-contents").innerHTML +=
                   "<pre>"+ev.target.result+"</pre>";
        };
        fr.readAsText(f);
    }
    document.querySelector('#file-info').innerHTML += output.join('');
};

var devnull = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
};

window.onload = function() {
    var dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('dragover', devnull, false);
    dropZone.addEventListener('drop', handleFiles, false);

    window.addEventListener('dragover', devnull, false);
    window.addEventListener('drop', devnull, false);
};