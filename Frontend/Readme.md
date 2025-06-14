This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

Before running the application, you need to set up your environment variables:

### Option 1: Using the Setup Script (Recommended)
```bash
# Using npm script
npm run setup your_civic_client_id_here

# Or directly with node
node setup-env.js your_civic_client_id_here
```

### Option 2: Manual Setup
1. Create a `.env.local` file in the root directory
2. Add your Civic authentication client ID:

```bash
# Civic Authentication Configuration
CIVIC_CLIENT_ID=your_civic_client_id_here
```

**Important Security Notes:**
- Never commit your `.env.local` file to version control
- The `.env.local` file is already included in `.gitignore`
- Replace `your_civic_client_id_here` with your actual Civic client ID
- For production deployment, set these environment variables in your hosting platform

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
