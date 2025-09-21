import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Leaf, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { AnimatedCard, StaggerContainer, StaggerItem } from "@/components/ui/animated-components";

const Index = () => {
  const features = [
    {
      icon: BarChart3,
      title: "AI Market Analysis",
      description: "Get real-time market insights and price predictions powered by advanced AI algorithms."
    },
    {
      icon: Leaf,
      title: "Smart Crop Recommendations",
      description: "Receive personalized crop suggestions based on market trends, weather, and soil conditions."
    },
    {
      icon: TrendingUp,
      title: "Profit Optimization",
      description: "Maximize your farming profits with data-driven insights and optimal timing recommendations."
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Get instant answers to your farming questions with our intelligent chatbot assistant."
    }
  ];

  const stats = [
    { label: "Active Farmers", value: "10,000+", icon: "👨‍🌾" },
    { label: "Crops Analyzed", value: "50+", icon: "🌾" },
    { label: "Markets Covered", value: "500+", icon: "🏪" },
    { label: "Success Rate", value: "95%", icon: "📈" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950">
      <StaggerContainer className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <StaggerItem>
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-6xl mb-6"
            >
              🌾
            </motion.div>
            <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              AgriForecast
            </h1>
            <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Smarter Farming Decisions with AI
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Help farmers forecast local market demand and prevent crop gluts with AI-driven insights. 
              Maximize your profits with intelligent crop recommendations and real-time market analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/auth'}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-8 py-3 text-lg font-medium"
                >
                  View Dashboard
                </Button>
              </motion.div>
            </div>
          </div>
        </StaggerItem>

        {/* Stats Section */}
        <StaggerItem>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <AnimatedCard key={stat.label} delay={index * 0.1}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </StaggerItem>

        {/* Features Section */}
        <StaggerItem>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Why Choose AgriForecast?
            </h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive farming solutions to help you succeed
            </p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedCard key={feature.title} delay={index * 0.1}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </AnimatedCard>
              );
            })}
          </div>
        </StaggerItem>

        {/* Benefits Section */}
        <StaggerItem>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Transform Your Farming Journey
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Join thousands of farmers who have already improved their yields and profits
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Increased Profits</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Average 25% increase in farming profits with our AI recommendations
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Better Yields</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Optimize your crop selection and timing for maximum yield potential
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Get instant answers to your farming questions with our AI assistant
                </p>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* CTA Section */}
        <StaggerItem>
          <div className="text-center mt-16">
            <Badge variant="secondary" className="mb-4">
              Ready to build the full AgriForecast application
            </Badge>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/auth'}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
};

export default Index;
