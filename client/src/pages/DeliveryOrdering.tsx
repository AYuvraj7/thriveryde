import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShoppingBag, Plus, Trash2, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

export default function DeliveryOrdering() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("groceries");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  const createOrderMutation = trpc.delivery.createOrder.useMutation();
  const cartQuery = trpc.cart.getCart.useQuery();

  const deliveryFee = 50;

  const addToCart = () => {
    if (!itemName || !itemPrice) {
      toast.error("Please enter item name and price");
      return;
    }

    const newItem: CartItem = {
      id: Date.now().toString(),
      name: itemName,
      category: itemCategory,
      quantity: itemQuantity,
      price: parseFloat(itemPrice),
    };

    setCart([...cart, newItem]);
    setItemName("");
    setItemPrice("");
    setItemQuantity(1);
    toast.success("Item added to cart!");
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!deliveryAddress) {
      toast.error("Please enter delivery address");
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        deliveryLatitude: 28.7041,
        deliveryLongitude: 77.1025,
        deliveryAddress,
        items: cart.map((item) => ({
          itemName: item.name,
          itemCategory: item.category,
          quantity: item.quantity,
          pricePerUnit: item.price,
        })),
        deliveryFee,
        specialInstructions,
      });

      if (result.success) {
        toast.success("Order placed successfully!");
        setCart([]);
        setDeliveryAddress("");
        setSpecialInstructions("");
        navigate("/order-history");
      }
    } catch (error) {
      toast.error("Failed to place order");
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
          <h1 className="text-2xl font-bold text-slate-900">Quick Delivery</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Add Items */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle>Add Items to Cart</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName" className="text-sm font-semibold">
                        Item Name
                      </Label>
                      <Input
                        id="itemName"
                        placeholder="e.g., Milk, Bread"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="py-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemCategory" className="text-sm font-semibold">
                        Category
                      </Label>
                      <select
                        id="itemCategory"
                        value={itemCategory}
                        onChange={(e) => setItemCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                      >
                        <option value="groceries">Groceries</option>
                        <option value="dairy">Dairy</option>
                        <option value="bakery">Bakery</option>
                        <option value="snacks">Snacks</option>
                        <option value="beverages">Beverages</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemPrice" className="text-sm font-semibold">
                        Price (₹)
                      </Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        placeholder="0.00"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        className="py-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemQuantity" className="text-sm font-semibold">
                        Quantity
                      </Label>
                      <Input
                        id="itemQuantity"
                        type="number"
                        min="1"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                        className="py-2"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={addToCart}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            {cart.length > 0 && (
              <Card className="mt-6 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Cart Items ({cart.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-600">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                          <span className="font-semibold text-slate-900 w-16 text-right">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-sm font-semibold">
                    Special Instructions (Optional)
                  </Label>
                  <textarea
                    id="instructions"
                    placeholder="e.g., Leave at door, ring bell twice"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-purple-200 pt-3 flex justify-between text-lg font-bold text-purple-900">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0 || createOrderMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 font-semibold mt-4"
                >
                  {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
