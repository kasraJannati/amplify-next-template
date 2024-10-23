## AWS Amplify Next.js (App Router) Project Management App

This repository contains the Project Management App, which allows users to manage projects and tasks efficiently. The application is built using Next.js (App Router) and AWS Amplify, providing seamless hosting and authentication.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.
- **Frontend Framework**: Built with Next.js for optimized performance and SEO.
- **Styling**: Utilizes SCSS for enhanced styling capabilities, allowing for modular and maintainable styles.
- **UI Components**: Incorporates AWS Amplify UI for pre-built, customizable UI components.
- **Responsive Design**: Leverages Tailwind CSS for utility-first styling, ensuring a responsive and visually appealing interface.

## Getting Started

To set up the Project Management App locally, follow these steps:

1. Clone the repository:
   `git clone <repository-url>
cd <repository-directory>`

2. Install dependencies:
   `npm install`

3. Set up local AWS credentials: If you don't have AWS credentials set up, follow the instructions [here](https://docs.amplify.aws/nextjs/start/account-setup/).

4. Deploy the cloud sandbox: Run the following command to deploy the cloud sandbox:
   `npx ampx sandbox`

   Once the cloud sandbox has been fully deployed (approximately 5 minutes), the **amplify_outputs.json** file will be updated with connection information to a new isolated authentication and data backend.

5. Run the development server: Start the development server:
   `npm run dev`

   The `npx ampx sandbox` command should run concurrently with your `npm run dev`. You can think of the cloud sandbox as the "localhost equivalent" for your app backend.
