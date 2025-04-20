
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CreditCard, 
  FileText, 
  User, 
  LogOut, 
  Users, 
  Settings, 
  FilePlus,
  List,
  Home,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout, isOfficer, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determine role-specific nav items
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
        { name: "Manage Offenses", icon: <List className="h-5 w-5" />, path: "/admin/offenses" },
        { name: "Officers", icon: <Users className="h-5 w-5" />, path: "/admin/officers" },
        { name: "Fines Report", icon: <BarChart className="h-5 w-5" />, path: "/admin/reports" },
        { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/admin/settings" },
      ];
    } else if (isOfficer) {
      return [
        { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
        { name: "Issue Fine", icon: <FilePlus className="h-5 w-5" />, path: "/officer/issue-fine" },
        { name: "My Fines", icon: <FileText className="h-5 w-5" />, path: "/officer/fines" },
      ];
    } else if (isDriver) {
      return [
        { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
        { name: "My Fines", icon: <FileText className="h-5 w-5" />, path: "/driver/fines" },
        { name: "Payment History", icon: <CreditCard className="h-5 w-5" />, path: "/driver/payments" },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  // Get badge class based on user role
  const getBadgeClass = () => {
    if (isAdmin) return "admin-badge";
    if (isOfficer) return "officer-badge";
    if (isDriver) return "driver-badge";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar/Navigation */}
      <div className="bg-white md:w-64 w-full md:fixed md:h-screen border-r border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-finexpress-800">FineXpress</h1>
        </div>

        {/* User Information */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-finexpress-100 p-2 rounded-full">
              <User className="h-6 w-6 text-finexpress-600" />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <div className={getBadgeClass()}>
                {user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || '')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-2">
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className="mb-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => navigate(item.path)}
                >
                  <span className="mr-3 text-finexpress-600">{item.icon}</span>
                  {item.name}
                </Button>
              </li>
            ))}
            <li className="mt-4">
              <Button 
                variant="outline" 
                className="w-full justify-start font-normal text-finexpress-danger hover:text-finexpress-danger"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
