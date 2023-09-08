// Define languages and their associated patterns and weights
const languages = [
    {name: "CSS", patterns: /[{}:;]/g, weight: 0.6},
    {
        name: "JavaScript",
        patterns: /\bfunction\b|\bvar\b|\blet\b|\bconst\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\breturn\b|\bdocument\.querySelector\b|\bconsole\.[a-zA-Z]+\b|\baddEventListener\b|\bRegExp\b|\bsplit\b|\blength\b|\=\>|\.\forEach\b|\bnew [A-Za-z]|\bsetInterval\b|\bsetTimeout\b|\bclearInterval\b|\bclearTimeout\b|\bparseInt\b|\bparseFloat\b|\bisNaN\b|\b\.toString\b|\b\.toFixed\b|\b\.replace\b|\b\.toLowerCase\(\)\b|\b\.toUpperCase\(\)\b|\(\)/g,
        weight: 1.6
    },
    {name: "HTML", patterns: /<\w+\s|<\/\w+>/g, weight: 0.75},
];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    input.focus();

    // get all supported languages in alphabetical order
    const supportedLanguages = languages.map((language) => language.name).sort();
    document.getElementById('languages').innerText = supportedLanguages.join(', ');

    // Only show the first 3 languages in the short list (+ the number of remaining languages)
    const supportedLanguagesShort = supportedLanguages.slice(0, 3);
    const remainingLanguages = supportedLanguages.length - supportedLanguagesShort.length;

    document.getElementById('languages-short').innerText = supportedLanguagesShort.join(', ') + (remainingLanguages > 0 ? ' <a href="#information" title="Show all available languages">+' + remainingLanguages + '</a>' : '');

    input.addEventListener('input', () => {
        const input = document.getElementById('input');
        const output = document.getElementById('output');

        if (input.value) {
            try {
                const min = minify(input.value);
                output.value = min.minified.code;

                // update stats – TODO: Animate (count) and add certainty.
                document.getElementById('language').innerText = min.language.language.name ?? "?";
                document.getElementById('reduction').innerText = min.reduction + '%';
                document.getElementById('time').innerText = min.time + 'ms';
            } catch (e) {
                output.classList.add('error');
            }

            updateInputInformation(output, output.closest('.input').querySelector('.input-information'));

            console.log(min);
        } else {
            document.getElementById('language').innerText = "-";
            document.getElementById('reduction').innerText = "-";
            document.getElementById('time').innerText = "-";

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

    switch (language ? language.toString().toLowerCase() : lang.language.name.toLowerCase()) {
        case "css":
            console.log("Minify CSS");

            // Minify CSS

            // remove any spaces outside of literal strings
            code = code.replace(/(["'])(.*?)\1/g, (match, quote, content) => {
                return quote + content.replace(/\s/g, '') + quote;
            });
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
            console.log("Minify JavaScript");

            // Minify JavaScript
            // TODO: Rename variables (a, b, c, aa, ab, ac, etc.)
            break;


        case "html":
            console.log("Minify HTML");

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

    // GLOBAL MINIFICATION
    code = code.replace(/\t/g, ''); // remove tabs
    code = code.replace(/ +/g, ' '); // remove unnecessary spaces
    code = code.replace(/\/\/.*/g, ''); // remove single line comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, ''); // remove multi line comments
    code = code.replace(/\n/g, ''); // remove line breaks

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
