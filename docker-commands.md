# Development
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose logs -f backend          # Follow backend logs
docker-compose exec database psql -U genz_user -d genz_translator  # Connect to DB

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Useful commands
docker-compose ps                       # See running services
docker-compose restart backend          # Restart specific service
docker-compose build --no-cache backend # Rebuild service without cache
docker system prune -a                 # Clean up unused images/containers

# Database operations
docker-compose exec database pg_dump -U genz_user genz_translator > backup.sql
docker-compose exec -T database psql -U genz_user -d genz_translator < backup.sql