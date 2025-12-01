"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * If user opens /:venue without spotId, redirect to /scan
 */
export default function VenuePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/scan", { replace: true });
  }, [navigate]);

  return null;
}
