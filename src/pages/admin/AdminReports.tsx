
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  mockFines, 
  trafficOffenses, 
  getOffenseById, 
  formatCurrency 
} from "@/data/mockData";
import { 
  BarChart as BarChartIcon, 
  Download, 
  FileText, 
  CreditCard, 
  PieChart as PieChartIcon 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [reportType, setReportType] = useState("fines");
  
  // Prepare data for the reports
  const fines = [...mockFines];
  
  // Filter fines based on time range
  const filteredFines = fines.filter(fine => {
    const fineDate = new Date(fine.issueDate);
    const now = new Date();
    
    if (timeRange === "today") {
      const today = new Date();
      return fineDate.getDate() === today.getDate() &&
             fineDate.getMonth() === today.getMonth() &&
             fineDate.getFullYear() === today.getFullYear();
    } else if (timeRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return fineDate >= weekAgo;
    } else if (timeRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return fineDate >= monthAgo;
    }
    
    return true;
  });
  
  // Calculate summary statistics
  const totalFines = filteredFines.length;
  const totalAmount = filteredFines.reduce((sum, fine) => sum + fine.amount, 0);
  const paidAmount = filteredFines
    .filter(fine => fine.status === "Paid")
    .reduce((sum, fine) => sum + fine.amount, 0);
  const pendingAmount = filteredFines
    .filter(fine => fine.status === "Pending")
    .reduce((sum, fine) => sum + fine.amount, 0);
  
  // Prepare data for offense distribution chart
  const offenseData = [];
  const offenseCounts = {};
  
  filteredFines.forEach(fine => {
    const offense = getOffenseById(fine.offenseId);
    if (offense) {
      if (offenseCounts[offense.description]) {
        offenseCounts[offense.description]++;
      } else {
        offenseCounts[offense.description] = 1;
      }
    }
  });
  
  for (const [description, count] of Object.entries(offenseCounts)) {
    offenseData.push({
      name: description,
      value: count,
    });
  }
  
  // Prepare data for status distribution chart
  const statusData = [];
  const statusCounts = {
    Pending: 0,
    Paid: 0,
    Overdue: 0,
    Disputed: 0,
    Canceled: 0
  };
  
  filteredFines.forEach(fine => {
    statusCounts[fine.status]++;
  });
  
  for (const [status, count] of Object.entries(statusCounts)) {
    if (count > 0) {
      statusData.push({
        name: status,
        value: count,
      });
    }
  }
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Prepare data for revenue by offense chart
  const revenueByOffense = [];
  const revenueByOffenseData: Record<string, number> = {};
  
  filteredFines.forEach(fine => {
    const offense = getOffenseById(fine.offenseId);
    if (offense) {
      if (revenueByOffenseData[offense.description]) {
        revenueByOffenseData[offense.description] += fine.amount;
      } else {
        revenueByOffenseData[offense.description] = fine.amount;
      }
    }
  });
  
  for (const [description, amount] of Object.entries(revenueByOffenseData)) {
    revenueByOffense.push({
      name: description.length > 20 ? description.substring(0, 20) + '...' : description,
      amount: Number(amount) / 100, // Convert cents to dollars for better visualization
    });
  }
  
  // Handle export report
  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF or CSV
    alert("Exporting report as CSV...");
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600">
          View and export reports on traffic fines and revenue
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fines">Fines Overview</SelectItem>
              <SelectItem value="revenue">Revenue Analysis</SelectItem>
              <SelectItem value="officers">Officer Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline"
          onClick={handleExportReport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Fines</p>
                <p className="text-2xl font-bold mt-1">{totalFines}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {timeRange === "all" ? "All time" : 
                   timeRange === "today" ? "Today" : 
                   timeRange === "week" ? "Last 7 days" : "Last 30 days"}
                </p>
              </div>
              <div className="bg-finexpress-50 p-3 rounded-full">
                <FileText className="h-5 w-5 text-finexpress-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-gray-500 mt-1">Fines issued</p>
              </div>
              <div className="bg-finexpress-50 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-finexpress-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Collected Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(paidAmount)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round((paidAmount / totalAmount) * 100) || 0}% collection rate
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {reportType === "fines" && (
        <>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2 text-finexpress-600" />
                  Offense Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={offenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {offenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} fines`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-finexpress-600" />
                  Fine Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} fines`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <BarChartIcon className="h-5 w-5 mr-2 text-finexpress-600" />
                Recent Fines Summary
              </CardTitle>
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
                        License Plate
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredFines.slice(0, 5).map((fine) => {
                      const offense = getOffenseById(fine.offenseId);
                      
                      const formatDate = (dateString: string) => {
                        return new Date(dateString).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        });
                      };
                      
                      return (
                        <tr key={fine.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap font-medium">
                            {fine.ticketNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {fine.licensePlate}
                          </td>
                          <td className="px-4 py-4">
                            {offense?.description}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {formatDate(fine.issueDate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right font-semibold">
                            {formatCurrency(fine.amount)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium
                              ${fine.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                fine.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                fine.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                fine.status === 'Disputed' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {fine.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    
                    {filteredFines.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                          No fines found for the selected time period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {reportType === "revenue" && (
        <>
          <Card className="mb-6">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <BarChartIcon className="h-5 w-5 mr-2 text-finexpress-600" />
                Revenue by Offense Type
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueByOffense}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{fontSize: 12}}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Amount ($)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }} 
                    />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="amount" name="Revenue ($)" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="font-medium">Total Fines Issued:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="font-medium">Revenue Collected:</span>
                    <span className="text-green-600 font-semibold">{formatCurrency(paidAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="font-medium">Pending Collection:</span>
                    <span className="text-yellow-600">{formatCurrency(pendingAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="font-medium">Collection Rate:</span>
                    <span>{Math.round((paidAmount / totalAmount) * 100) || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="font-medium">Average Fine Amount:</span>
                    <span>
                      {totalFines > 0 
                        ? formatCurrency(Math.round(totalAmount / totalFines)) 
                        : formatCurrency(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Top Revenue Generators</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[...revenueByOffense]
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span>{item.name}</span>
                        <span className="font-semibold">${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    
                  {revenueByOffense.length === 0 && (
                    <p className="text-center text-gray-500">
                      No revenue data available for the selected time period.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {reportType === "officers" && (
        <Card className="mb-6">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg">Officer Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-8">
              Officer performance reporting will be available in the next update.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;
