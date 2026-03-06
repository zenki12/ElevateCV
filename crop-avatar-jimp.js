const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');

async function processImage() {
    try {
        const inputPath = process.argv[2];
        const outputPath = path.join(__dirname, 'public', 'images', 'creator-avatar.png');

        // Ensure the output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        console.log(`Loading image from ${inputPath}`);
        const image = await Jimp.read(inputPath);

        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Let's crop a square region focused on the head and shoulders.
        const cropWidth = Math.floor(width * 0.45); // Take 45% of the width
        const left = Math.floor((width - cropWidth) / 2); // Center horizontally
        const top = Math.floor(height * 0.05); // Start 5% from the top

        console.log(`Cropping to ${cropWidth}x${cropWidth} at (${left}, ${top})`);

        image
            .crop(left, top, cropWidth, cropWidth) // (x, y, w, h)
            .resize(400, 400) // Resize for standard web usage
            .write(outputPath, () => {
                console.log(`Avatar successfully saved to ${outputPath}`);
            });

    } catch (err) {
        console.error("Error with Jimp:", err);
    }
}

processImage();
