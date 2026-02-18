import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function DriverDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Mock data
  const driverStats = {
    totalRides: 156,
    todayRides: 8,
    totalEarnings: 45230,
    todayEarnings: 1250,
    rating: 4.8,
  };

  const incomingRequests = [
    {
      id: 1,
      from: "Connaught Place",
      to: "Airport",
      fare: 450,
      distance: "25 km",
      time: "35 min",
    },
    {
      id: 2,
      from: "Sector 5, Noida",
      to: "Cyber City",
      fare: 320,
      distance: "15 km",
      time: "20 min",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
          <h1 className="text-2xl font-bold text-slate-900">Driver Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total Rides</p>
                  <p className="text-3xl font-bold text-slate-900">{driverStats.totalRides}</p>
                </div>
                <MapPin className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Today's Rides</p>
                  <p className="text-3xl font-bold text-slate-900">{driverStats.todayRides}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold text-slate-900">₹{driverStats.totalEarnings}</p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Rating</p>
                  <p className="text-3xl font-bold text-slate-900">{driverStats.rating}⭐</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600">★</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incoming Requests */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle>Incoming Ride Requests</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-slate-900">{request.from}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-slate-600">{request.to}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{request.fare}</p>
                          <p className="text-sm text-slate-600">{request.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-green-200">
                        <span className="text-sm text-slate-600">Est. time: {request.time}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" className="text-red-600 border-red-300">
                            Decline
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Availability Toggle */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="font-semibold text-slate-900">Online</span>
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Go Offline
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  View Earnings
                </Button>
                <Button variant="outline" className="w-full">
                  Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
