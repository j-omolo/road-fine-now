
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { trafficOffenses, formatCurrency } from "@/data/mockData";
import { Plus, Edit, Trash, Search } from "lucide-react";

const ManageOffenses = () => {
  const [offenses, setOffenses] = useState([...trafficOffenses]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffense, setSelectedOffense] = useState<null | typeof trafficOffenses[0]>(null);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    amount: 0,
    category: "Minor" as "Minor" | "Major" | "Critical"
  });
  
  // Filter offenses based on search query
  const filteredOffenses = offenses.filter(offense => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      offense.code.toLowerCase().includes(lowerCaseQuery) ||
      offense.description.toLowerCase().includes(lowerCaseQuery) ||
      offense.category.toLowerCase().includes(lowerCaseQuery)
    );
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === "amount") {
        return { ...prev, [name]: parseInt(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };
  
  // Handle category selection
  const handleCategorySelect = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category: value as "Minor" | "Major" | "Critical" 
    }));
  };
  
  // Handle edit offense
  const handleEditClick = (offense: typeof trafficOffenses[0]) => {
    setSelectedOffense(offense);
    setFormData({
      code: offense.code,
      description: offense.description,
      amount: offense.amount,
      category: offense.category
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle add new offense
  const handleAddClick = () => {
    setFormData({
      code: "",
      description: "",
      amount: 0,
      category: "Minor"
    });
    setIsAddDialogOpen(true);
  };
  
  // Save edited offense
  const saveEditedOffense = () => {
    if (!selectedOffense) return;
    
    setOffenses(prev => prev.map(offense => 
      offense.id === selectedOffense.id 
        ? { 
            ...offense, 
            code: formData.code,
            description: formData.description,
            amount: formData.amount,
            category: formData.category
          } 
        : offense
    ));
    
    setIsEditDialogOpen(false);
  };
  
  // Save new offense
  const saveNewOffense = () => {
    const newOffense = {
      id: `off-${Date.now()}`,
      code: formData.code,
      description: formData.description,
      amount: formData.amount,
      category: formData.category
    };
    
    setOffenses(prev => [...prev, newOffense]);
    setIsAddDialogOpen(false);
  };
  
  // Delete offense
  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete this offense? This action cannot be undone.")) {
      setOffenses(prev => prev.filter(offense => offense.id !== id));
    }
  };
  
  // Get category badge style
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Minor":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium";
      case "Major":
        return "bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium";
      case "Critical":
        return "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Traffic Offenses</h1>
        <p className="text-gray-600">
          Add, edit or delete traffic offenses and their corresponding fine amounts
        </p>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl">Traffic Offenses</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search offenses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 w-full sm:w-auto"
              />
            </div>
            <Button 
              className="bg-finexpress-600 hover:bg-finexpress-700"
              onClick={handleAddClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Offense
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredOffenses.length > 0 ? (
                  filteredOffenses.map((offense) => (
                    <tr key={offense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap font-medium">
                        {offense.code}
                      </td>
                      <td className="px-4 py-4">
                        {offense.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={getCategoryBadge(offense.category)}>
                          {offense.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-semibold">
                        {formatCurrency(offense.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(offense)}
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-finexpress-danger"
                            onClick={() => handleDeleteClick(offense.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                      No offenses found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Offense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Traffic Offense</DialogTitle>
            <DialogDescription>
              Update the details for this traffic offense.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., SPD-01"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategorySelect}
                >
                  <SelectTrigger id="edit-category" className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Speeding (10-20 km/h over limit)"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-amount">Amount (in cents)</Label>
              <Input
                id="edit-amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="e.g., 5000 for $50.00"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current amount: {formatCurrency(formData.amount)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEditedOffense}
              className="bg-finexpress-600 hover:bg-finexpress-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Offense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Traffic Offense</DialogTitle>
            <DialogDescription>
              Create a new traffic offense and set its fine amount.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-code">Code</Label>
                <Input
                  id="add-code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., SPD-01"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="add-category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategorySelect}
                >
                  <SelectTrigger id="add-category" className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-description">Description</Label>
              <Input
                id="add-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Speeding (10-20 km/h over limit)"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="add-amount">Amount (in cents)</Label>
              <Input
                id="add-amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="e.g., 5000 for $50.00"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Preview amount: {formatCurrency(formData.amount)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveNewOffense}
              className="bg-finexpress-600 hover:bg-finexpress-700"
              disabled={!formData.code || !formData.description || formData.amount <= 0}
            >
              Add Offense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageOffenses;
