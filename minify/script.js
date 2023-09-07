document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    input.focus();

    input.addEventListener('input', () => {
        const input = document.getElementById('input').value;
        const output = document.getElementById('output');

        if (input) {
            const min = minify(input);
            output.value = min.minified.code;

            // update stats – TODO: Animate (count) and add certainty.
            document.getElementById('language').innerText = min.language.language.name;
            document.getElementById('reduction').innerText = min.reduction + '%';
            document.getElementById('time').innerText = min.time + 'ms';

            console.log(min);
        } else {
            output.value = '';
        }
    });

    output.addEventListener('click', () => {
        if (output.value) {
            output.select();
        }
    });

    document.getElementById('copy').addEventListener('click', (e) => {
        const output = document.getElementById('output');

        if (output.value) {
            // mark all text in output
            output.select();
            copyTextToClipboard(output.value);

            e.target.classList.add('copied');

            setTimeout(() => {
                e.target.classList.remove('copied');
            }, 1500);
        }
    });
});

function getLanguage(code) {
    // Define languages and their associated patterns and weights
    const languages = [
        {name: "css", patterns: /[{}:;]/g, weight: 0.6},
        {
            name: "javascript",
            patterns: /\bfunction\b|\bvar\b|\blet\b|\bconst\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\breturn\b|\bdocument\.querySelector\b|\bconsole\.[a-zA-Z]+\b|\baddEventListener\b|\bRegExp\b|\bsplit\b|\blength\b|\=\>|\.\forEach\b|\bnew [A-Za-z]|\bsetInterval\b|\bsetTimeout\b|\bclearInterval\b|\bclearTimeout\b|\bparseInt\b|\bparseFloat\b|\bisNaN\b|\b\.toString\b|\b\.toFixed\b|\b\.replace\b|\b\.toLowerCase\(\)\b|\b\.toUpperCase\(\)\b|\(\)/g,
            weight: 1.6
        },
        {name: "html", patterns: /<\w+\s|<\/\w+>/g, weight: 0.75}
    ];

    // Initialize variables to store language matches and total matches
    let topLanguage = null;
    let topWeightedMatchCount = 0;
    let totalWeightedMatchCount = 0;

    // Iterate through languages to calculate weighted match counts and determine top language
    languages.forEach((language) => {
        const matches = (code.match(language.patterns) || []).length;
        const weightedMatches = matches * language.weight;
        totalWeightedMatchCount += weightedMatches;

        if (weightedMatches > topWeightedMatchCount) {
            topLanguage = language.name;
            topWeightedMatchCount = weightedMatches;
        }
    });

    // Calculate certainty as a percentage of the top language's weighted match count relative to the total weighted matches
    const certainty = (topWeightedMatchCount / totalWeightedMatchCount) * 100;

    return {
        language: {
            name: topLanguage,
            certainty: certainty
        },
        matches: languages.reduce((matchesObj, language) => {
            matchesObj[language.name] = (code.match(language.patterns) || []).length;
            return matchesObj;
        }, {})
    };
}


function minify(code, language = null) {
    const startTime = new Date().getTime();
    const original = code;

    const lines = code.split('\n').length;

    const lang = getLanguage(code);

    // remove line breaks
    code = code.replace(/\n/g, '');

    switch (language ?? lang.language.name) {
        case "css":
            // Minify CSS
            code = code.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
            code = code.replace(/(?<=\n|^)\/\/.*/g, ''); // Remove single-line comments
            code = code.replace(/\s+/g, ' '); // Remove extra white spaces
            code = code.replace(/\s*([{}:;])\s*/g, '$1'); // Remove spaces around common CSS symbols
            code = code.replace(/;}/g, '}'); // Remove last semicolon in a block
            code = code.replace(/(?<=:|\s)0px(?=\s|;)/g, '0'); // Replace "0px" with "0", when there's no other numbers in the value

            // change rgb values to hex
            code = code.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (match, r, g, b) => {
                return "#" + parseInt(r).toString(16) + parseInt(g).toString(16) + parseInt(b).toString(16);
            });

            // change rgba values to hex
            code = code.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g, (match, r, g, b, a) => {
                return "#" + parseInt(r).toString(16) + parseInt(g).toString(16) + parseInt(b).toString(16) + parseInt(a).toString(16);
            });

            // change hsl values to hex
            code = code.replace(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/g, (match, h, s, l) => {
                return "#" + parseInt(h).toString(16) + parseInt(s).toString(16) + parseInt(l).toString(16);
            });

            // change hsla values to hex
            code = code.replace(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*(\d+)\)/g, (match, h, s, l, a) => {
                return "#" + parseInt(h).toString(16) + parseInt(s).toString(16) + parseInt(l).toString(16) + parseInt(a).toString(16);
            });

            // change hex values to short hex
            code = code.replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, (match, r, g, b) => {
                return "#" + r + g + b;
            });

            break;


        case "javascript":
            // Minify JavaScript
            code = code.replace(/\n/g, ''); // Remove line breaks
            code = code.replace(/\s+/g, ' '); // Remove unnecessary white spaces

            // TODO: Rename variables (a, b, c, aa, ab, ac, etc.)
            break;


        case "html":
            // Minify HTML
            code = code.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
            code = code.replace(/\s+/g, ' '); // Remove extra white spaces
            code = code.replace(/(?<=\n|^)\s*<\s*/g, '<'); // Remove spaces before tags
            code = code.replace(/(?<=\n|^)\s*>\s*/g, '>'); // Remove spaces after tags
            code = code.replace(/(?<=\n|^)\s*\/\s*>/g, '/>'); // Remove / in self-closing tags
            code = code.replace(/\n/g, ''); // Remove line breaks

        default:
            break;
    }

    const endTime = new Date().getTime();
    const ms = endTime - startTime;

    return {
        original: {
            lines: lines,
            code: original
        },
        minified: {
            code: code
        },
        language: lang,
        reduction: Math.round((1 - (code.length / document.getElementById('input').value.length)) * 100),
        time: ms
    };
}
