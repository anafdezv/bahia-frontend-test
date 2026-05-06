import { Link, Route, Routes } from "react-router-dom";

import { Button } from "@/components/ui/button";

function HomePlaceholder() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col items-start gap-6 px-4 py-12">
      <p className="text-sm font-medium text-muted-foreground">Hito 1</p>
      <h1 className="text-3xl font-semibold tracking-tight">Mini E-commerce SPA</h1>
      <p className="max-w-2xl text-muted-foreground">
        Estructura base del proyecto lista: React + Tailwind + shadcn/ui + Express.
      </p>
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link to="/products">Ir al PLP (próximo hito)</Link>
        </Button>
      </div>
    </main>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col items-start gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">Página pendiente del siguiente hito.</p>
      <Button asChild variant="outline">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePlaceholder />} />
      <Route path="/products" element={<PlaceholderPage title="Product List Page" />} />
      <Route path="/products/:id" element={<PlaceholderPage title="Product Detail Page" />} />
    </Routes>
  );
}
