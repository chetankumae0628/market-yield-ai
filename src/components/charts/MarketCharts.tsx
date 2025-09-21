import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { AnimatedCard } from "@/components/ui/animated-components"

// Mock data for charts
const priceTrendData = [
  { month: "Jan", tomatoes: 40, onions: 30, potatoes: 25 },
  { month: "Feb", tomatoes: 45, onions: 32, potatoes: 28 },
  { month: "Mar", tomatoes: 50, onions: 35, potatoes: 30 },
  { month: "Apr", tomatoes: 48, onions: 38, potatoes: 32 },
  { month: "May", tomatoes: 55, onions: 40, potatoes: 35 },
  { month: "Jun", tomatoes: 60, onions: 42, potatoes: 38 },
]

const yieldData = [
  { crop: "Tomatoes", yield: 85, demand: 90 },
  { crop: "Onions", yield: 70, demand: 75 },
  { crop: "Potatoes", yield: 95, demand: 80 },
  { crop: "Capsicum", yield: 60, demand: 85 },
  { crop: "Cauliflower", yield: 80, demand: 70 },
]

const marketShareData = [
  { name: "Tomatoes", value: 35, color: "#8884d8" },
  { name: "Onions", value: 25, color: "#82ca9d" },
  { name: "Potatoes", value: 20, color: "#ffc658" },
  { name: "Others", value: 20, color: "#ff7300" },
]

const profitData = [
  { month: "Jan", profit: 12000, cost: 8000 },
  { month: "Feb", profit: 15000, cost: 9000 },
  { month: "Mar", profit: 18000, cost: 10000 },
  { month: "Apr", profit: 16000, cost: 9500 },
  { month: "May", profit: 20000, cost: 11000 },
  { month: "Jun", profit: 22000, cost: 12000 },
]

export function PriceTrendChart() {
  return (
    <AnimatedCard delay={0.1}>
      <CardHeader>
        <CardTitle>Price Trends</CardTitle>
        <CardDescription>Monthly price changes for key crops</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tomatoes" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="onions" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="potatoes" stroke="#ffc658" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </AnimatedCard>
  )
}

export function YieldVsDemandChart() {
  return (
    <AnimatedCard delay={0.2}>
      <CardHeader>
        <CardTitle>Yield vs Demand</CardTitle>
        <CardDescription>Current yield compared to market demand</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yieldData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="crop" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="yield" fill="#8884d8" name="Yield %" />
            <Bar dataKey="demand" fill="#82ca9d" name="Demand %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </AnimatedCard>
  )
}

export function MarketShareChart() {
  return (
    <AnimatedCard delay={0.3}>
      <CardHeader>
        <CardTitle>Market Share</CardTitle>
        <CardDescription>Distribution of crops in your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={marketShareData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {marketShareData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </AnimatedCard>
  )
}

export function ProfitAnalysisChart() {
  return (
    <AnimatedCard delay={0.4}>
      <CardHeader>
        <CardTitle>Profit Analysis</CardTitle>
        <CardDescription>Monthly profit vs cost breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="profit" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="cost" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </AnimatedCard>
  )
}
