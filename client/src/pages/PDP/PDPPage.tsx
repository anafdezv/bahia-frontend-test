import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function PDPPage() {
  const { id } = useParams();

  return (
    <main className="mx-auto flex min-h-[calc(100svh-140px)] w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Product detail</h1>
      <p className="text-muted-foreground">PDP implementation is next. Current selected product id: {id}</p>
      <Button asChild variant="outline" className="w-fit">
        <Link to="/products">Back to products</Link>
      </Button>
    </main>
  );
}
