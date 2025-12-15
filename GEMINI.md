# FastQuiz - Project Overview

**FastQuiz** is a React-based web application that allows users to generate and take interactive quizzes from CSV files. It is built for speed and simplicity, featuring a clean, neo-brutalist design.

## Core Technology Stack

- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4) + `clsx` / `tailwind-merge`
- **CSV Parsing:** `papaparse`

## Architecture & Key Files

### Directory Structure
- `src/components/`: Contains the UI components for the three main application states.
  - `FileUpload.tsx`: Handle CSV file selection and parsing.
  - `QuizRunner.tsx`: The main quiz interface (questions, navigation).
  - `ResultsScreen.tsx`: Displays final score and navigation options.
- `src/utils/`: Utility functions.
  - `csvParser.ts`: Logic for parsing the raw CSV data into `Question` objects.
- `src/types.ts`: TypeScript definitions for the application's data model (`Question`, `Option`, etc.).
- `demo.csv`: A sample CSV file demonstrating the expected input format.

### Data Flow
The application state is managed in `App.tsx` and transitions through three phases:
1. **Upload (`'upload'`)**: User provides a CSV file.
2. **Quiz (`'quiz'`)**: User answers questions. Questions are shuffled upon start/restart.
3. **Results (`'results'`)**: User sees their score and can choose to restart (re-shuffle) or upload a new file.

### CSV Format Specification
The application expects a specific CSV structure designed for flexibility:
`Question, Option 1, Correct?, Option 2, Correct?, ...`

- **Flexible Options:** Supports variable numbers of options per question.
- **Multiple Correct Answers:** Each option is immediately followed by a boolean-like value (`TRUE`/`FALSE`) indicating if it is correct.

**Example:**
```csv
"¿Capital of France?","Paris",TRUE,"London",FALSE
"Select prime numbers","2",TRUE,"4",FALSE,"13",TRUE
```

## Development Workflow

### Installation
```bash
npm install
```

### Running Locally
Start the development server with HMR:
```bash
npm run dev
```

### Building for Production
Create a production-ready build in `dist/`:
```bash
npm run build
```

### Linting
Check for code quality issues:
```bash
npm run lint
```

## Conventions
- **Styling:** Tailwind utility classes are used directly in JSX.
- **State Management:** Local component state (`useState`) is preferred for UI logic.
- **Strict Typing:** All data structures are typed in `types.ts`.
