import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function DeliveryPartnerDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Mock data
  const partnerStats = {
    totalDeliveries: 342,
    todayDeliveries: 12,
    totalEarnings: 78540,
    todayEarnings: 2100,
    rating: 4.9,
  };

  const incomingOrders = [
    {
      id: 1,
      items: "Groceries (5 items)",
      from: "Store Location",
      to: "Sector 18, Noida",
      fee: 60,
      distance: "3 km",
      time: "15 min",
    },
    {
      id: 2,
      items: "Dairy Products (3 items)",
      from: "Store Location",
      to: "Dwarka",
      fee: 80,
      distance: "5 km",
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
          <h1 className="text-2xl font-bold text-slate-900">Delivery Partner Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total Deliveries</p>
                  <p className="text-3xl font-bold text-slate-900">{partnerStats.totalDeliveries}</p>
                </div>
                <ShoppingBag className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Today's Deliveries</p>
                  <p className="text-3xl font-bold text-slate-900">{partnerStats.todayDeliveries}</p>
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
                  <p className="text-3xl font-bold text-slate-900">₹{partnerStats.totalEarnings}</p>
                </div>
                <DollarSign className="w-10 h-10 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Rating</p>
                  <p className="text-3xl font-bold text-slate-900">{partnerStats.rating}⭐</p>
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
          {/* Incoming Orders */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle>Incoming Delivery Orders</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {incomingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 mb-1">{order.items}</p>
                          <p className="text-sm text-slate-600 mb-1">From: {order.from}</p>
                          <p className="text-sm text-slate-600">To: {order.to}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">₹{order.fee}</p>
                          <p className="text-sm text-slate-600">{order.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-orange-200">
                        <span className="text-sm text-slate-600">Est. time: {order.time}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" className="text-red-600 border-red-300">
                            Decline
                          </Button>
                          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
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
