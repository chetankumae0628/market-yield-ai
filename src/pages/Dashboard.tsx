import { useState } from "react";
import { motion } from "framer-motion";
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
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  PriceTrendChart, 
  YieldVsDemandChart, 
  MarketShareChart, 
  ProfitAnalysisChart 
} from "@/components/charts/MarketCharts";
import { SearchWithFilters } from "@/components/search/SearchWithFilters";
import { AnimatedCard, StaggerContainer, StaggerItem } from "@/components/ui/animated-components";
import { Chatbot } from "@/components/chat/Chatbot";

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
    <DashboardLayout currentPage="dashboard">
      <StaggerContainer className="space-y-6">
        {/* Hero Section */}
        <StaggerItem>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Smarter Farming Decisions with AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get real-time market insights, demand forecasts, and AI-powered crop recommendations
              to maximize your farming profits.
            </p>
          </div>
        </StaggerItem>

        {/* Quick Stats */}
        <StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <AnimatedCard delay={0.1}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Crops</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                  </div>
                  <Leaf className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard delay={0.2}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-foreground">3</p>
                  </div>
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard delay={0.3}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Market Score</p>
                    <p className="text-2xl font-bold text-foreground">8.5/10</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard delay={0.4}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Nearby Markets</p>
                    <p className="text-2xl font-bold text-foreground">7</p>
                  </div>
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </AnimatedCard>
          </div>
        </StaggerItem>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
            <TabsTrigger value="recommendations">Crop Recommendations</TabsTrigger>
            <TabsTrigger value="timing">Sell Timing</TabsTrigger>
            <TabsTrigger value="markets">Best Markets</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <AnimatedCard delay={0.1}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Recent Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-muted"
                    >
                      {alert.type === "success" && <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />}
                      {alert.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />}
                      {alert.type === "info" && <Bell className="w-5 h-5 text-blue-400 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </AnimatedCard>

              {/* Quick Actions */}
              <AnimatedCard delay={0.2}>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get instant insights for your farming decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full justify-start" size="lg">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Demand Forecast
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full justify-start" variant="secondary" size="lg">
                      <Leaf className="w-5 h-5 mr-2" />
                      Get Crop Recommendations
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full justify-start" variant="outline" size="lg">
                      <Calendar className="w-5 h-5 mr-2" />
                      Check Sell Timing
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full justify-start" variant="secondary" size="lg">
                      <MapPin className="w-5 h-5 mr-2" />
                      Find Best Markets
                    </Button>
                  </motion.div>
                </CardContent>
              </AnimatedCard>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriceTrendChart />
              <YieldVsDemandChart />
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
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">🍅</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{item.crop}</h3>
                          <Badge variant={item.demand === "High" ? "default" : item.demand === "Medium" ? "secondary" : "outline"}>
                            {item.demand} Demand
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{item.price}</p>
                        <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
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
                    <Card key={index} className="border-2 border-border hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">🌶️</div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">{rec.crop}</h3>
                        <Badge 
                          variant={rec.rating === "Excellent" ? "default" : rec.rating === "Good" ? "secondary" : "outline"}
                          className="mb-2"
                        >
                          {rec.rating}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-2">Plant: {rec.season}</p>
                        <p className="text-sm font-medium text-foreground">Expected Profit: {rec.profit}</p>
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
                  <div className="p-4 border border-border rounded-lg bg-muted">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <h3 className="font-semibold text-foreground">Tomatoes - Sell Now</h3>
                        <p className="text-sm text-muted-foreground">High demand, prices at peak. Recommended action: Sell immediately.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg bg-muted">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h3 className="font-semibold text-foreground">Onions - Hold for 1 Week</h3>
                        <p className="text-sm text-muted-foreground">Prices expected to rise by 8-12% next week due to supply shortage.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg bg-muted">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <div>
                        <h3 className="font-semibold text-foreground">Potatoes - Monitor Closely</h3>
                        <p className="text-sm text-muted-foreground">Market volatility detected. Consider selling 50% now, hold rest.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <AnimatedCard delay={0.1}>
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
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <MapPin className="w-8 h-8 text-blue-400" />
                        <div>
                          <h3 className="font-semibold text-foreground">{market.name}</h3>
                          <p className="text-sm text-muted-foreground">{market.distance} away</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={market.demand === "High" ? "default" : "secondary"}>
                          {market.demand} Demand
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{market.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <SearchWithFilters />
          </TabsContent>
        </Tabs>
      </StaggerContainer>
      
      {/* Floating Chatbot */}
      <Chatbot />
    </DashboardLayout>
  );
};

export default Dashboard;