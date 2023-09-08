function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}


function updateInputInformation(input, element) {
    const length = input.value.length;
    const words = length > 0 ? input.value.split(' ').length : 0;

    element.querySelector('.words').innerText = words + ' word' + (words === 1 ? '' : 's');
    element.querySelector('.length').innerText = length + ' character' + (length === 1 ? '' : 's');
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.title')) {
        const floatingTitle = document.createElement('div');
        floatingTitle.classList.add('floating-title');
        floatingTitle.innerHTML = "<strong>" + document.querySelector('.title').querySelector('h1').innerHTML + "</strong>";
        document.querySelector('main').prepend(floatingTitle);

        document.addEventListener('scroll', (e) => {
            const title = document.querySelector('.title');

            // check if title isn't in viewport
            if (title.getBoundingClientRect().top <= ((title.offsetHeight / 6) * -1)) {
                floatingTitle.classList.add('show');
            } else {
                floatingTitle.classList.remove('show');
            }
        });
    }

    document.querySelectorAll('.input .input-information').forEach((element) => {
        const input = element.closest('.input').querySelector('input, textarea');

        element.innerHTML = "<div class='words'></div><div class='length'></div>";


        input.addEventListener('keyup', (e) => {
            updateInputInformation(input, element);
        });

        updateInputInformation(input, element);
    });
});
