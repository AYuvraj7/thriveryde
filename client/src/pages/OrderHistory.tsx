import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function OrderHistory() {
  const [, navigate] = useLocation();
  const { data: orders = [], isLoading } = trpc.delivery.getOrderHistory.useQuery();

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
          <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-center text-slate-600">Loading...</p>
        ) : orders.length === 0 ? (
          <Card className="border-0 shadow-lg text-center py-12">
            <CardContent>
              <p className="text-slate-600 mb-4">No orders yet</p>
              <Button onClick={() => navigate("/delivery-ordering")} className="bg-purple-600">
                Place Your First Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-slate-900">{order.deliveryAddress}</span>
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-600 capitalize mt-1">
                        {order.status}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
