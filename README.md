# Mini E-commerce SPA

Client-server monorepo for the front-end technical test:

- `client`: React + TypeScript + Vite
- `server`: Express API serving `products.json`
- Styling: Tailwind CSS v4 + shadcn/ui components

## Setup

### Requirements

- Node.js `>= 20`
- npm `>= 10`

### Install

From the repository root:

```bash
npm install
```

### Start (Client + Server)

```bash
npm run start
```

This runs both workspaces in parallel:

- Client: `http://localhost:5173`
- API server: `http://localhost:3000`

### Build

```bash
npm run build
```

Builds the client for production.

### Test

```bash
npm run test
```

Runs workspace tests (`client` + `server` when available).

### Lint

```bash
npm run lint
```

Runs linting in all workspaces.

## NPM Scripts (Root)

- `start`: run client and server together
- `build`: production build (client)
- `test`: run tests in workspaces
- `lint`: run lint in workspaces

## Project Structure

```text
root/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── product/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── PLP/
│   │   │   └── PDP/
│   │   ├── services/
│   │   ├── store/
│   │   ├── test/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── components.json
├── server/
│   ├── routes/
│   │   ├── product.js
│   │   └── cart.js
│   ├── index.js
│   └── package.json
├── products.json
├── package.json
└── README.md
```

## API Summary

- `GET /api/product` -> product list
- `GET /api/product/:id` -> product detail
- `POST /api/cart` -> accepts `{ id, size, total }`, returns `{ count }`

## Notes

- Pure SPA (client-side routing, no SSR).
- Cart count is persisted client-side.
- Product list/detail requests use local cache with 1-hour TTL.
