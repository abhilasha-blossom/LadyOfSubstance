# LadyOfSubstance - Deployment Guide

This document outlines the steps to deploy the LadyOfSubstance e-commerce platform to production.
The repository is split into two halves: `/client` (Frontend) and `/server` (Backend).

## 1. Database Setup (Supabase / PostgreSQL)
1. Create a new project in [Supabase](https://supabase.com).
2. Go to **Project Settings -> Database** and copy the **Connection string (URI)**.
3. Replace `[YOUR-PASSWORD]` in the string with your actual database password. This will be your `DATABASE_URL`.
4. Run your Prisma migrations against the production database:
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

## 2. Backend Deployment (Render or Railway)
The Node.js Express server should be deployed as a web service.

**Configure Environment Variables:**
- `DATABASE_URL`: Add the Supabase connection string from above.
- `JWT_SECRET`: Generate a strong, random cryptographic string for securing API tokens.
- `RAZORPAY_KEY_ID`: Your Razorpay project Key ID.
- `RAZORPAY_KEY_SECRET`: Your Razorpay project Secret Key.
- `CORS_ORIGIN`: Set this to your deployed Frontend URL (e.g., `https://ladyofsubstance.vercel.app`) to strictly permit cross-origin requests.

**Build and Start Commands:**
- Build Command: `npm install && npx tsc`
- Start Command: `npm start` (which runs `node dist/index.js`)

## 3. Frontend Deployment (Vercel)
The Vite React client should be deployed to a static CDN host like Vercel or Netlify.

**Configure Environment Variables:**
- `VITE_API_URL`: The deployed URL of your backend followed by `/api` (e.g., `https://ladyofsubstance-api.onrender.com/api`).
- `VITE_RAZORPAY_KEY_ID`: Your exact Razorpay project Key ID (safe to expose publicly).

**Build Settings:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## 4. Final Verification
- Log in to the application.
- Submit a test order using a Razorpay test card.
- Navigate to the `/admin` dashboard.
- Update the order status and ensure metrics track correctly.
