# pdf-editable-builder

Author: [Manuel Tardivo](mailto:manuel.tardivo.lavoro@gmail.com)

This repository allows you to generate and edit dynamic PDFs based on JSON data using HTML templates.

## Getting Started

### Prerequisites

- Install [BUN](https://bun.sh/docs/installation)

### Installation

```bash
bun install
```

### Running the Application

```bash
bun run index.js
```

## How It Works

There is a `talent.json` file located in the `src/data` folder. This JSON file contains all the data needed to autocomplete the CV.

### Templates

Inside the `src/template` folder, you will find the following templates:

- `cv.editable.template.html`: Makes the CV editable inside the webapp (FORM).
- `cv.view.template.html`: Displays the CV inside the webapp.
- `cv.template.html`: Shows the actions sidebar for the webapp.
- `cv.export.template.html`: Contains the view CV form for export.

## Usage

1. Place your JSON data in the `src/data/talent.json` file.
2. Modify the HTML templates in the `src/template` folder as needed.
3. Run the application to generate and edit PDFs based on the provided JSON data and templates.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [Manuel Tardivo](mailto:manuel.tardivo.lavoro@gmail.com).
