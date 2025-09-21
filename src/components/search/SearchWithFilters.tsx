import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X, Crop, MapPin, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnimatedCard } from "@/components/ui/animated-components"

interface SearchResult {
  id: string
  type: "crop" | "market" | "trend"
  title: string
  description: string
  category: string
  price?: string
  location?: string
  trend?: string
}

const mockData: SearchResult[] = [
  {
    id: "1",
    type: "crop",
    title: "Tomatoes",
    description: "High demand crop with excellent profit margins",
    category: "Vegetables",
    price: "₹45/kg",
    trend: "+12%"
  },
  {
    id: "2",
    type: "market",
    title: "Azadpur Mandi",
    description: "Largest wholesale market in Delhi",
    category: "Market",
    location: "Delhi",
    price: "Premium prices"
  },
  {
    id: "3",
    type: "trend",
    title: "Organic Farming",
    description: "Growing trend towards organic produce",
    category: "Trend",
    trend: "+25%"
  },
  {
    id: "4",
    type: "crop",
    title: "Onions",
    description: "Stable demand with seasonal variations",
    category: "Vegetables",
    price: "₹35/kg",
    trend: "-5%"
  },
  {
    id: "5",
    type: "market",
    title: "Ghazipur Market",
    description: "Major vegetable market with good connectivity",
    category: "Market",
    location: "Delhi",
    price: "Competitive prices"
  },
  {
    id: "6",
    type: "crop",
    title: "Potatoes",
    description: "High yield crop with consistent demand",
    category: "Vegetables",
    price: "₹25/kg",
    trend: "+3%"
  }
]

export function SearchWithFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredResults = useMemo(() => {
    return mockData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === "all" || item.type === selectedType
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      
      return matchesSearch && matchesType && matchesCategory
    })
  }, [searchQuery, selectedType, selectedCategory])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedCategory("all")
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "crop":
        return <Crop className="h-5 w-5" />
      case "market":
        return <MapPin className="h-5 w-5" />
      case "trend":
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Search className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crop":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "market":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "trend":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <AnimatedCard delay={0.1}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
          <CardDescription>
            Find crops, markets, and trends with advanced filtering
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search crops, markets, or trends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Filters */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Type:</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="crop">Crops</SelectItem>
                    <SelectItem value="market">Markets</SelectItem>
                    <SelectItem value="trend">Trends</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Category:</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Market">Market</SelectItem>
                    <SelectItem value="Trend">Trend</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </AnimatedCard>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Search Results ({filteredResults.length})
          </h3>
          {searchQuery && (
            <Badge variant="secondary">
              "{searchQuery}"
            </Badge>
          )}
        </div>

        <div className="grid gap-4">
          {filteredResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{result.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {result.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          {result.price && (
                            <span className="text-green-600 font-medium">
                              {result.price}
                            </span>
                          )}
                          {result.location && (
                            <span className="text-blue-600">
                              📍 {result.location}
                            </span>
                          )}
                          {result.trend && (
                            <span className={`font-medium ${
                              result.trend.startsWith('+') 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {result.trend}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
