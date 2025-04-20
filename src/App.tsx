
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IssueFine from "./pages/officer/IssueFine";
import DriverFines from "./pages/driver/DriverFines";
import FineDetails from "./pages/driver/FineDetails";
import ManageOffenses from "./pages/admin/ManageOffenses";
import AdminReports from "./pages/admin/AdminReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Officer Routes */}
            <Route path="/officer/issue-fine" element={<IssueFine />} />
            <Route path="/officer/fines" element={<DriverFines />} />
            
            {/* Driver Routes */}
            <Route path="/driver/fines" element={<DriverFines />} />
            <Route path="/driver/fines/:id" element={<FineDetails />} />
            
            {/* Admin Routes */}
            <Route path="/admin/offenses" element={<ManageOffenses />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
