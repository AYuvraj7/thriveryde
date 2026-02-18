import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, ShoppingBag, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const handleRideBooking = () => {
    navigate("/ride-booking");
  };

  const handleDeliveryOrdering = () => {
    navigate("/delivery-ordering");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
        <div className="w-full max-w-md mx-4">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">TR</span>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Thrive Ride</CardTitle>
              <CardDescription className="text-base mt-2">
                Your unified platform for rides and deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-slate-600 text-sm">
                  Book rides with Rapido-style convenience and get quick deliveries with Blinkit-style speed.
                </p>
                <a href={getLoginUrl()}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-lg">
                    Sign In with Manus
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">TR</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Thrive Ride</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleProfile} className="text-slate-700">
              {user?.name || "Profile"}
            </Button>
            <Button variant="outline" onClick={handleLogout} className="text-slate-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-xl text-slate-600">
            Choose a service to get started
          </p>
        </div>

        {/* Service Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ride Booking Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group">
            <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-20 h-20 text-white opacity-20" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Book a Ride
              </CardTitle>
              <CardDescription>
                Fast, reliable, and affordable rides at your fingertips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-6">
                Choose from bikes, autos, or cars. Get real-time tracking and transparent pricing.
              </p>
              <Button
                onClick={handleRideBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-lg"
              >
                Book a Ride
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Ordering Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group">
            <div className="h-40 bg-gradient-to-br from-purple-500 to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-white opacity-20" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
                Quick Delivery
              </CardTitle>
              <CardDescription>
                Get groceries and essentials delivered in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-6">
                Browse items, add to cart, and get lightning-fast delivery to your doorstep.
              </p>
              <Button
                onClick={handleDeliveryOrdering}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-lg"
              >
                Order Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Recent Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => navigate("/ride-history")}
                className="w-full"
              >
                View History
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => navigate("/order-history")}
                className="w-full"
              >
                View History
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Become a Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleProfile}
                className="w-full"
              >
                Setup Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
