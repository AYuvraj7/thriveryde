import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MapPin, DollarSign, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function RideBooking() {
  const [, navigate] = useLocation();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("auto");
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const createRideMutation = trpc.rides.createRide.useMutation();

  // Mock location data - in production, this would use Google Maps API
  const mockLocations = {
    pickup: { lat: 28.7041, lng: 77.1025 },
    drop: { lat: 28.5355, lng: 77.391 },
  };

  const calculateFare = () => {
    if (!pickupAddress || !dropAddress) {
      toast.error("Please enter both pickup and drop addresses");
      return;
    }

    setIsCalculating(true);
    // Mock fare calculation - in production, use actual distance calculation
    const baseFare = vehicleType === "bike" ? 50 : vehicleType === "auto" ? 100 : 150;
    const distanceFare = Math.random() * 200 + 100;
    const fare = baseFare + distanceFare;
    setEstimatedFare(fare);
    setIsCalculating(false);
    toast.success("Fare calculated!");
  };

  const handleBookRide = async () => {
    if (!pickupAddress || !dropAddress || estimatedFare === 0) {
      toast.error("Please calculate fare first");
      return;
    }

    try {
      const result = await createRideMutation.mutateAsync({
        pickupLatitude: mockLocations.pickup.lat,
        pickupLongitude: mockLocations.pickup.lng,
        pickupAddress,
        dropLatitude: mockLocations.drop.lat,
        dropLongitude: mockLocations.drop.lng,
        dropAddress,
        vehicleType: vehicleType as "bike" | "auto" | "car",
        estimatedFare,
      });

      if (result.success) {
        toast.success("Ride booked successfully!");
        navigate("/ride-history");
      }
    } catch (error) {
      toast.error("Failed to book ride");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Book a Ride</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle>Enter Your Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-6">
              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickup" className="text-base font-semibold">
                  <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
                  Pickup Location
                </Label>
                <Input
                  id="pickup"
                  placeholder="Enter pickup address"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="py-3 text-base"
                />
              </div>

              {/* Drop Location */}
              <div className="space-y-2">
                <Label htmlFor="drop" className="text-base font-semibold">
                  <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
                  Drop Location
                </Label>
                <Input
                  id="drop"
                  placeholder="Enter drop address"
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                  className="py-3 text-base"
                />
              </div>

              {/* Vehicle Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Vehicle Type</Label>
                <RadioGroup value={vehicleType} onValueChange={setVehicleType}>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "bike", label: "Bike", price: "₹50+" },
                      { value: "auto", label: "Auto", price: "₹100+" },
                      { value: "car", label: "Car", price: "₹150+" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label
                          htmlFor={option.value}
                          className="flex-1 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                        >
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-slate-600">{option.price}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Calculate Fare Button */}
              <Button
                onClick={calculateFare}
                disabled={isCalculating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isCalculating ? "Calculating..." : "Calculate Fare"}
              </Button>

              {/* Fare Display */}
              {estimatedFare > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <span className="text-slate-700">Estimated Fare:</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{estimatedFare.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Estimated time: 10-15 minutes</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Book Ride Button */}
              <Button
                onClick={handleBookRide}
                disabled={createRideMutation.isPending || estimatedFare === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg font-semibold"
              >
                {createRideMutation.isPending ? "Booking..." : "Book Ride"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Why Choose Thrive Ride?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-600">
              <li>✓ Transparent pricing with no hidden charges</li>
              <li>✓ Real-time tracking of your ride</li>
              <li>✓ Verified and professional drivers</li>
              <li>✓ 24/7 customer support</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
