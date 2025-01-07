# SCSS Scaffolder CLI

A CLI tool for scaffolding SCSS folder and files based on the 7/1 architecture pattern.

## Installation

To install the CLI tool globally, run:

```sh
npm install -g scss-scaffolder-cli
```

## Usage

To run the CLI tool, use the following command:

```sh
scss-cli
```

You will be prompted to enter the destination folder and select the folders you want to include in your SCSS structure.

Alternatively, you can use `npx` to run the CLI tool without installing it globally:

```sh
npx scss-scaffolder-cli
```

## Options

- **destination**: The root folder for the SCSS structure (default: `./scss`).
- **folders**: The folders to include in your SCSS structure. You can select from the following options:
  - `abstracts`
  - `base`
  - `components`
  - `layout`
  - `pages`
  - `themes`
  - `vendors`

## Example

```sh
scss-cli
```

Follow the prompts to configure your SCSS structure. The tool will create the selected folders and files in the specified destination.

## License

This project is licensed under the GPL-3.0-or-later License.
