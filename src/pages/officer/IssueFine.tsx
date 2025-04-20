
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  trafficOffenses, 
  getOffenseById, 
  formatCurrency 
} from "@/data/mockData";
import { ArrowRight, Check, Upload, MapPin, Camera } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const IssueFine = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    licensePlate: "",
    offenseId: "",
    location: "",
    notes: "",
    driverEmail: "",
    photoUpload: null as File | null
  });

  // Derived state
  const selectedOffense = formData.offenseId ? getOffenseById(formData.offenseId) : null;
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle offense selection
  const handleOffenseSelect = (value: string) => {
    setFormData(prev => ({ ...prev, offenseId: value }));
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photoUpload: e.target.files![0] }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to save the fine
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }, 1500);
  };
  
  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ 
          ...prev, 
          location: `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}` 
        }));
      }, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Go to next step
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  // Go to previous step
  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Check if current step is valid
  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.licensePlate.trim().length >= 3 && formData.offenseId;
    } else if (currentStep === 2) {
      return formData.location.trim().length > 0;
    }
    return true;
  };

  // Render step 1: Basic information
  const renderStepOne = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="licensePlate">Vehicle License Plate</Label>
        <Input
          id="licensePlate"
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleInputChange}
          placeholder="e.g., ABC123"
          className="mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="offense">Traffic Offense</Label>
        <Select onValueChange={handleOffenseSelect} value={formData.offenseId}>
          <SelectTrigger id="offense" className="mt-1">
            <SelectValue placeholder="Select an offense" />
          </SelectTrigger>
          <SelectContent>
            {trafficOffenses.map(offense => (
              <SelectItem key={offense.id} value={offense.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{offense.description}</span>
                  <span className="ml-2 text-gray-500">
                    {formatCurrency(offense.amount)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedOffense && (
        <div className="bg-finexpress-50 p-4 rounded-md mt-4">
          <p className="font-medium">Selected Offense:</p>
          <p className="text-gray-700">{selectedOffense.description}</p>
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500">Code: {selectedOffense.code}</p>
            <p className="font-medium">{formatCurrency(selectedOffense.amount)}</p>
          </div>
        </div>
      )}
      
      <div>
        <Label htmlFor="driverEmail">Driver's Email (Optional)</Label>
        <Input
          id="driverEmail"
          name="driverEmail"
          type="email"
          value={formData.driverEmail}
          onChange={handleInputChange}
          placeholder="driver@example.com"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          If provided, we'll send the fine details to this email
        </p>
      </div>
    </div>
  );

  // Render step 2: Location and evidence
  const renderStepTwo = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <div className="flex mt-1">
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Main St & 5th Ave"
            className="flex-1"
            required
          />
          <Button 
            type="button" 
            variant="outline" 
            className="ml-2"
            onClick={getCurrentLocation}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Current
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="photo">Photo Evidence (Optional)</Label>
        <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
          {formData.photoUpload ? (
            <div className="text-center">
              <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">{formData.photoUpload.name}</p>
              <p className="text-xs text-gray-500">
                {Math.round(formData.photoUpload.size / 1024)} KB
              </p>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="mt-2"
                onClick={() => setFormData(prev => ({ ...prev, photoUpload: null }))}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Take or upload a photo
              </p>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => document.getElementById('photoUpload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render step 3: Notes and confirmation
  const renderStepThree = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Enter any additional details or notes about the violation..."
          className="mt-1 min-h-[100px]"
        />
      </div>
      
      <div className="bg-finexpress-50 p-4 rounded-md mt-4">
        <h3 className="font-medium text-lg mb-2">Fine Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">License Plate:</span>
            <span className="font-medium">{formData.licensePlate}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Offense:</span>
            <span className="font-medium">{selectedOffense?.description}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{formData.location}</span>
          </div>
          
          {formData.driverEmail && (
            <div className="flex justify-between">
              <span className="text-gray-600">Driver Email:</span>
              <span className="font-medium">{formData.driverEmail}</span>
            </div>
          )}
          
          {formData.photoUpload && (
            <div className="flex justify-between">
              <span className="text-gray-600">Evidence:</span>
              <span className="font-medium">Photo attached</span>
            </div>
          )}
          
          <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
            <span className="text-gray-700 font-medium">Total Amount:</span>
            <span className="font-bold text-finexpress-800">
              {selectedOffense ? formatCurrency(selectedOffense.amount) : '$0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render steps based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Issue Fine</h1>
        <p className="text-gray-600">
          Create a new traffic violation fine
        </p>
      </div>

      {success ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-green-800 mb-2">
                Fine Issued Successfully
              </h2>
              <p className="text-gray-600 mb-4">
                Ticket #{new Date().getTime().toString().slice(-8)} has been created
              </p>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">License Plate:</span>
                <span className="font-medium">{formData.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold">
                  {selectedOffense ? formatCurrency(selectedOffense.amount) : '$0.00'}
                </span>
              </div>
            </div>
            <Button 
              className="bg-finexpress-600 hover:bg-finexpress-700"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Issue New Fine</CardTitle>
              <CardDescription>
                Enter the details of the traffic violation below
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
                <ol className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <li key={step} className="flex items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                          ${currentStep >= step 
                            ? 'bg-finexpress-600 text-white' 
                            : 'bg-gray-200 text-gray-500'}`}
                      >
                        {step}
                      </div>
                      <span className="hidden sm:inline text-sm">
                        {step === 1 && "Basic Info"}
                        {step === 2 && "Location"}
                        {step === 3 && "Review"}
                      </span>
                      {step < 3 && (
                        <div className="hidden sm:block mx-4 h-0.5 w-12 bg-gray-200">
                          {/* Divider line */}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
              
              {renderStepContent()}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4 border-t">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPrevStep}
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  onClick={goToNextStep}
                  disabled={!isStepValid()}
                  className="bg-finexpress-600 hover:bg-finexpress-700"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-finexpress-600 hover:bg-finexpress-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Issue Fine"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      )}
    </DashboardLayout>
  );
};

export default IssueFine;
