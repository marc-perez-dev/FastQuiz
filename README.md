# FastQuiz
¡Claro que sí! Aquí tienes la versión actualizada del README en inglés, manteniendo el mismo estilo e incorporando la información sobre el despliegue automático:

FastQuiz
This project is a fast and simple web application that allows you to generate and take interactive quizzes directly from CSV files. It stands out for its focus on speed and ease of use, all wrapped up in a clean, neobrutalist design.

To achieve this, the application is built on React 19 using Vite as the development environment. The main language used is TypeScript, which provides strict typing for the program's data and structures. The interface is styled using Tailwind CSS v4 utilities, while the core functionality of reading and processing the CSV files relies on the Papaparse library. Additionally, it incorporates i18next to manage internationalization and natively support multiple languages.

Getting the project up and running locally is very straightforward. Once you have downloaded the code, you must install the necessary dependencies by running npm install. After that, you can start the local development server using the npm run dev command. If you ever need to generate the optimized version to deploy it manually, simply run npm run build.

Furthermore, the project is configured for continuous deployment. Every new commit pushed to the main branch automatically triggers a build and deploys the application, making it publicly accessible at https://marc-perez-dev.github.io/FastQuiz/.

Using the application revolves around providing a CSV file with a highly flexible format. Each line in the file must first contain the question text, followed by an option, and immediately after, a value (such as TRUE or FALSE) indicating whether that answer is correct or not. You can add as many options as you need in the same row and define more than one valid answer per question. Once you upload the file, you will navigate through the questions in random order. At the end, you will see a screen with your final score, always keeping the option to retake the test or upload a completely new file.
