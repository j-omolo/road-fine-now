
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockFines, getOffenseById, formatCurrency } from "@/data/mockData";
import { ArrowLeft, Calendar, CreditCard, Check, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fine, setFine] = useState(mockFines.find(f => f.id === id));
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  
  useEffect(() => {
    if (!fine) {
      navigate("/driver/fines");
    }
  }, [fine, navigate]);
  
  if (!fine) {
    return null;
  }
  
  const offense = getOffenseById(fine.offenseId);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/driver/fines")} className="mr-2 p-0 h-auto">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fine Details</h1>
          <p className="text-gray-600">
            Ticket #{fine.ticketNumber}
          </p>
        </div>
      </div>

      {isPaid && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4" />
          <AlertDescription>
            Payment successful! A receipt has been sent to your email.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">Fine Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Offense</h3>
                  <p className="font-semibold">{offense?.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Vehicle License Plate</h3>
                  <p className="font-semibold">{fine.licensePlate}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Issue Date</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-finexpress-600" />
                    <p>{formatDate(fine.issueDate)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Due Date</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-finexpress-danger" />
                    <p>{formatDate(fine.dueDate)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Location</h3>
                  <p>{fine.location}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Fine Amount</h3>
                  <p className="text-xl font-bold text-finexpress-800">
                    {formatCurrency(fine.amount)}
                  </p>
                </div>
              </div>
              
              {fine.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Officer Notes</h3>
                    <p className="text-gray-700">{fine.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {!isPaid && fine.status === 'Pending' && (
            <Card className="mt-6">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-xl">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Please review the fine details above and make payment before the due date
                  to avoid additional penalties.
                </p>
                <div className="bg-finexpress-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Fine Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(fine.amount)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  By proceeding to payment, you acknowledge the traffic violation
                  and agree to pay the fine amount.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button 
                  className="w-full bg-finexpress-600 hover:bg-finexpress-700"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing Payment...</>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {formatCurrency(fine.amount)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {(isPaid || fine.status === 'Paid') && (
            <Card className="mt-6 border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-200">
                <CardTitle className="text-xl text-green-800">Payment Complete</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Successful</p>
                    <p className="text-sm text-gray-500">
                      {isPaid ? 'Just now' : formatDate(fine.paymentDate || '')}
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Amount Paid:</span>
                  <span className="font-bold text-lg">{formatCurrency(fine.amount)}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-sm">
                If you have questions about this fine or wish to contest it,
                please contact traffic enforcement:
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Phone:</p>
                  <p className="text-finexpress-600">(555) 123-4567</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-finexpress-600">support@finexpress.gov</p>
                </div>
                <div>
                  <p className="font-medium">Office Hours:</p>
                  <p>Monday - Friday, 9am - 5pm</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Payment Due Date:</span><br />
                  {formatDate(fine.dueDate)}
                </p>
                <p>
                  <span className="font-medium">Late Payment:</span><br />
                  A 10% penalty will be added after the due date.
                </p>
                <p>
                  <span className="font-medium">Contest Period:</span><br />
                  You have 14 days from the issue date to contest this fine.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FineDetails;
