import { Navigate, Route, Routes } from "react-router-dom";

import Header from "@/components/layout/Header";
import PDPPage from "@/pages/PDP/PDPPage";
import PLPPage from "@/pages/PLP/PLPPage";

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<PLPPage />} />
        <Route path="/products/:id" element={<PDPPage />} />
      </Routes>
    </div>
  );
}
