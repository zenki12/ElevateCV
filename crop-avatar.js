const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function cropAvatar() {
    const inputPath = process.argv[2];
    const outputPath = path.join(__dirname, 'public', 'images', 'creator-avatar.png');

    // Ensure the output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    try {
        const metadata = await sharp(inputPath).metadata();
        const width = metadata.width;
        const height = metadata.height;

        // The face seems to be in the upper center of this relatively tall image.
        // Let's crop a square region focused on the head and shoulders.

        // Approximate coordinates based on standard portrait proportions
        const cropWidth = Math.floor(width * 0.5); // Take 50% of the width
        const cropHeight = cropWidth; // Make it square

        const left = Math.floor((width - cropWidth) / 2); // Center horizontally
        const top = Math.floor(height * 0.05); // Start 5% from the top

        await sharp(inputPath)
            .extract({ left: left, top: top, width: cropWidth, height: cropHeight })
            .resize(400, 400) // Standardize the size
            .png()
            .toFile(outputPath);

        console.log(`Successfully cropped avatar to ${outputPath}`);
    } catch (error) {
        console.error("Error processing image:", error);
    }
}

cropAvatar();
