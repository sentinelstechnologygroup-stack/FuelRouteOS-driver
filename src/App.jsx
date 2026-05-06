import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { DriverProvider } from "@/lib/driverContext";
import { AppProvider } from "@/lib/appContext";

import DriverLogin from "@/pages/DriverLogin";
import StartShift from "@/pages/StartShift";
import Today from "@/pages/Today";
import TodayShift from "@/pages/TodayShift";
import JobDetail from "@/pages/JobDetail";
import StopDetail from "@/pages/StopDetail";
import LoadInstructions from "@/pages/LoadInstructions";
import BolCapture from "@/pages/BolCapture";
import SiteVerification from "@/pages/SiteVerification";
import DeliveryEntry from "@/pages/DeliveryEntry";
import PodCapture from "@/pages/PodCapture";
import CompletedJob from "@/pages/CompletedJob";
import ExceptionReport from "@/pages/ExceptionReport";
import RouteMap from "@/pages/RouteMap";
import ScanPage from "@/pages/ScanPage";
import SyncStatus from "@/pages/SyncStatus";
import Profile from "@/pages/Profile";
import DriverLayout from "@/components/driver/DriverLayout";
import DispatchChat from "@/pages/DispatchChat";
import ArrivalNavigation from "@/pages/ArrivalNavigation";
import InventorySummary from "@/pages/InventorySummary";
import PreTripInspection from "@/pages/PreTripInspection";
import PostTripInspection from "@/pages/PostTripInspection";
import VehicleIssueReport from "@/pages/VehicleIssueReport";
import RecordOrder from "@/pages/RecordOrder";
import ScheduleOrder from "@/pages/ScheduleOrder";
import ScheduleDeliveryOrder from "@/pages/ScheduleDeliveryOrder";
import ScheduleLoadOrder from "@/pages/ScheduleLoadOrder";
import ScheduleExtractionOrder from "@/pages/ScheduleExtractionOrder";
import OrderWell from "@/pages/OrderWell";
import RecordTransfer from "@/pages/RecordTransfer";
import CreateAsset from "@/pages/CreateAsset";
import AppSettings from "@/pages/AppSettings";
import NewOrderForm from "@/pages/NewOrderForm";
import TermsAcceptance from "@/pages/TermsAcceptance";
import LegalPage from "@/pages/LegalPage";
import DriverHome from "@/pages/DriverHome";

const NotFoundRoute = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <h1 className="text-2xl font-bold">Screen not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This FuelRouteOS Driver screen could not be found.
      </p>
      <a
        href="/home"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        Return Home
      </a>
    </div>
  </div>
);

const AppRoutes = () => (
  <DriverProvider>
    <Routes>
      <Route path="/" element={<DriverLogin />} />
      <Route path="/home" element={<DriverHome />} />
      <Route path="/start-shift" element={<StartShift />} />

      <Route path="/today-shift" element={<TodayShift />} />
      <Route path="/today" element={<Today />} />

      <Route path="/record-order" element={<RecordOrder />} />
      <Route path="/record-order/delivery" element={<ScheduleDeliveryOrder />} />
      <Route path="/record-order/delivery/new" element={<NewOrderForm />} />
      <Route path="/record-order/load" element={<ScheduleLoadOrder />} />
      <Route path="/record-order/load/new" element={<NewOrderForm />} />
      <Route path="/record-order/extraction" element={<ScheduleExtractionOrder />} />
      <Route path="/record-order/extraction/new" element={<NewOrderForm />} />

      <Route path="/schedule-order" element={<ScheduleOrder />} />
      <Route path="/schedule-order/delivery" element={<ScheduleDeliveryOrder />} />
      <Route path="/schedule-order/delivery/new" element={<NewOrderForm />} />
      <Route path="/schedule-order/load" element={<ScheduleLoadOrder />} />
      <Route path="/schedule-order/load/new" element={<NewOrderForm />} />
      <Route path="/schedule-order/extraction" element={<ScheduleExtractionOrder />} />
      <Route path="/schedule-order/extraction/new" element={<NewOrderForm />} />

      <Route path="/order-well" element={<OrderWell />} />
      <Route path="/record-transfer" element={<RecordTransfer />} />
      <Route path="/create-asset" element={<CreateAsset />} />
      <Route path="/settings" element={<AppSettings />} />

      <Route element={<DriverLayout />}>
        <Route path="/route" element={<RouteMap />} />
        <Route path="/chat" element={<DispatchChat />} />
        <Route path="/sync" element={<SyncStatus />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/pre-trip" element={<PreTripInspection />} />
      <Route path="/post-trip" element={<PostTripInspection />} />
      <Route path="/vehicle-issue" element={<VehicleIssueReport />} />

      <Route path="/inventory" element={<InventorySummary />} />

      <Route path="/stop/:jobId" element={<StopDetail />} />

      <Route path="/job/:jobId" element={<JobDetail />} />
      <Route path="/job/:jobId/load" element={<LoadInstructions />} />
      <Route path="/job/:jobId/bol" element={<BolCapture />} />
      <Route path="/job/:jobId/navigate" element={<ArrivalNavigation />} />
      <Route path="/job/:jobId/arrive" element={<SiteVerification />} />
      <Route path="/job/:jobId/deliver" element={<DeliveryEntry />} />
      <Route path="/job/:jobId/pod" element={<PodCapture />} />
      <Route path="/job/:jobId/complete" element={<CompletedJob />} />

      <Route path="/exception" element={<ExceptionReport />} />

      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/accessibility-statement" element={<LegalPage type="accessibility" />} />
      <Route path="/data-use" element={<LegalPage type="data_use" />} />
      <Route path="/terms-acceptance" element={<TermsAcceptance />} />

      <Route path="*" element={<NotFoundRoute />} />
    </Routes>
  </DriverProvider>
);

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
