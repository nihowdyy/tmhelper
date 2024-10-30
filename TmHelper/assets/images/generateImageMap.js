const fs = require('fs');
const path = require('path');

// Directory containing the images
const imagesDir = path.posix.join(__dirname, 'locations');

// Directory where the JSON file will be saved
const outputDir = path.posix.join(__dirname, '..', '..', 'json');

// Load base stage Pokemon from JSON file
const baseStageFilePath = path.posix.join(__dirname, "..", "..", 'json', 'PokedexSV.json')
let baseStagePokemon = [];

try {
    const baseStageData = JSON.parse(fs.readFileSync(baseStageFilePath, 'utf8'));
    // Use a Set to ensure unique base stage names
    baseStagePokemon = Array.from(new Set(baseStageData.map(pokemon => pokemon.pokemon_info.basic_stage)));
    console.log("Unique base stage Pokémon:", baseStagePokemon); // Debug line
} catch (error) {
    console.error('Error reading base stage Pokémon JSON file:', error);
}

// Function to extract Pokémon names including prefixes and handle multiple map types
const extractPokemonName = (fileName) => {
    // Remove the file extension
    let namePart = path.parse(fileName).name;

    // Split the name into parts
    const parts = namePart.split(' ');

    // Define possible prefixes
    const prefixes = ["Hisuian", "Alolan", "Galarian"];

    // Handling if a prefix is found
    for (const prefix of prefixes) {
        if (parts[0] === prefix) {
            // If the first word is a known prefix
            const baseName = parts.slice(0, 2).join(' '); // Base name includes the prefix and one more word
            console.log(`Parsing file name: ${fileName}, extracted name part: ${baseName}`);
            return baseName;
        }
    }

    // Default handling if no prefix is found
    const baseName = parts[0];
    console.log(`Parsing file name: ${fileName}, extracted name part: ${baseName}`);
    return baseName;
};

// Function to generate the image map
const generateImageMap = () => {
    const imageMap = {};

    try {
        const imageFiles = fs.readdirSync(imagesDir);
        console.log('Files found:', imageFiles); // Debug line

        if (imageFiles.length === 0) {
            console.log('No image files found in the directory.');
        }

        imageFiles.forEach(file => {
            console.log('Processing file:', file); // Debug line

            if (path.extname(file) === '.jpg') { // Adjust to your file type
                const pokemonName = extractPokemonName(file);

                // Only proceed if the Pokémon name is in the base stage list and not already in imageMap
                if (pokemonName && baseStagePokemon.includes(pokemonName) && !imageMap[pokemonName]) {
                    const friendlyName = path.parse(file).name.replace(/_/g, ' ');

                    imageMap[pokemonName] = [{
                        name: friendlyName,
                        image: path.posix.join('..', '..', 'assets', 'images', 'locations', file)
                    }];
                } else {
                    console.log(`Skipping duplicate or non-base stage Pokémon: ${pokemonName}`);
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
const imageMapPath = path.posix.join(outputDir, 'imageMap.json');

try {
    fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2), 'utf8');
    console.log(`Image map generated successfully at ${imageMapPath}!`);
} catch (error) {
    console.error('Error writing JSON file:', error);
}
