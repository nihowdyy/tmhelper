const fs = require('fs');
const path = require('path');

// Directory containing the images
const imagesDir = path.posix.join(__dirname, 'pokemon');

// Directory where the JSON file will be saved
const outputDir = path.posix.join(__dirname, '..', '..', 'json');

// Function to extract Pokémon names including prefixes
const extractPokemonName = (fileName) => {
    const parts = fileName.split('-');
    const nameWithExtension = parts[1];
    const name = nameWithExtension.replace('.png', '');
    return name;
};

// Function to generate the image map
const generateImageMap = () => {
    const imageMap = {};

    try {
        // Read the filenames in the directory
        const imageFiles = fs.readdirSync(imagesDir);
        console.log('Files found:', imageFiles); // Debug line

        if (imageFiles.length === 0) {
            console.log('No image files found in the directory.');
        }

        imageFiles.forEach(file => {
            console.log('Processing file:', file); // Debug line

            // Check if the file is a valid image
            if (path.extname(file) === '.png') { // Adjust to your file type
                const pokemonName = extractPokemonName(file);

                if (pokemonName) {
                    // Directly assign the image path to the Pokémon's key
                    if (!imageMap[pokemonName]) {
                        imageMap[pokemonName] = '../../assets/images/' + path.posix.join('pokemon', file);
                    }
                }
            } else {
                console.log(`Skipping non-image file: ${file}`);
            }
        });

    } catch (error) {
        console.error('Error reading directory or processing files:', error);
    }

    return imageMap;
};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    console.log('Output directory does not exist. Creating it...');
    try {
        fs.mkdirSync(outputDir, { recursive: true });
    } catch (error) {
        console.error('Error creating output directory:', error);
        process.exit(1);
    }
}

// Generate the image map and write it to a JSON file
const imageMap = generateImageMap();
console.log(JSON.stringify(imageMap, null, 2));
const imageMapPath = path.posix.join(outputDir, 'pokeImageMap.json');

try {
    fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2), 'utf8');
    console.log(`Image map generated successfully at ${imageMapPath}!`);
} catch (error) {
    console.error('Error writing JSON file:', error);
}
