# Market Yield AI - Backend API

A comprehensive backend API for the Market Yield AI application, built with Node.js, Express, TypeScript, and MongoDB. This API provides crop yield prediction, data analytics, user management, and real-time notifications.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Crop Management**: CRUD operations for crop data with yield tracking and predictions
- **Analytics & Reporting**: Generate comprehensive reports with charts and data visualization
- **Real-time Notifications**: WebSocket support for live updates and alerts
- **Data Validation**: Comprehensive input validation using express-validator
- **Security**: Helmet, CORS, rate limiting, and password hashing with bcrypt
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **TypeScript**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-yield-ai/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/market-yield-ai
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### User Management (`/api/users`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID (Admin only)
- `PUT /users/:id/status` - Update user status (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

#### Crop Management (`/api/crops`)
- `GET /` - Get all crops with filtering
- `GET /market-overview` - Get market overview analytics
- `POST /` - Create new crop
- `GET /:id` - Get crop by ID
- `PUT /:id` - Update crop
- `DELETE /:id` - Delete crop
- `POST /:id/yield-data` - Add yield data to crop
- `POST /:id/predictions` - Add prediction to crop
- `GET /analytics/:id` - Get crop analytics

#### Report Management (`/api/reports`)
- `POST /generate` - Generate new report
- `GET /my-reports` - Get user's reports
- `GET /:id` - Get report by ID
- `POST /:id/download` - Download report
- `DELETE /:id` - Delete report
- `GET /` - Get all reports (Admin only)

### Request/Response Examples

#### User Registration
```json
POST /api/users/register
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer",
  "farmSize": "5 acres",
  "experience": "Experienced",
  "location": "Delhi, India",
  "phone": "+91 98765 43210"
}
```

#### Crop Creation
```json
POST /api/crops
{
  "name": "Tomatoes",
  "type": "vegetable",
  "season": "summer",
  "plantingMonths": [3, 4, 5],
  "harvestMonths": [6, 7, 8],
  "description": "High-yield tomato variety",
  "marketDemand": "high",
  "difficulty": "medium",
  "waterRequirement": "high"
}
```

#### Report Generation
```json
POST /api/reports/generate
{
  "title": "Monthly Crop Analysis",
  "type": "monthly",
  "description": "Comprehensive monthly crop analysis",
  "filters": {
    "cropType": "vegetable",
    "marketDemand": "high"
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/market-yield-ai` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### Database Models

#### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: Enum ['farmer', 'admin', 'analyst']
- `farmSize`: Enum ['1-2 acres', '3-5 acres', '5 acres', '10+ acres']
- `experience`: Enum ['Beginner', 'Intermediate', 'Experienced', 'Expert']
- `location`: String
- `phone`: String
- `isActive`: Boolean
- `lastLogin`: Date

#### Crop Model
- `name`: String (required, unique)
- `type`: Enum ['vegetable', 'fruit', 'grain', 'legume', 'other']
- `season`: Enum ['spring', 'summer', 'autumn', 'winter', 'year-round']
- `plantingMonths`: Array of numbers (1-12)
- `harvestMonths`: Array of numbers (1-12)
- `yieldData`: Array of yield data objects
- `predictions`: Array of prediction objects
- `marketDemand`: Enum ['low', 'medium', 'high']
- `createdBy`: ObjectId (reference to User)

#### Report Model
- `title`: String (required)
- `type`: Enum ['monthly', 'quarterly', 'annual', 'custom']
- `reportData`: Array of chart data objects
- `filters`: Object with filter criteria
- `generatedBy`: ObjectId (reference to User)
- `status`: Enum ['generating', 'completed', 'failed']
- `downloadCount`: Number

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Secure error messages without sensitive data exposure

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Sample API Calls

#### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up logging
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Real-time Features

The API includes WebSocket support for real-time notifications:

- **User Notifications**: Personal notifications for each user
- **Crop Alerts**: Real-time alerts for crop-related events
- **Market Updates**: Live market data updates

### Socket.IO Events
- `join-user-room`: Join user's personal notification room
- `subscribe-crop-alerts`: Subscribe to crop-specific alerts
- `subscribe-market-updates`: Subscribe to market updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - User authentication and management
  - Crop CRUD operations
  - Report generation
  - Real-time notifications
  - Comprehensive API documentation
