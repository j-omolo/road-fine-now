
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-finexpress-50 to-finexpress-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-finexpress-800 font-bold text-3xl">FineXpress</h1>
          <p className="text-gray-600 mt-2">Roadside Fine Collection System</p>
        </div>

        <Card className="border-finexpress-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="#" 
                    className="text-sm text-finexpress-600 hover:text-finexpress-800"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-finexpress-600 hover:bg-finexpress-700" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg border shadow-sm">
          <p className="font-medium mb-2">Demo Accounts:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-finexpress-100 rounded p-2 bg-finexpress-50">
              <p className="font-semibold text-finexpress-800">Officer</p>
              <p>officer@finexpress.com</p>
              <p>officer123</p>
            </div>
            <div className="border border-red-100 rounded p-2 bg-red-50">
              <p className="font-semibold text-red-800">Admin</p>
              <p>admin@finexpress.com</p>
              <p>admin123</p>
            </div>
            <div className="border border-green-100 rounded p-2 bg-green-50">
              <p className="font-semibold text-green-800">Driver</p>
              <p>driver@example.com</p>
              <p>driver123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
