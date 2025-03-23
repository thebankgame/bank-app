# Bank Game Application (aka "Run Your Own Bank")

## Context
This app was created by one person in a matter of days, primarily for an interview at thrv. It was built to be a focus of conversation about software engineering, using a tech stack similar to that in use at thrv (TypeScript, Next.js, DynamoDB). I used a mix of AI tools while building the app, including Cursor, Windsurf, GitHub Copilot and Google Gemini. The AI tools built a core foundation of the app quickly, but as the application grew in complexity they made more mistakes and I found it faster to pivot toward writing much more manual code and using the AI tools for more targeted fixing of bugs and isolated code. 

### Next Steps
What's missing from this app? If I were going to take it to production, I would add a number of aspects more typical of production app, including: 
* Automated testing
* Localization
* Accessibility
* Instrumentation / Analytics

## Overview

The **Bank Game Application** is an interactive web application designed to teach kids about the fundamentals of banking and compound interest. Inspired by the book [The First National Bank of Dad](https://www.amazon.com/First-National-Bank-Dad-Foolproof/dp/1416534253), this app allows users to simulate running their own virtual bank. Parents can create accounts for their children, set interest rates, and demonstrate how money grows over time through savings and compound interest.

## Features

- **Account Management**: Create and manage multiple bank accounts.
- **Transaction Tracking**: Record deposits, withdrawals, and view transaction history.
- **Interest Simulation**: Visualize how money grows over time with compound interest.
- **Interactive Charts**: Use charts to project balances and simulate interest rates.
- **Authentication**: Secure login using AWS Cognito and NextAuth.
- **Authorization**: Row-level database security keeps your data safe from others.
- **Real-Time Updates**: Dynamically update balances and interest calculations.

## Why Use This Application?

This application is ideal for:
- **Parents**: Teach children the value of saving and the power of compound interest.
- **Educators**: Use as a tool to demonstrate financial literacy concepts in classrooms.
- **Individuals**: Experiment with different savings strategies and interest rates to understand financial growth.

## How It Works

1. **Authentication**: Users sign in using AWS Cognito.
2. **Dashboard**: After signing in, users are redirected to the dashboard where they can:
   - View account balances and transaction history.
   - Create new accounts or transactions.
   - Adjust interest rates and see the impact on savings.
3. **Interest Simulation**: The app calculates interest based on the annual rate and displays projections using interactive charts.
4. **Transaction History**: Users can view detailed transaction logs, including accumulated interest and running balances.

## Developer Guide

### Prerequisites

To run the application locally, ensure you have the following installed:
- **Node.js** (v16 or later)
- **npm** 
- **AWS Cognito**
- **DynamoDB Table**: A DynamoDB table named `BankAccounts` with the following schema:
  - Partition Key: `userId` (String)
  - Sort Key: `accountId` (String)

### Environment Variables

Create a `.env.local` file in the root directory and configure the following environment variables:

```
NEXTAUTH_URL=http://localhost:3000
COGNITO_CLIENT_ID=your-cognito-client-id
COGNITO_CLIENT_SECRET=your-cognito-client-secret
COGNITO_ISSUER=https://cognito-idp.<region>.amazonaws.com/<user-pool-id>
AWS_REGION=your-aws-region
COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
COGNITO_USER_POOL_ID=your-user-pool-id
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/bank-game.git
   cd bank-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
src/
├── app/
│   ├── api/                # API routes for server-side logic
│   ├── components/         # Reusable React components
│   ├── dashboard/          # Dashboard-related pages and components
│   ├── utils/              # Utility functions
│   ├── middleware.ts       # Middleware for authentication
│   ├── layout.tsx          # Root layout for the application
│   └── page.tsx            # Landing page
├── lib/                    # Shared libraries and actions
├── services/               # Service functions for external integrations
├── types/                  # TypeScript type definitions
└── utils/                  # Additional utility functions
```

## Key Technologies

- **Next.js**: Framework for building the application.
- **TypeScript**: Strongly typed programming language for safer code.
- **AWS DynamoDB**: NoSQL database for storing account and transaction data.
- **AWS Cognito**: Authentication and user management.
- **Chart.js**: Library for creating interactive charts.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- Inspired by the book [The First National Bank of Dad](https://www.amazon.com/First-National-Bank-Dad-Foolproof/dp/1416534253).
- Thanks to the open-source community for tools and libraries used in this project.



#