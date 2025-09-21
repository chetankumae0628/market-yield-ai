import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  FileText,
  Eye
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  PriceTrendChart, 
  YieldVsDemandChart, 
  MarketShareChart, 
  ProfitAnalysisChart 
} from "@/components/charts/MarketCharts"
import { AnimatedCard, StaggerContainer, StaggerItem } from "@/components/ui/animated-components"

const reportTypes = [
  { id: "monthly", label: "Monthly Report", description: "Comprehensive monthly analysis" },
  { id: "quarterly", label: "Quarterly Report", description: "Quarterly performance overview" },
  { id: "annual", label: "Annual Report", description: "Year-end summary and insights" },
  { id: "custom", label: "Custom Report", description: "Custom date range analysis" },
]

const recentReports = [
  {
    id: "1",
    title: "June 2024 Market Analysis",
    type: "Monthly",
    date: "2024-06-30",
    status: "Completed",
    downloads: 15
  },
  {
    id: "2",
    title: "Q2 2024 Performance Review",
    type: "Quarterly",
    date: "2024-06-30",
    status: "Completed",
    downloads: 8
  },
  {
    id: "3",
    title: "Tomato Market Forecast",
    type: "Custom",
    date: "2024-06-25",
    status: "In Progress",
    downloads: 0
  },
]

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedCrop, setSelectedCrop] = useState("all")

  return (
    <StaggerContainer className="space-y-6">
      {/* Header */}
      <StaggerItem>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive market analysis and performance insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </StaggerItem>

      {/* Report Type Selection */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generate New Report</span>
            </CardTitle>
            <CardDescription>
              Select the type of report you want to generate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedPeriod === report.id 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedPeriod(report.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">
                        {report.id === "monthly" && "📅"}
                        {report.id === "quarterly" && "📊"}
                        {report.id === "annual" && "📈"}
                        {report.id === "custom" && "⚙️"}
                      </div>
                      <h3 className="font-semibold mb-1">{report.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Filters and Controls */}
      <StaggerItem>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Period:</span>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Crop:</span>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    <SelectItem value="tomatoes">Tomatoes</SelectItem>
                    <SelectItem value="onions">Onions</SelectItem>
                    <SelectItem value="potatoes">Potatoes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="ml-auto">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Charts Section */}
      <StaggerItem>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
            <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriceTrendChart />
              <YieldVsDemandChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketShareChart />
              <ProfitAnalysisChart />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <PriceTrendChart />
          </TabsContent>

          <TabsContent value="yield" className="space-y-6">
            <YieldVsDemandChart />
            <MarketShareChart />
          </TabsContent>

          <TabsContent value="profit" className="space-y-6">
            <ProfitAnalysisChart />
            <PriceTrendChart />
          </TabsContent>
        </Tabs>
      </StaggerItem>

      {/* Recent Reports */}
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Reports</span>
            </CardTitle>
            <CardDescription>
              Your recently generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {report.type === "Monthly" && "📅"}
                        {report.type === "Quarterly" && "📊"}
                        {report.type === "Custom" && "⚙️"}
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • {report.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={report.status === "Completed" ? "default" : "secondary"}
                      >
                        {report.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {report.downloads} downloads
                      </span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  )
}
