# E-commerce prototype

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/elstraks-projects/v0-e-commerce-prototype)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/lVAEVQLuETb)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/elstraks-projects/v0-e-commerce-prototype](https://vercel.com/elstraks-projects/v0-e-commerce-prototype)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/lVAEVQLuETb](https://v0.app/chat/lVAEVQLuETb)**

## AI try-on setup

The try-on flow is prepared for FASHN Virtual Try-On v1.6.

1. Copy `.env.example` to `.env.local`.
2. Add your API key:

```bash
FASHN_API_KEY=your_api_key_here
MONGODB_URI=your_mongodb_atlas_uri
MONGODB_DB=looklab
SESSION_SECRET=long_random_secret
```

3. Restart the Next.js dev server.

Without `FASHN_API_KEY`, the UI still works up to photo upload and shows a setup message instead of generating an image.

User accounts and saved AI try-ons use MongoDB Atlas. `SESSION_SECRET` signs the httpOnly session cookie.

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
