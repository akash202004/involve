# 🚀 Rivet - On-Demand Local Services Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

> **Rivet** - Your one-stop solution for instant local service booking. Connect with skilled professionals in minutes, not hours.

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Challenges & Solutions](#challenges--solutions)
- [Future Roadmap](#future-roadmap)
- [Credits & Acknowledgments](#credits--acknowledgments)

## 🎯 Problem Statement

Imagine you're on a long drive with your car on a highway, and suddenly the engine won't start. What do you do? You call local mechanics or helplines, but everyone says they're not available right now and need at least 1-2 hours. This frustrating scenario is all too common in our daily lives.

**But it doesn't stop there...**

### Real-World Scenarios We Solve

#### 🚗 **Automotive Emergencies**
- **Highway Breakdown**: Car won't start in the middle of nowhere
- **Flat Tire**: No spare tire or tools to change it
- **Battery Issues**: Dead battery in parking lots or remote areas
- **Engine Problems**: Sudden engine failure during important trips

#### ⚡ **Electrical Emergencies**
- **Short Circuit**: Middle of the night electrical issues
- **Power Outages**: Critical equipment needs immediate repair
- **Faulty Wiring**: Dangerous electrical problems at home
- **Appliance Failures**: Refrigerator, AC, or essential appliances down

#### 🚰 **Plumbing Crises**
- **Burst Pipes**: Water flooding your home
- **Clogged Drains**: Kitchen or bathroom completely unusable
- **Water Heater Issues**: No hot water for essential needs
- **Toilet Problems**: Emergency bathroom situations

#### 💇 **Grooming Urgencies**
- **Important Meetings**: Need immediate haircut, shaving, or facial
- **Special Events**: Last-minute grooming for weddings, interviews
- **Holiday Closures**: All salons closed when you need them most
- **Travel Preparation**: Quick grooming before important trips

#### 🏠 **Home Maintenance**
- **Lock Problems**: Can't enter or secure your home
- **Appliance Repairs**: Essential home equipment failures
- **Furniture Assembly**: Urgent furniture setup needs
- **Cleaning Emergencies**: Critical cleaning situations

**Common Pain Points:**
- ❌ No immediate service availability (especially during emergencies)
- ❌ Long waiting times (1-2 hours minimum, often much longer)
- ❌ Difficulty finding reliable local professionals
- ❌ High costs for emergency services and last-minute bookings
- ❌ Lack of transparency in pricing and service quality
- ❌ No real-time tracking of service providers
- ❌ Limited service hours (most professionals work 9-5)
- ❌ Poor communication and unreliable ETAs
- ❌ No quality guarantees or service warranties
- ❌ Difficulty finding specialized services in remote areas

## 💡 Solution Overview

**Rivet** is a revolutionary on-demand local services platform that connects users with skilled professionals in under 10 minutes. Our platform leverages cutting-edge technology to provide instant, reliable, and affordable services for various needs.

### What Makes Rivet Unique

1. **⚡ Instant Booking** - No prior appointments needed, 24/7 availability
2. **🚀 Fast Service Guarantee** - 10-minute arrival time guarantee
3. **💰 Cost-Effective** - Transparent, competitive pricing with no emergency surcharges
4. **🤖 AI-Powered Problem Diagnosis** - Smart suggestions for minor issues and preventive maintenance
5. **📍 Location-Based Matching** - Customized ratings and recommendations based on your area
6. **⭐ Verified Professionals** - Pre-screened, skilled workers with background checks
7. **📱 Real-Time Tracking** - Live location updates and accurate ETA predictions
8. **🔒 Secure Payments** - Blockchain-powered transactions with escrow protection
9. **📊 Quality Assurance** - Comprehensive rating and review system with dispute resolution
10. **🌍 Multi-Service Support** - Plumbers, electricians, mechanics, beauticians, and more
11. **🕒 24/7 Availability** - Round-the-clock service for true emergencies
12. **🎯 Specialized Solutions** - Experts for specific problems, not general handymen

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        RIVET PLATFORM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Frontend  │    │   Backend   │    │     AI      │        │
│  │  (Next.js)  │◄──►│ (Express.js)│◄──►│ (Flask API) │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                   │                   │              │
│         │                   │                   │              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Mobile    │    │ PostgreSQL  │    │  Blockchain │        │
│  │   App       │    │ + PostGIS   │    │  (Aptos)    │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                   │                   │              │
│         │                   │                   │              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │ Real-Time   │    │   Redis     │    │  Cloudinary │        │
│  │ WebSockets  │    │ (Pub/Sub)   │    │ (Media)     │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### System Components

1. **Frontend Layer** - Next.js with TypeScript, Tailwind CSS, and Framer Motion
2. **Backend API** - Express.js with Drizzle ORM and PostgreSQL
3. **Real-Time Communication** - Socket.io with Redis Pub/Sub
4. **AI Services** - Flask API with Google Gemini for problem diagnosis
5. **Blockchain Integration** - Aptos Move for secure transactions
6. **Geospatial Services** - PostGIS for location-based queries
7. **Media Management** - Cloudinary for file uploads
8. **Caching Layer** - Redis for session management and real-time data

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.3.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12.18.1](https://www.framer.com/motion/)
- **Maps**: [Leaflet](https://leafletjs.com/) with React Leaflet
- **Charts**: [Chart.js](https://www.chartjs.org/) and [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
- **Authentication**: [Civic Auth](https://civic.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with Express.js 5.1.0
- **Language**: [TypeScript 5.8.3](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [PostGIS](https://postgis.net/)
- **ORM**: [Drizzle ORM 0.44.2](https://orm.drizzle.team/)
- **Real-time**: [Socket.io 4.8.1](https://socket.io/) with Redis adapter
- **Queue Management**: [BullMQ 5.54.2](https://docs.bullmq.io/)
- **Validation**: [Zod 3.25.64](https://zod.dev/)
- **File Upload**: [Multer](https://github.com/expressjs/multer)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)

### AI Services
- **Framework**: [Flask 2.3.3](https://flask.palletsprojects.com/)
- **AI Model**: [Google Gemini](https://ai.google.dev/) via google-generativeai
- **CORS**: [Flask-CORS](https://flask-cors.readthedocs.io/)

### Blockchain
- **Platform**: [Aptos](https://aptos.dev/) blockchain
- **Language**: [Move](https://move-language.github.io/move/)
- **SDK**: [Aptos SDK](https://github.com/aptos-labs/aptos-core)

### DevOps & Tools
- **Package Manager**: [npm](https://www.npmjs.com/)
- **Development**: [Nodemon](https://nodemon.io/) for auto-reload
- **Database Migrations**: [Drizzle Kit](https://orm.drizzle.team/kit-docs/)
- **Environment**: [dotenv](https://github.com/motdotla/dotenv)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ with PostGIS extension
- Redis 6+
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/palsoumaditya/rivet-platform.git
   cd rivet-platform
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your database and API keys
   
   # Run database migrations
   npm run db:generate
   npm run db:migrate
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Set up environment variables
   cp .env.example .env.local
   # Edit .env.local with your API endpoints
   
   # Start development server
   npm run dev
   ```

4. **AI Services Setup**
   ```bash
   cd ai
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Add your Google Gemini API key
   
   # Start Flask server
   python main.py
   ```

5. **Blockchain Setup**
   ```bash
   cd Blockchain
   
   # Install Aptos CLI
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   
   # Initialize and deploy
   aptos init
   aptos move compile
   aptos move test
   aptos move publish
   ```

### Environment Variables

Create `.env` files in each directory with the following variables:

**Backend/.env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/rivet_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=your-gemini-key
```

**Frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

**AI/.env**
```env
GEMINI_API_KEY=your-gemini-api-key
FLASK_ENV=development
```

## 📚 API Documentation

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/worker/register` - Worker registration

#### Jobs & Bookings
- `POST /api/jobs` - Create new job request
- `GET /api/jobs` - Get user's jobs
- `PUT /api/jobs/:id/status` - Update job status
- `GET /api/jobs/nearby` - Find nearby workers

#### Real-time Features
- `WebSocket /socket.io` - Real-time communication
- `POST /api/location/update` - Update worker location
- `GET /api/location/track/:jobId` - Track job progress

#### AI Services
- `POST /api/analyze` - AI problem diagnosis
- `GET /api/suggestions` - Get service suggestions

### WebSocket Events

```javascript
// Client events
socket.emit('join-job', { jobId: 'uuid' });
socket.emit('update-location', { lat, lng });
socket.emit('job-status-update', { jobId, status });

// Server events
socket.on('worker-assigned', (data) => {});
socket.on('location-update', (data) => {});
socket.on('job-completed', (data) => {});
```

## 🚀 Deployment

### Production Deployment

1. **Backend Deployment (Railway/Heroku)**
   ```bash
   cd Backend
   npm run build
   npm start
   ```

2. **Frontend Deployment (Vercel)**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

3. **Database Setup**
   - Use managed PostgreSQL service (Railway, Supabase, or AWS RDS)
   - Enable PostGIS extension
   - Set up connection pooling

4. **Redis Setup**
   - Use managed Redis service (Upstash, Redis Cloud)
   - Configure for production workloads

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎯 Challenges & Solutions

### Technical Challenges

1. **Real-time Location Tracking**
   - **Challenge**: Maintaining accurate, low-latency location updates across multiple service providers
   - **Solution**: WebSocket connections with Redis Pub/Sub for scalability and real-time updates

2. **Worker Matching Algorithm**
   - **Challenge**: Finding the best worker based on location, skills, availability, and user preferences
   - **Solution**: PostGIS spatial queries with custom scoring algorithms and AI-powered matching

3. **Payment Security**
   - **Challenge**: Ensuring secure, transparent transactions with escrow protection
   - **Solution**: Blockchain integration with Aptos Move for immutable records and smart contracts

4. **AI Problem Diagnosis**
   - **Challenge**: Accurate problem identification from user descriptions and images
   - **Solution**: Google Gemini API with custom prompt engineering and image analysis

5. **Scalability**
   - **Challenge**: Handling high concurrent users and real-time updates during peak hours
   - **Solution**: Microservices architecture with Redis caching and load balancing

### Business Challenges & Market Opportunities

#### 🏢 **Market Penetration Challenges**

1. **Established Competition**
   - **Challenge**: Competing with traditional service providers and existing platforms
   - **Solution**: 
     - Focus on speed and reliability as key differentiators
     - Build trust through verified professionals and quality guarantees
     - Leverage technology to provide superior user experience

2. **Worker Acquisition & Retention**
   - **Challenge**: Attracting and retaining skilled professionals in a competitive market
   - **Solution**:
     - Higher commission rates than traditional agencies
     - Flexible working hours and location independence
     - Professional development and training programs
     - Transparent payment systems with quick settlements

3. **Geographic Expansion**
   - **Challenge**: Scaling operations across different cities and regions
   - **Solution**:
     - Franchise model for local partnerships
     - Technology-driven operations to minimize overhead
     - Local market research and customized service offerings

#### 💼 **Operational Challenges**

4. **Quality Control**
   - **Challenge**: Maintaining consistent service quality across different professionals
   - **Solution**:
     - Comprehensive vetting process for all workers
     - Real-time monitoring and customer feedback systems
     - Performance-based incentives and penalties
     - Continuous training and skill development programs

5. **Customer Trust & Safety**
   - **Challenge**: Building trust in a new service model with safety concerns
   - **Solution**:
     - Background checks and identity verification for all workers
     - Real-time tracking and emergency contact systems
     - Insurance coverage for both customers and workers
     - Transparent pricing with no hidden fees

6. **Regulatory Compliance**
   - **Challenge**: Navigating complex local regulations and licensing requirements
   - **Solution**:
     - Legal partnerships for compliance management
     - Automated verification of licenses and certifications
     - Regular audits and compliance monitoring
     - Government partnerships for streamlined operations

#### 📈 **Growth & Scaling Challenges**

7. **Customer Acquisition**
   - **Challenge**: Building initial user base and overcoming trust barriers
   - **Solution**:
     - Strategic partnerships with insurance companies and property managers
     - Referral programs and loyalty rewards
     - Content marketing focusing on emergency preparedness
     - Community engagement and local business partnerships

8. **Revenue Model Optimization**
   - **Challenge**: Balancing competitive pricing with sustainable profit margins
   - **Solution**:
     - Dynamic pricing based on demand and availability
     - Premium subscription models for regular users
     - Corporate partnerships and bulk service agreements
     - Value-added services like maintenance contracts

9. **Technology Infrastructure**
   - **Challenge**: Building and maintaining robust technology infrastructure
   - **Solution**:
     - Cloud-native architecture for scalability
     - Continuous monitoring and automated scaling
     - Regular security audits and updates
     - Backup systems and disaster recovery plans

### 🎯 **Business Value Proposition**

#### **For Customers:**
- **Time Savings**: 10-minute service vs. 1-2 hour waits
- **Cost Savings**: Transparent pricing, no emergency surcharges
- **Convenience**: 24/7 availability, no appointments needed
- **Quality Assurance**: Verified professionals with guaranteed satisfaction
- **Safety**: Background-checked workers with real-time tracking

#### **For Service Providers:**
- **Higher Earnings**: Better commission rates than traditional agencies
- **Flexible Schedule**: Work when and where you want
- **Steady Work**: Consistent job flow through platform
- **Professional Growth**: Training and skill development opportunities
- **Secure Payments**: Quick, reliable payment processing

#### **For Investors:**
- **Massive Market**: $400B+ global home services market
- **Recurring Revenue**: Subscription and commission-based model
- **Scalable Technology**: Cloud-based platform with global potential
- **Network Effects**: More users attract more professionals and vice versa
- **Data Assets**: Valuable insights into service patterns and customer behavior

#### **For Society:**
- **Job Creation**: New opportunities for skilled professionals
- **Economic Growth**: Increased efficiency in service delivery
- **Community Safety**: Emergency response capabilities
- **Environmental Impact**: Reduced travel time and fuel consumption
- **Digital Inclusion**: Technology access for traditional service providers

### 📊 **Market Opportunity**

- **Global Home Services Market**: $400+ billion (growing at 8% annually)
- **On-Demand Services**: $335 billion market by 2025
- **Emergency Services**: $150 billion market with high growth potential
- **Target Addressable Market**: $50+ billion in initial markets
- **Customer Lifetime Value**: $500+ per customer annually
- **Market Penetration Goal**: 5% of target market within 3 years

This comprehensive approach positions Rivet as not just a service platform, but a complete solution to real-world problems that affect millions of people daily. Our technology-driven approach, combined with human-centric service delivery, creates a sustainable competitive advantage in the rapidly growing on-demand services market.

## 🗺️ Future Roadmap

### Phase 1 - MVP Launch
- ✅ Core booking functionality
- ✅ Real-time tracking
- ✅ Basic AI diagnosis
- ✅ Payment integration

### Phase 2 - Enhanced Features
- 🔄 Advanced AI problem diagnosis
- 🔄 Blockchain-based reputation system
- 🔄 Multi-language support
- 🔄 Advanced analytics dashboard

### Phase 3 - Scale & Expand
- 📋 Mobile app development
- 📋 Enterprise solutions
- 📋 International expansion
- 📋 IoT integration for smart home services

### Phase 4 - Innovation
- 📋 AR/VR service visualization
- 📋 Predictive maintenance
- 📋 Autonomous service robots
- 📋 Advanced ML for demand prediction

## 🙏 Credits & Acknowledgments

### Open Source Libraries
- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Socket.io](https://socket.io/) - Real-time communication
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Aptos](https://aptos.dev/) - Blockchain platform

### APIs & Services
- [Google Gemini](https://ai.google.dev/) - AI/ML services
- [Cloudinary](https://cloudinary.com/) - Media management
- [PostGIS](https://postgis.net/) - Spatial database
- [Redis](https://redis.io/) - In-memory data store

### Development Tools
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Git](https://git-scm.com/) - Version control

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



<div align="center">
  <p>Made with ❤️ by Code for Change</p>
  <p>Empowering communities through instant service access</p>
</div>