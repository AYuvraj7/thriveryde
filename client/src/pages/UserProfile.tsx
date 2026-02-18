import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function UserProfile() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [showDriverSetup, setShowDriverSetup] = useState(false);
  const [showDeliverySetup, setShowDeliverySetup] = useState(false);

  const updateProfileMutation = trpc.user.updateProfile.useMutation();
  const setupDriverMutation = trpc.user.setupDriver.useMutation();
  const setupDeliveryMutation = trpc.user.setupDeliveryPartner.useMutation();

  const handleUpdateProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name,
        phone,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Information */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="py-2 bg-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="py-2"
                />
              </div>

              <Button
                onClick={handleUpdateProfile}
                disabled={updateProfileMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
              >
                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Partner Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver Setup */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle>Become a Driver</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-600 text-sm mb-4">
                Earn money by driving with Thrive Ride. Set your own schedule and be your own boss.
              </p>
              <Button
                onClick={() => setShowDriverSetup(!showDriverSetup)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {showDriverSetup ? "Hide" : "Get Started"}
              </Button>

              {showDriverSetup && (
                <div className="mt-4 space-y-3 pt-4 border-t border-slate-200">
                  <Input placeholder="License Number" className="py-2" />
                  <Input type="date" placeholder="License Expiry" className="py-2" />
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                    <option>Select Vehicle Type</option>
                    <option>Bike</option>
                    <option>Auto</option>
                    <option>Car</option>
                  </select>
                  <Input placeholder="Vehicle Number" className="py-2" />
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Complete Setup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Partner Setup */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
              <CardTitle>Become a Delivery Partner</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-600 text-sm mb-4">
                Deliver orders and earn flexible income. Work whenever you want.
              </p>
              <Button
                onClick={() => setShowDeliverySetup(!showDeliverySetup)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {showDeliverySetup ? "Hide" : "Get Started"}
              </Button>

              {showDeliverySetup && (
                <div className="mt-4 space-y-3 pt-4 border-t border-slate-200">
                  <Input placeholder="License Number" className="py-2" />
                  <Input type="date" placeholder="License Expiry" className="py-2" />
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                    <option>Select Vehicle Type</option>
                    <option>Bike</option>
                    <option>Scooter</option>
                    <option>Car</option>
                  </select>
                  <Input placeholder="Vehicle Number" className="py-2" />
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Complete Setup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
