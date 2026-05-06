import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Today() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/today-shift", { replace: true }); }, []);
  return null;
}