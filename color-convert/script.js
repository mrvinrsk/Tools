const formats = [
    {name: "hex", pattern: /^#(?:[0-9a-fA-F]{3}){1,2}$/},
    {name: "rgb", pattern: /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/},
    {name: "rgba", pattern: /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/},
    {name: "hsl", pattern: /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/},
    {name: "hsla", pattern: /^hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*(\d+)\)$/},
];

document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("#input");

    input.addEventListener("input", () => {
        // check if input matches any of the formats, if not try adding a hash at the beginning and check hex again
        const text = input.innerText.trim();

        const inputFormat = formats.find(format => format.pattern.test(text));

        if (!inputFormat) {
            console.log("Input format couldn't be determined.");

            for (let i = 1; i < 5; i++) {
                document.getElementById(`output-value-${i}`).innerText = "";
                document.getElementById(`output-format-${i}`).innerText = "-";
            }
            return;
        }

        document.getElementById('input-format').innerText = inputFormat.name.toUpperCase();

        const result = convert(text);

        let index = 1;

        for (const format in result.output) {
            if (format === inputFormat.name) continue;

            document.getElementById(`output-value-${index}`).innerText = result.output[format].string;
            document.getElementById(`output-format-${index}`).innerText = format.toUpperCase();
            index++;
        }
    });
});

function convert(input) {
    const startTime = new Date().getTime();

    // get input format
    const inputFormat = formats.find(format => format.pattern.test(input));

    // convert to hex
    const hex = input.replace(inputFormat.pattern, (match, ...args) => {
        return match;
    });

    // Initialize an empty output object
    const output = {};

    // If the input format is not found, return an error message
    if (!inputFormat) {
        return {
            error: "Invalid input format"
        };
    }

    // Now, let's convert to all formats
    formats.forEach(format => {
        // Skip converting to the same format as the input
        if (format.name === inputFormat.name) {
            return;
        }

        // Implement the conversion logic for each format
        switch (format.name) {
            case "hex":
                output.hex = hex;
                break;

            case "rgb":
                // convert hex to rgb
                const rgb = hexToRgb(hex);
                output.rgb = rgb;
                break;

            case "rgba":
                // convert hex to rgba
                const rgba = hexToRgba(hex);
                output.rgba = rgba;
                break;

            case "hsl":
                // convert hex to hsl
                const hsl = hexToHsl(hex);
                output.hsl = hsl;
                break;

            case "hsla":
                // convert hex to hsla
                const hsla = hexToHsla(hex);
                output.hsla = hsla;
                break;

            default:
                break;
        }
    });

    const endTime = new Date().getTime();
    const ms = endTime - startTime;

    return {
        format: inputFormat,
        output: output,
        time: ms
    };
}

// Define your conversion functions here

function hexToRgb(hex) {
    // Remove the hash (#) symbol if it's present
    hex = hex.replace(/^#/, '');

    // Parse the hex value into separate R, G, and B components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {r, g, b};
}

function hexToRgba(hex) {
    // Remove the hash (#) symbol if it's present
    hex = hex.replace(/^#/, '');

    // Parse the alpha value from the input hex color
    let alpha = 1; // Default alpha value
    if (hex.length === 8) {
        alpha = parseInt(hex.substring(6, 8), 16) / 255;
        hex = hex.substring(0, 6); // Remove the alpha part from the hex
    }

    // Parse the hex value into separate R, G, and B components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {r, g, b, a: alpha};
}

function hexToHsl(hex) {
    // ... (no changes here)
}

function hexToHsla(hex) {
    // Remove the hash (#) symbol if it's present
    hex = hex.replace(/^#/, '');

    // Parse the alpha value from the input hex color
    let alpha = 1; // Default alpha value
    if (hex.length === 8) {
        alpha = parseInt(hex.substring(6, 8), 16) / 255;
        hex = hex.substring(0, 6); // Remove the alpha part from the hex
    }

    // Parse the rest of the hex value into separate R, G, and B components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Normalize R, G, and B values
    const rNormalized = r / 255;
    const gNormalized = g / 255;
    const bNormalized = b / 255;

    // Find the minimum and maximum values
    const max = Math.max(rNormalized, gNormalized, bNormalized);
    const min = Math.min(rNormalized, gNormalized, bNormalized);

    // Calculate the luminance
    const l = (max + min) / 2;

    let h, s;

    if (max === min) {
        // Achromatic (gray)
        h = 0;
        s = 0;
    } else {
        // Calculate the saturation
        s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

        // Calculate the hue
        switch (max) {
            case rNormalized:
                h = (gNormalized - bNormalized) / (max - min) + (gNormalized < bNormalized ? 6 : 0);
                break;
            case gNormalized:
                h = (bNormalized - rNormalized) / (max - min) + 2;
                break;
            case bNormalized:
                h = (rNormalized - gNormalized) / (max - min) + 4;
                break;
        }

        h /= 6;
    }

    // Convert hue to degrees
    h *= 360;

    return {h, s, l, a: alpha};
}
