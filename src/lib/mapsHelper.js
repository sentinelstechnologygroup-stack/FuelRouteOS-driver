/**
 * FuelRouteOS — Maps URL Helper
 * Builds a navigation URL based on the user's selected default maps app.
 * Used by: ArrivalNavigation, StopDetail, TodayShift, DriverHome
 */
import { MAPS_APPS } from "@/lib/appContext";

export function buildMapsUrl(address, mapsApp = MAPS_APPS.GOOGLE) {
  if (!address) return null;
  const encoded = encodeURIComponent(address);

  switch (mapsApp) {
    case MAPS_APPS.APPLE:
      return `https://maps.apple.com/?q=${encoded}`;
    case MAPS_APPS.WAZE:
      return `https://waze.com/ul?q=${encoded}&navigate=yes`;
    case MAPS_APPS.ASK:
      // "ask" means show a picker — caller handles it by checking mapsApp === "ask"
      return null;
    case MAPS_APPS.GOOGLE:
    default:
      return `https://maps.google.com/?q=${encoded}`;
  }
}

export function getMapsAppLabel(mapsApp) {
  switch (mapsApp) {
    case MAPS_APPS.APPLE: return "Apple Maps";
    case MAPS_APPS.WAZE:  return "Waze";
    case MAPS_APPS.ASK:   return "Ask Every Time";
    default:              return "Google Maps";
  }
}