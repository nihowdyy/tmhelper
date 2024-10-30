const fs = require('fs');
const path = require('path');

// Load base stage Pokémon from JSON file
const baseStageFilePath = path.posix.join(__dirname, "..", "..", 'json', 'PokedexSV.json');
let baseStagePokemon = [];

try {
    const baseStageData = JSON.parse(fs.readFileSync(baseStageFilePath, 'utf8'));
    // Use a Set to ensure unique base stage names
    baseStagePokemon = Array.from(new Set(baseStageData.map(pokemon => pokemon.pokemon_info.basic_stage)));
    console.log("Unique base stage Pokémon:", baseStagePokemon); // Debug line
} catch (error) {
    console.error('Error reading base stage Pokémon JSON file:', error);
}

// Directory containing the files to check
const directoryPath = path.posix.join(__dirname, '..', 'pokemon'); // Specify your directory path

// Function to delete files not corresponding to base stage Pokémon
function deleteFilesNotInBaseStage() {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory:', err);
        }

        files.forEach(file => {
            const fileNameWithoutExtension = path.parse(file).name; // Get the file name without extension
            // Check if any base stage Pokémon name is included in the file name
            const matchesBaseStage = baseStagePokemon.some(baseStage => fileNameWithoutExtension.includes(baseStage));
            if (!matchesBaseStage) {
                const filePath = path.join(directoryPath, file);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file ${filePath}:`, err);
                    } else {
                        console.log(`Deleted: ${filePath}`);
                    }
                });
            }
        });
    });
}


// Call the function to delete files
deleteFilesNotInBaseStage();
