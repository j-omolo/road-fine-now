
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Fine, mockFines, getOffenseById, formatCurrency, getFineStatusDetails } from "@/data/mockData";
import { Search, Filter, CreditCard } from "lucide-react";

const DriverFines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get driver's fines (filtered by email)
  const driverFines = mockFines.filter(fine => fine.driverEmail === "driver@example.com");
  
  const [fines, setFines] = useState<Fine[]>(driverFines);
  const [filteredFines, setFilteredFines] = useState<Fine[]>(driverFines);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Apply filters when search or status filter changes
  useEffect(() => {
    let result = fines;
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(fine => 
        fine.ticketNumber.toLowerCase().includes(lowerCaseQuery) ||
        fine.licensePlate.toLowerCase().includes(lowerCaseQuery) ||
        getOffenseById(fine.offenseId)?.description.toLowerCase().includes(lowerCaseQuery) ||
        fine.location.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(fine => fine.status === statusFilter);
    }
    
    setFilteredFines(result);
  }, [searchQuery, statusFilter, fines]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  // Calculate summary statistics
  const totalFines = fines.length;
  const pendingFines = fines.filter(fine => fine.status === "Pending").length;
  const paidFines = fines.filter(fine => fine.status === "Paid").length;
  const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const pendingAmount = fines
    .filter(fine => fine.status === "Pending")
    .reduce((sum, fine) => sum + fine.amount, 0);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Fines</h1>
        <p className="text-gray-600">
          View and manage your traffic fines
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Fines</p>
                <p className="text-2xl font-bold mt-1">{totalFines}</p>
              </div>
              <div className="bg-finexpress-50 p-3 rounded-full">
                <Filter className="h-5 w-5 text-finexpress-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Payment</p>
                <p className="text-2xl font-bold mt-1">{pendingFines}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount Due</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(pendingAmount)}</p>
              </div>
              <div className="bg-finexpress-50 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-finexpress-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl">Fine History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search fines..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offense
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredFines.length > 0 ? (
                  filteredFines.map((fine) => {
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
                      <tr key={fine.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">{fine.ticketNumber}</p>
                            <p className="text-sm text-gray-500">{fine.licensePlate}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-gray-900">{offense?.description}</p>
                          <p className="text-sm text-gray-500">{fine.location}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-gray-900">{formatDate(fine.issueDate)}</p>
                          <p className="text-sm text-gray-500">Due: {formatDate(fine.dueDate)}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right font-semibold">
                          {formatCurrency(fine.amount)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className={statusDetails.className}>
                            {statusDetails.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <Button 
                            size="sm" 
                            className={fine.status === 'Pending' 
                              ? "bg-finexpress-600 hover:bg-finexpress-700" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }
                            onClick={() => navigate(`/driver/fines/${fine.id}`)}
                          >
                            {fine.status === 'Pending' ? 'Pay Now' : 'View'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                      {searchQuery || statusFilter !== "all"
                        ? "No fines found matching your search or filter."
                        : "You don't have any fines yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DriverFines;
