<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="UTF-8"/>
        <title>A day at the races</title>
        <link href="css/normalize.css" rel="stylesheet"/>
        <link href="css/style.css" rel="stylesheet"/>
    </head>
    <body>
        <div id="racetrack"></div>
        <script>
var DATA_BOOTSTRAP = {
    racers: {{{racers}}}
};
        </script>
        <script src="js/racers.js"></script>
        <script>
{{> TEMPLATES}}
        </script>
    </body>
</html>
