<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Minify | Tools</title>

    <link rel="stylesheet" href="../global.css">

    <script src="../script.js"></script>
    <script src="script.js"></script>
</head>
<body>

<main>
    <h1>Minify</h1>
    <p>The output gets automatically updated on every change.</p>

    <div class="form">
        <div>
            <label for="input">Code to minify (CSS/JS)</label>
            <textarea class="code" id="input" rows="6" style="resize: vertical;"></textarea>
        </div>

        <div>
            <label for="output">Output</label>
            <textarea readonly class="code" id="output" rows="6" style="resize: none;"></textarea>
            <button id="copy">Copy</button>
        </div>
    </div>
</main>

</body>
</html>
