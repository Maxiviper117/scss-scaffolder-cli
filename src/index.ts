#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Structure {
    [key: string]: string[];
}

// 7/1 SCSS structure
const structure: Structure = {
    abstracts: ["_variables.scss", "_mixins.scss", "_functions.scss"],
    base: ["_reset.scss", "_typography.scss"],
    components: ["_buttons.scss", "_cards.scss"],
    layout: ["_header.scss", "_footer.scss", "_grid.scss"],
    pages: [],
    themes: [],
    vendors: [],
};

/**
 * Create SCSS folder structure based on the selected options.
 * @param {string} destination - Root folder for SCSS structure.
 * @param {Structure} selectedStructure - Folders and files to create.
 */
async function createStructure(
    destination: string,
    selectedStructure: Structure
): Promise<void> {
    try {
        await fs.mkdir(destination, { recursive: true });

        for (const [folder, files] of Object.entries(selectedStructure)) {
            const folderPath = path.join(destination, folder);
            await fs.mkdir(folderPath, { recursive: true });

            for (const file of files) {
                const filePath = path.join(folderPath, file);
                await fs.writeFile(filePath, `// ${file}`, { flag: "wx" });
            }
        }

        const mainFilePath = path.join(destination, "main.scss");
        const imports = Object.keys(selectedStructure)
            .map((folder) => `@import '${folder}/*';`)
            .join("\n");

        await fs.writeFile(mainFilePath, imports, { flag: "wx" });

        console.log(`🎉 SCSS structure created at: ${destination}`);
    } catch (error) {
        if (error.code === "EEXIST") {
            console.log(
                "⚠️ Some files or folders already exist and were skipped."
            );
        } else {
            console.error(`❌ Error creating structure: ${error.message}`);
        }
    }
}

/**
 * Prompt the user for configuration options.
 */
async function promptOptions(): Promise<{
    destination: string;
    folders: string[];
}> {
    const questions = [
        {
            type: "input",
            name: "destination",
            message:
                "Enter the destination folder for the SCSS structure (default: ./scss):",
            default: "./scss",
        },
        {
            type: "checkbox",
            name: "folders",
            message:
                "Select the folders you want to include in your SCSS structure:",
            choices: Object.keys(structure),
            default: Object.keys(structure),
        },
    ];

    return inquirer.prompt(questions);
}

/**
 * Main entry point for the CLI.
 */
async function run(): Promise<void> {
    console.log("🛠️ Setting up your 7/1 SCSS structure...");
    const { destination, folders } = await promptOptions();

    // Filter the selected folders from the full structure
    const selectedStructure = folders.reduce((acc, folder) => {
        acc[folder] = structure[folder];
        return acc;
    }, {});

    const absoluteDestination = path.resolve(__dirname, destination);
    await createStructure(absoluteDestination, selectedStructure);
}

// Run the CLI
run().catch((err: Error) => {
    console.error(`❌ Unexpected error: ${err.message}`);
    process.exit(1);
});
