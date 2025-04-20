
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserFines, formatCurrency, getOffenseById, getFineStatusDetails } from "@/data/mockData";
import { Fine } from "@/data/mockData";
import { FileText, CreditCard, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, isOfficer, isAdmin, isDriver } = useAuth();
  const [userFines, setUserFines] = useState<Fine[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fines = getUserFines(user.id, user.role || "");
      setUserFines(fines);
    }
  }, [user]);

  // Calculate summary statistics
  const totalFines = userFines.length;
  const pendingFines = userFines.filter(fine => fine.status === "Pending").length;
  const totalAmount = userFines.reduce((sum, fine) => sum + fine.amount, 0);
  const paidAmount = userFines
    .filter(fine => fine.status === "Paid")
    .reduce((sum, fine) => sum + fine.amount, 0);

  // Get the last 3 fines
  const recentFines = [...userFines].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  ).slice(0, 3);

  // Render different dashboard based on user role
  const renderDashboardContent = () => {
    if (isOfficer) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard 
              title="Total Fines Issued"
              value={totalFines}
              icon={<FileText className="h-8 w-8 text-finexpress-500" />}
              description="All time"
            />
            <StatCard 
              title="Pending Payments"
              value={pendingFines}
              icon={<Calendar className="h-8 w-8 text-yellow-500" />}
              description="Awaiting payment"
            />
            <StatCard 
              title="Total Amount"
              value={formatCurrency(totalAmount)}
              icon={<CreditCard className="h-8 w-8 text-finexpress-500" />}
              description="Total value of fines"
            />
            <StatCard 
              title="Collected Amount"
              value={formatCurrency(paidAmount)}
              icon={<ArrowUp className="h-8 w-8 text-green-500" />}
              description="Paid fines"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Fines</h2>
              <Button 
                variant="outline" 
                className="text-finexpress-600"
                onClick={() => navigate("/officer/fines")}
              >
                View All
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recentFines.map(fine => (
                <FineCard key={fine.id} fine={fine} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ActionCard 
                title="Issue New Fine"
                description="Create a new fine for a traffic violation"
                actionText="Issue Fine"
                onClick={() => navigate("/officer/issue-fine")}
              />
              <ActionCard 
                title="View My Fines"
                description="See all the fines you've issued"
                actionText="View Fines"
                onClick={() => navigate("/officer/fines")}
              />
            </div>
          </div>
        </>
      );
    } else if (isAdmin) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard 
              title="Total Fines"
              value={totalFines}
              icon={<FileText className="h-8 w-8 text-finexpress-500" />}
              description="All time"
            />
            <StatCard 
              title="Pending Payments"
              value={pendingFines}
              icon={<Calendar className="h-8 w-8 text-yellow-500" />}
              description="Awaiting payment"
            />
            <StatCard 
              title="Total Amount"
              value={formatCurrency(totalAmount)}
              icon={<CreditCard className="h-8 w-8 text-finexpress-500" />}
              description="Total value of fines"
            />
            <StatCard 
              title="Collected Amount"
              value={formatCurrency(paidAmount)}
              icon={<ArrowUp className="h-8 w-8 text-green-500" />}
              description="Collected revenue"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Fines</h2>
              <Button 
                variant="outline" 
                className="text-finexpress-600"
                onClick={() => navigate("/admin/reports")}
              >
                View Reports
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recentFines.map(fine => (
                <FineCard key={fine.id} fine={fine} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Admin Actions</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ActionCard 
                title="Manage Offenses"
                description="Update traffic offense list and fine amounts"
                actionText="Manage"
                onClick={() => navigate("/admin/offenses")}
              />
              <ActionCard 
                title="Manage Officers"
                description="View and manage officer accounts"
                actionText="View Officers"
                onClick={() => navigate("/admin/officers")}
              />
              <ActionCard 
                title="View Reports"
                description="Generate and export reports"
                actionText="View Reports"
                onClick={() => navigate("/admin/reports")}
              />
            </div>
          </div>
        </>
      );
    } else if (isDriver) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <StatCard 
              title="My Fines"
              value={totalFines}
              icon={<FileText className="h-8 w-8 text-finexpress-500" />}
              description="Total fines"
            />
            <StatCard 
              title="Pending Payment"
              value={pendingFines}
              icon={<ArrowDown className="h-8 w-8 text-yellow-500" />}
              description="Requires action"
            />
            <StatCard 
              title="Pending Amount"
              value={formatCurrency(totalAmount - paidAmount)}
              icon={<CreditCard className="h-8 w-8 text-finexpress-600" />}
              description="To be paid"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Fines</h2>
              <Button 
                variant="outline" 
                className="text-finexpress-600"
                onClick={() => navigate("/driver/fines")}
              >
                View All
              </Button>
            </div>
            {recentFines.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {recentFines.map(fine => (
                  <FineCard key={fine.id} fine={fine} isDriverView />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No fines found</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ActionCard 
                title="Pay a Fine"
                description="Review and pay your pending fines"
                actionText="View Fines"
                onClick={() => navigate("/driver/fines")}
              />
              <ActionCard 
                title="Payment History"
                description="View your payment history"
                actionText="View Payments"
                onClick={() => navigate("/driver/payments")}
              />
            </div>
          </div>
        </>
      );
    }

    return <div>Loading dashboard...</div>;
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}!
        </p>
      </div>
      
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

// Stats Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="bg-finexpress-50 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Fine Card Component
interface FineCardProps {
  fine: Fine;
  isDriverView?: boolean;
}

const FineCard = ({ fine, isDriverView = false }: FineCardProps) => {
  const navigate = useNavigate();
  const offense = getOffenseById(fine.offenseId);
  const statusDetails = getFineStatusDetails(fine.status);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Ticket #{fine.ticketNumber}</CardTitle>
          <span className={statusDetails.className}>{statusDetails.label}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Vehicle</p>
          <p className="font-semibold">{fine.licensePlate}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Offense</p>
          <p>{offense?.description}</p>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Issue Date</p>
            <p>{formatDate(fine.issueDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Amount</p>
            <p className="font-bold text-finexpress-800">{formatCurrency(fine.amount)}</p>
          </div>
        </div>
        {isDriverView && fine.status === 'Pending' && (
          <Button 
            className="w-full mt-2 bg-finexpress-600 hover:bg-finexpress-700"
            onClick={() => navigate(`/driver/fines/${fine.id}`)}
          >
            Pay Now
          </Button>
        )}
        {!isDriverView && (
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => navigate(`/fines/${fine.id}`)}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
}

const ActionCard = ({ title, description, actionText, onClick }: ActionCardProps) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardContent className="p-6">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <Button 
        variant="default"
        className="w-full bg-finexpress-600 hover:bg-finexpress-700"
        onClick={onClick}
      >
        {actionText}
      </Button>
    </CardContent>
  </Card>
);

export default Dashboard;
