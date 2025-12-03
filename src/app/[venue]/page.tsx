"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * If user opens /:venue without spotId, redirect to /
 */
export default function VenuePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
