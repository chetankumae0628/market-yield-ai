import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Leaf, 
  MapPin, 
  Bell, 
  BarChart3, 
  Calendar,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const demandData = [
    { crop: "Tomatoes", demand: "High", price: "₹45/kg", change: "+12%" },
    { crop: "Onions", demand: "Medium", price: "₹35/kg", change: "-5%" },
    { crop: "Potatoes", demand: "Low", price: "₹25/kg", change: "+3%" },
  ];

  const recommendations = [
    { crop: "Capsicum", rating: "Excellent", season: "Next Season", profit: "High" },
    { crop: "Cauliflower", rating: "Good", season: "Current", profit: "Medium" },
    { crop: "Spinach", rating: "Fair", season: "Next Month", profit: "Low" },
  ];

  const alerts = [
    { type: "success", message: "Tomato prices expected to rise 15% next week", time: "2 hours ago" },
    { type: "warning", message: "Onion supply may increase - consider holding", time: "4 hours ago" },
    { type: "info", message: "New market opened in nearby district", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🌾</div>
              <h1 className="text-xl font-bold text-gray-900">AgriForecast</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Bell className="w-4 h-4 mr-1" />
                3 New Alerts
              </Badge>
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smarter Farming Decisions with AI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get real-time market insights, demand forecasts, and AI-powered crop recommendations
            to maximize your farming profits.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Crops</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Leaf className="w-8 h-8 text-green-100" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Active Alerts</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Bell className="w-8 h-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Market Score</p>
                  <p className="text-2xl font-bold">8.5/10</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Nearby Markets</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
            <TabsTrigger value="recommendations">Crop Recommendations</TabsTrigger>
            <TabsTrigger value="timing">Sell Timing</TabsTrigger>
            <TabsTrigger value="markets">Best Markets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Recent Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      {alert.type === "success" && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                      {alert.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                      {alert.type === "info" && <Bell className="w-5 h-5 text-blue-600 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get instant insights for your farming decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700" size="lg">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Demand Forecast
                  </Button>
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" size="lg">
                    <Leaf className="w-5 h-5 mr-2" />
                    Get Crop Recommendations
                  </Button>
                  <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Check Sell Timing
                  </Button>
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" size="lg">
                    <MapPin className="w-5 h-5 mr-2" />
                    Find Best Markets
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Demand Forecast</span>
                </CardTitle>
                <CardDescription>AI-powered market demand predictions for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demandData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">🍅</div>
                        <div>
                          <h3 className="font-semibold">{item.crop}</h3>
                          <Badge variant={item.demand === "High" ? "default" : item.demand === "Medium" ? "secondary" : "outline"}>
                            {item.demand} Demand
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{item.price}</p>
                        <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5" />
                  <span>AI Crop Recommendations</span>
                </CardTitle>
                <CardDescription>Personalized crop suggestions based on market analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="border-2 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">🌶️</div>
                        <h3 className="font-semibold text-lg mb-2">{rec.crop}</h3>
                        <Badge 
                          variant={rec.rating === "Excellent" ? "default" : rec.rating === "Good" ? "secondary" : "outline"}
                          className="mb-2"
                        >
                          {rec.rating}
                        </Badge>
                        <p className="text-sm text-gray-600 mb-2">Plant: {rec.season}</p>
                        <p className="text-sm font-medium">Expected Profit: {rec.profit}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Sell Timing Guidance</span>
                </CardTitle>
                <CardDescription>Optimize your selling strategy with AI insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Tomatoes - Sell Now</h3>
                        <p className="text-sm text-green-700">High demand, prices at peak. Recommended action: Sell immediately.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">Onions - Hold for 1 Week</h3>
                        <p className="text-sm text-yellow-700">Prices expected to rise by 8-12% next week due to supply shortage.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-800">Potatoes - Monitor Closely</h3>
                        <p className="text-sm text-red-700">Market volatility detected. Consider selling 50% now, hold rest.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Best Market Locations</span>
                </CardTitle>
                <CardDescription>Find the most profitable markets near you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Azadpur Mandi", distance: "12 km", demand: "High", price: "Above Average" },
                    { name: "Ghazipur Market", distance: "18 km", demand: "Medium", price: "Average" },
                    { name: "Okhla Mandi", distance: "25 km", demand: "High", price: "Premium" },
                  ].map((market, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <MapPin className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{market.name}</h3>
                          <p className="text-sm text-gray-600">{market.distance} away</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={market.demand === "High" ? "default" : "secondary"}>
                          {market.demand} Demand
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{market.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;