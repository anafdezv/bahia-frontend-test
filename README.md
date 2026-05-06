# Front-End Test - Mini E-commerce SPA

This repository contains the initial setup for a mini e-commerce SPA with:

- React + TypeScript (Vite) for the client
- Tailwind CSS v4 + shadcn/ui for UI
- Express for the API server

## Project Setup

### Requirements

- Node.js `>= 20`
- npm `>= 10`

### Install Dependencies

From the project root:

```bash
npm install
```

### Run the Project

```bash
npm run start
```

This starts both apps in parallel:

- Client (Vite): `http://localhost:5173`
- Server (Express): `http://localhost:3000`

### Build

```bash
npm run build
```

Builds the client for production.

### Test

```bash
npm run test
```

Runs tests in all workspaces.

### Lint

```bash
npm run lint
```

Runs lint checks in all workspaces.

## Project Structure

```text
root/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── PLP/
│   │   │   └── PDP/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── components.json
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── index.js
│   ├── routes/
│   │   ├── product.js
│   │   └── cart.js
│   └── package.json
├── products.json
├── package.json
└── README.md
```