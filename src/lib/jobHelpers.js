/**
 * Job Data Adapter / Helper Functions
 * Bridges old job schema (product, requestedGallons, tank) with new schema (products[])
 */

export function getJobProduct(job) {
  if (!job) return "Unknown Product";
  if (job.product) return job.product;
  if (job.products && job.products.length > 0) return job.products[0].name;
  return "Unknown Product";
}

export function getJobRequestedGallons(job) {
  if (!job) return 0;
  if (job.requestedGallons) return job.requestedGallons;
  if (job.products && job.products.length > 0) {
    return job.products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  }
  return 0;
}

export function getJobAssets(job) {
  if (!job) return [];
  if (job.assets) return job.assets;
  if (job.products) {
    return job.products.flatMap(p => p.assets || []);
  }
  return [];
}

export function getJobPrimaryAsset(job) {
  const assets = getJobAssets(job);
  return assets.length > 0 ? assets[0] : null;
}

export function getJobTank(job) {
  if (!job) return null;
  if (job.tank) return job.tank;
  const asset = getJobPrimaryAsset(job);
  const gallons = getJobRequestedGallons(job);
  return {
    id: asset?.name || "Unassigned Tank",
    product: getJobProduct(job),
    capacity: Math.max(gallons * 2, gallons + 500),
    currentLevel: 0,
    lastKnownLevel: 0,
  };
}

export function getJobSiteName(job) {
  if (!job) return "Unknown Site";
  if (job.site?.name) return job.site.name;
  if (job.stopName) return job.stopName;
  return "Unknown Site";
}

export function getJobNotes(job) {
  if (!job) return "";
  return job.instructions || job.notes || job.dispatchNotes || "";
}

export function getJobHasNotes(job) {
  return Boolean(getJobNotes(job));
}

export function getJobProductColor(job) {
  if (!job) return "#888";
  if (job.products && job.products.length > 0 && job.products[0].color) {
    return job.products[0].color;
  }
  return "#888";
}

// Status model
export const STATUS_LABELS = {
  pending:      "Pending",
  en_route:     "En Route",
  loading:      "Loading",
  bol_captured: "BOL Captured",
  approaching:  "Approaching",
  arrived:      "Arrived",
  site_verified:"Site Verified",
  delivering:   "Delivering",
  pod_required: "POD Required",
  completed:    "Completed",
  exception:    "Exception",
};

export const STATUS_NEXT_ROUTE = {
  pending:      (id) => `/job/${id}/load`,
  en_route:     (id) => `/job/${id}/load`,
  loading:      (id) => `/job/${id}/bol`,
  bol_captured: (id) => `/job/${id}/navigate`,
  approaching:  (id) => `/job/${id}/navigate`,
  arrived:      (id) => `/job/${id}/arrive`,
  site_verified:(id) => `/job/${id}/deliver`,
  delivering:   (id) => `/job/${id}/deliver`,
  pod_required: (id) => `/job/${id}/pod`,
  completed:    (id) => `/job/${id}/complete`,
  exception:    (id) => `/exception?jobId=${id}`,
};

export const STATUS_NEXT_LABEL = {
  pending:      "Start Delivery",
  en_route:     "Continue to Load Instructions",
  loading:      "Capture BOL",
  bol_captured: "Navigate to Site",
  approaching:  "Confirm Arrival",
  arrived:      "Verify Site / Tank",
  site_verified:"Enter Delivery",
  delivering:   "Continue Delivery Entry",
  pod_required: "Capture POD",
  completed:    "View Completed Summary",
  exception:    "View Exception",
};