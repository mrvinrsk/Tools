<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Minify | Tools</title>

    <link rel="stylesheet" href="../global.css">
    <link rel="stylesheet" href="style.css">

    <script src="../script.js"></script>
    <script src="script.js"></script>
</head>
<body>

<main>
    <div class="title">
        <h1>Minify</h1>
        <div class="limited">
            <p class="muted center">Minify all your code, to keep the filesize nice and low.</p>
        </div>
    </div>

    <div class="stats">
        <div class="stats-box">
            <p id="language">-</p>
            <span>Language</span>
        </div>
        <div class="stats-box">
            <p id="reduction">-</p>
            <span>Reduction</span>
        </div>
        <div class="stats-box">
            <p id="time">-</p>
            <span>Processed time</span>
        </div>
    </div>

    <div class="form">
        <div class="input">
            <label for="input">Code to minify (<span id="languages-short"></span>)</label>
            <textarea class="code" id="input" rows="6" style="resize: vertical;"></textarea>
            <div class="input-information"></div>
        </div>

        <div class="input">
            <label for="output">Output</label>
            <textarea readonly class="code" id="output" rows="6" style="resize: none;"></textarea>
            <div class="input-information"></div>
            <button id="copy">Copy</button>
        </div>
    </div>

    <div class="information">
        <strong class="is-headline">About the minifier</strong>
        <p>Currently supported languages are: <span id="languages"></span></p>

        <p>As of now, the minifying isn't perfect any may cause problems, if you encounter such, please, contact me.</p>
    </div>
</main>

</body>
</html>
