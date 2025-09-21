import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Bot, 
  Zap, 
  Brain, 
  TrendingUp,
  Leaf,
  BarChart3,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Chatbot } from "@/components/chat/Chatbot"
import { AnimatedCard, StaggerContainer, StaggerItem } from "@/components/ui/animated-components"

const aiFeatures = [
  {
    icon: Brain,
    title: "Smart Crop Recommendations",
    description: "Get AI-powered suggestions for the best crops to plant based on market trends, weather, and soil conditions.",
    color: "text-blue-600"
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "Real-time market insights and price predictions to help you make informed selling decisions.",
    color: "text-green-600"
  },
  {
    icon: Calendar,
    title: "Optimal Timing",
    description: "Know exactly when to plant, harvest, and sell your crops for maximum profit.",
    color: "text-purple-600"
  },
  {
    icon: BarChart3,
    title: "Yield Forecasting",
    description: "Predict your crop yields and plan your farming activities with AI accuracy.",
    color: "text-orange-600"
  }
]

const conversationExamples = [
  {
    question: "What crops should I plant this season?",
    answer: "Based on current market trends and weather forecasts, I recommend focusing on tomatoes and capsicum. Both have high demand and favorable growing conditions for your region."
  },
  {
    question: "When is the best time to sell my onions?",
    answer: "The optimal selling window for onions is in the next 2-3 weeks. Prices are expected to rise by 12-15% due to supply shortage in nearby markets."
  },
  {
    question: "How can I improve my potato yield?",
    answer: "For better potato yields, consider soil testing, proper irrigation scheduling, and using certified seeds. Your current soil pH is ideal, so focus on nutrient management."
  }
]

export default function ChatbotPage() {
  return (
    <StaggerContainer className="space-y-6">
      {/* Header */}
      <StaggerItem>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <Bot className="h-10 w-10 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold">AI Farming Assistant</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your intelligent farming companion powered by advanced AI. Get instant answers to your farming questions, 
              market insights, and personalized recommendations.
            </p>
          </div>
        </div>
      </StaggerItem>

      {/* AI Features */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>AI-Powered Features</span>
            </CardTitle>
            <CardDescription>
              Discover what our AI assistant can do for your farming success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start space-x-4 p-4 rounded-lg border hover:shadow-md transition-all"
                  >
                    <div className={`p-2 rounded-lg bg-primary/10 ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Conversation Examples */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Example Conversations</span>
            </CardTitle>
            <CardDescription>
              See how other farmers are using the AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversationExamples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">Q</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{example.question}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 ml-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{example.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Quick Actions */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can ask the AI assistant about
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                <Leaf className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Crop Planning</div>
                  <div className="text-xs text-muted-foreground">Get planting recommendations</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                <TrendingUp className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Market Analysis</div>
                  <div className="text-xs text-muted-foreground">Check price trends</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Harvest Timing</div>
                  <div className="text-xs text-muted-foreground">Optimal harvest schedule</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Chat Interface */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Start a Conversation</span>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Online</span>
              </Badge>
            </CardTitle>
            <CardDescription>
              Click the chat button in the bottom-right corner to start talking with the AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
              >
                <MessageSquare className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Ready to Chat!</h3>
              <p className="text-muted-foreground mb-4">
                The AI assistant is ready to help you with your farming questions
              </p>
              <Button size="lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Floating Chatbot Component */}
      <Chatbot />
    </StaggerContainer>
  )
}
