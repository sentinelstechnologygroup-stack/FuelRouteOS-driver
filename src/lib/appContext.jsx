import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

// Simplified: Day / Night / Accessible
export const APPEARANCES = { DAY: "day", NIGHT: "night", ACCESSIBLE: "accessible" };
export const FONT_SIZES = { STANDARD: "standard", LARGE: "large", XLARGE: "xlarge" };
export const MAPS_APPS = { GOOGLE: "google", APPLE: "apple", WAZE: "waze", ASK: "ask" };

const FONT_SIZE_MAP = {
  standard: "15px",
  large:    "17px",
  xlarge:   "20px",
};

function applyAppearance(appearance) {
  const root = document.documentElement;
  // Remove all appearance classes first
  root.classList.remove("dark", "light", "high-contrast", "cb-mode");
  if (appearance === APPEARANCES.NIGHT) {
    root.classList.add("dark");
  } else if (appearance === APPEARANCES.DAY) {
    root.classList.add("light");
  } else if (appearance === APPEARANCES.ACCESSIBLE) {
    // accessible = light base + high contrast overrides
    root.classList.add("light");
    root.classList.add("high-contrast");
    root.classList.add("cb-mode");
  }
}

function applyFontSize(size) {
  const base = FONT_SIZE_MAP[size] || FONT_SIZE_MAP.standard;
  document.documentElement.style.fontSize = base;
  document.documentElement.style.setProperty("--fros-font-base", base);
}

// Eagerly apply on module load (before React hydration) to prevent flash
if (typeof document !== "undefined") {
  const savedAppearance = localStorage.getItem("fros_appearance") || APPEARANCES.NIGHT;
  const savedFont = localStorage.getItem("fros_font") || FONT_SIZES.STANDARD;
  applyAppearance(savedAppearance);
  applyFontSize(savedFont);
}

export function AppProvider({ children }) {
  const [appearance, setAppearanceState] = useState(
    () => localStorage.getItem("fros_appearance") || APPEARANCES.NIGHT
  );
  const [fontSize, setFontSizeState] = useState(
    () => localStorage.getItem("fros_font") || FONT_SIZES.STANDARD
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => localStorage.getItem("fros_motion") === "true"
  );
  const [largeTapTargets, setLargeTapTargets] = useState(
    () => localStorage.getItem("fros_tap") === "true"
  );
  const [mapsApp, setMapsAppState] = useState(
    () => localStorage.getItem("fros_maps") || MAPS_APPS.GOOGLE
  );
  const [termsAccepted, setTermsAccepted] = useState(
    () => localStorage.getItem("fros_terms") === "true"
  );

  const setAppearance = (val) => {
    setAppearanceState(val);
    localStorage.setItem("fros_appearance", val);
    applyAppearance(val);
  };

  const setFontSize = (val) => {
    setFontSizeState(val);
    localStorage.setItem("fros_font", val);
    applyFontSize(val);
  };

  useEffect(() => { applyAppearance(appearance); }, [appearance]);
  useEffect(() => { applyFontSize(fontSize); }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("fros_motion", reducedMotion);
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem("fros_tap", largeTapTargets);
    document.documentElement.classList.toggle("large-tap", largeTapTargets);
  }, [largeTapTargets]);

  const setMapsApp = (val) => {
    setMapsAppState(val);
    localStorage.setItem("fros_maps", val);
  };

  const acceptTerms = () => {
    setTermsAccepted(true);
    localStorage.setItem("fros_terms", "true");
  };

  // Expose isDark for components that still need it
  const isDark = appearance === APPEARANCES.NIGHT;

  return (
    <AppContext.Provider value={{
      appearance, setAppearance,
      fontSize, setFontSize,
      reducedMotion, setReducedMotion,
      largeTapTargets, setLargeTapTargets,
      mapsApp, setMapsApp,
      isDark,
      termsAccepted, acceptTerms,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}