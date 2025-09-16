# 🔤 Gen Z → Human Translator

A full-stack web application that translates Gen Z slang, abbreviations, and expressions into clear, understandable language. Built with React, Spring Boot, PostgreSQL, and Docker.

![Gen Z Translator Demo](https://via.placeholder.com/800x400/6366f1/ffffff?text=Gen+Z+Translator+Demo)

## 🌟 Features

### Core Translation Engine
- **Real-time translation** of Gen Z text to standard English
- **Context-aware replacements** using word boundaries
- **Popularity tracking** - most-used terms get higher scores
- **Translation history** - all translations saved to database

### Rich Vocabulary Database
- **120+ Gen Z terms** categorized by type (slang, abbreviations, expressions)
- **Dynamic vocabulary** - easy to add new terms via API
- **Search functionality** - find terms and translations
- **Category organization** - slang, internet culture, relationships, etc.

### Modern User Experience
- **Responsive design** - works on desktop, tablet, and mobile
- **Real-time API status** - visual indication of backend connectivity
- **Error handling** - graceful failures with retry options
- **Loading states** - clear feedback during operations
- **Translation analytics** - see which terms were found and translated

## 🏗️ Architecture

```
┌─────────────┐    HTTP/REST    ┌──────────────┐    JDBC      ┌─────────────┐
│   React     │ ──────────────▶ │ Spring Boot │ ──────────▶  │ PostgreSQL  │
│ (Frontend)  │                 │ (Backend)   │               │ (Database)  │
│ Port 3000   │ ◀────────────── │ Port 8080   │ ◀──────────  │ Port 5432   │
└─────────────┘    JSON         └─────────────┘               └─────────────┘
       │                                │                            │
       │                                │                            │
       └────────────────────── Docker Compose ───────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have:

- **Docker** (v20.10 or higher) & **Docker Compose** (v2.0 or higher)
- **Git** for cloning the repository
- **VSCode** (recommended) with extensions:
  - Spring Boot Extension Pack
  - Docker
  - PostgreSQL

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/genz-translator.git
cd genz-translator
```

### 2. Start the Application
```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# Check if all services are running
docker-compose ps
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/health
- **Database**: localhost:5432 (use pgAdmin or similar)

### 4. Test the Translation
1. Open http://localhost:3000
2. Enter Gen Z text like: `"no cap bestie, this app is bussin fr fr"`
3. Click "Translate" to see: `"No lie best friend, this app is really good (usually food) for real for real"`

## 🗂️ Project Structure

```
genz-translator/
├── 📁 frontend/                 # React application
│   ├── 📁 src/
│   │   ├── 📄 App.js            # Main React component
│   │   ├── 📄 services/api.js   # API service layer
│   │   └── 📄 hooks/useTranslation.js  # Custom React hook
│   ├── 📄 package.json
│   ├── 📄 Dockerfile
│   └── 📄 nginx.conf
├── 📁 backend/                  # Spring Boot application  
│   ├── 📁 src/main/java/com/genz/translator/
│   │   ├── 📄 GenZTranslatorApplication.java
│   │   ├── 📁 controller/       # REST endpoints
│   │   ├── 📁 service/          # Business logic
│   │   ├── 📁 model/            # JPA entities
│   │   ├── 📁 repository/       # Data access layer
│   │   └── 📁 dto/              # Data transfer objects
│   ├── 📄 pom.xml
│   └── 📄 Dockerfile
├── 📁 database/
│   └── 📄 init.sql              # Database schema and initial data
├── 📄 docker-compose.yml        # Main orchestration
├── 📄 docker-compose.override.yml  # Development overrides
├── 📄 docker-compose.prod.yml   # Production settings
└── 📄 README.md
```

## 🔌 API Endpoints

### Translation Endpoints
```http
POST /api/translate              # Translate text (JSON body)
GET  /api/translate?text=...     # Translate text (query param)
GET  /api/health                 # API health check
```

### Terms Management
```http
GET  /api/terms                  # Get all terms
GET  /api/terms/popular          # Get terms by popularity
GET  /api/terms/search?query=... # Search terms
POST /api/terms                  # Add new term
```

### History & Analytics
```http
GET /api/history?limit=10        # Get recent translations
```

### Example API Calls

**Translate Text:**
```bash
curl -X POST http://localhost:8080/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "no cap this is bussin"}'
```

**Response:**
```json
{
  "originalText": "no cap this is bussin",
  "translatedText": "No lie this is really good (usually food)",
  "termsFound": ["no cap", "bussin"],
  "success": true
}
```

## 🗄️ Database Schema

### Terms Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| genz_text | VARCHAR(255) | Gen Z term (unique) |
| translation | VARCHAR(255) | Human translation |
| category | VARCHAR(50) | Term category |
| popularity_score | INTEGER | Usage tracking |
| created_at | TIMESTAMP | Creation time |

### Translation History Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| original_text | TEXT | Input text |
| translated_text | TEXT | Output text |
| terms_found | TEXT[] | Array of translated terms |
| created_at | TIMESTAMP | Translation time |

### Sample Data Categories
- **slang**: no cap, slay, bet
- **abbreviation**: fr, ngl, iykyk, tbh  
- **descriptive**: bussin, mid, sus, lowkey
- **relationship**: bestie, bae, fam
- **expression**: it's giving, rent free, hits different
- **internet**: based, cringe, stan
- **reaction**: sheesh, oop

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Production
```bash
# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=2
```

### Database Operations
```bash
# Connect to database
docker-compose exec database psql -U genz_user -d genz_translator

# Backup database
docker-compose exec database pg_dump -U genz_user genz_translator > backup.sql

# Restore database
docker-compose exec -T database psql -U genz_user -d genz_translator < backup.sql
```

## 🛠️ Development

### Running Individual Services

**Frontend only:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

**Backend only:**
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

**Database only:**
```bash
docker run --name genz-postgres \
  -e POSTGRES_DB=genz_translator \
  -e POSTGRES_USER=genz_user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 -d postgres:15
```

### Adding New Terms

**Via API:**
```bash
curl -X POST http://localhost:8080/api/terms \
  -H "Content-Type: application/json" \
  -d '{
    "genzText": "slaps",
    "translation": "is really good (usually music)", 
    "category": "slang"
  }'
```

**Via Database:**
```sql
INSERT INTO terms (genz_text, translation, category) 
VALUES ('new_term', 'translation here', 'category');
```

## 🎨 Frontend Customization

### Changing Colors
Edit `frontend/src/App.js` and modify Tailwind classes:
```javascript
// Change primary color from purple to green
"bg-gradient-to-r from-green-600 to-blue-600"

// Change accent colors
"bg-green-50 border-green-200"
```

### Adding New Components
```javascript
// Create new component file
// frontend/src/components/NewFeature.js
export default function NewFeature() {
  return <div>New Feature Component</div>;
}

// Import and use in App.js
import NewFeature from './components/NewFeature';
```

## 🔒 Security Considerations

### Production Deployment
1. **Change default passwords** in docker-compose.prod.yml
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** with reverse proxy (nginx)
4. **Add rate limiting** to prevent API abuse
5. **Implement authentication** for admin features

### Environment Variables
```bash
# .env file for production
DATABASE_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

**🔴 API Connection Failed**
```bash
# Check if backend is running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

**🔴 Database Connection Error**
```bash
# Check database logs
docker-compose logs database

# Verify database is accessible
docker-compose exec database psql -U genz_user -d genz_translator -c "\l"
```

**🔴 Frontend Build Errors**
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**🔴 Docker Issues**
```bash
# Clean up Docker resources
docker system prune -a

# Remove all containers and start fresh
docker-compose down -v
docker-compose up -d
```

### Performance Optimization

**Backend:**
- Enable database connection pooling
- Add Redis caching for popular terms
- Implement pagination for large datasets

**Frontend:**
- Use React.memo for expensive components  
- Implement debouncing for search
- Add service worker for offline capability

**Database:**
- Add indexes on frequently queried columns
- Archive old translation history
- Use database views for complex queries

## 📊 Monitoring & Analytics

### Health Checks
All services include health checks:
- **Frontend**: HTTP 200 on port 3000
- **Backend**: /api/health endpoint
- **Database**: pg_isready command

### Logging
```bash
# Follow all logs
docker-compose logs -f

# Backend application logs
docker-compose logs -f backend | grep "com.genz.translator"

# Database query logs
docker-compose logs -f database | grep "LOG:"
```

### Metrics to Track
- Translation request volume
- Popular terms usage
- API response times  
- Database query performance
- User engagement patterns

## 🚀 Deployment

### Docker Hub Deployment
```bash
# Build and push images
docker build -t yourusername/genz-translator-frontend frontend/
docker build -t yourusername/genz-translator-backend backend/

docker push yourusername/genz-translator-frontend
docker push yourusername/genz-translator-backend
```

### Cloud Deployment (AWS/GCP/Azure)
1. Use managed database service (RDS/Cloud SQL)
2. Deploy containers to ECS/Kubernetes/Cloud Run
3. Set up load balancer and SSL termination
4. Configure environment-specific variables
5. Set up monitoring and alerting

## 📈 Future Enhancements

### Planned Features
- [ ] **User authentication** - save personal translation history
- [ ] **Admin dashboard** - manage terms and view analytics
- [ ] **Community features** - users can suggest new terms
- [ ] **Mobile app** - React Native version
- [ ] **Voice translation** - speech-to-text integration
- [ ] **Multi-language support** - translate to other languages
- [ ] **AI integration** - use OpenAI for context-aware translations
- [ ] **Browser extension** - translate Gen Z text on any website

### API Improvements
- [ ] Rate limiting and API keys
- [ ] GraphQL endpoint
- [ ] Webhook notifications for new terms
- [ ] Bulk translation endpoint
- [ ] Translation confidence scoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features  
- Update documentation
- Ensure Docker builds pass
- Test with real data

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yahyaasmara/genz-translator/issues)

## 🙏 Acknowledgments

- **Gen Z Community** - for creating such creative language expressions
- **Spring Boot Team** - for the amazing framework
- **React Team** - for the excellent frontend library
- **PostgreSQL** - for reliable data storage
- **Docker** - for containerization magic

---

**Built with ❤️ by developers who definitely needed this translator themselves! No cap! 🚀**
