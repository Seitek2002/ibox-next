"use client";

import React, { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Cart from "@/client-pages/Cart";

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    </Suspense>
  );
}
