
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  // Redirect to login page
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-finexpress-50 to-finexpress-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-finexpress-800">FineXpress</h1>
            <p className="text-gray-600 mt-2">Roadside Fine Collection System</p>
          </div>
          
          <p className="text-center mb-6">
            Redirecting to login page...
          </p>
          
          <Button 
            className="w-full bg-finexpress-600 hover:bg-finexpress-700"
            onClick={() => navigate("/")}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
