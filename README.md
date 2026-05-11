# Maritime Compliance System
A modern full-stack maritime compliance management platform for fleet operations, vessel maintenance, safety drills, and regulatory monitoring.

 Built for shipping companies and maritime operators to streamline:

* Vessel compliance tracking
* Maintenance management
* Safety drill scheduling
* Crew operations
* Risk monitoring
* Fleet dashboards

## Features
### Admin Dashboard
* Fleet-wide operational overview
* Compliance analytics
* Maintenance monitoring
* Upcoming & missed drill tracking
* High-risk vessel identification
* KPI dashboards & charts
### Crew Dashboard
* Assigned maintenance tasks
* Drill schedules
* Compliance status visibility
* Vessel-specific operations
### Maintenance Management
* Preventive maintenance tracking
* Overdue maintenance alerts
* Maintenance status workflows
* Ship-wise maintenance logs
### Safety Drill Management
* Drill scheduling
* Participation tracking
* Missed drill monitoring
* Compliance reporting
### Authentication & Authorization
* JWT-based authentication
* Role-based access control
* Admin & Crew permissions
### Modern UI
* Responsive dashboard
* Interactive charts
* Reusable component architecture

## Tech Stack
### Frontend
* React
* TypeScript
* Vite
* Tailwind CSS
* React Query
* Axios
* Recharts
* Lucide Icons
### Backend
* Spring Boot
* Java
* Spring Security
* JWT Authentication
* JPA / Hibernate
### Database
* PostgreSQL

## Project Structure
```
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   └── routes/

backend/
├── src/main/java/
├── src/main/resources/
└── pom.xml
```


## Getting Started
### Prerequisites

Make sure you have installed:

* Node.js (18+)
* Java 17+
* Maven
* PostgreSQL
* Docker

#### Frontend Setup

```
cd frontend

npm install

npm run dev
```

Frontend runs on:

http://localhost:5173


#### Backend Setup

Configure Database

Update:
```
src/main/resources/application.properties
```

Example:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/your_db_name
spring.datasource.username=postgres
spring.datasource.password=your_password
Run Backend
cd backend

mvn spring-boot:run
```


## API Endpoints
### Authentication
```
POST /api/auth/login
POST /api/auth/register
```
### Dashboard
```
GET /api/dashboard/admin
GET /api/dashboard/crew
```

### Maintenance
```
GET /api/maintenance
POST /api/maintenance
PUT /api/maintenance/{id}
```
### Drills
```
GET /api/drills
POST /api/drills
```
### Sample Admin Dashboard Response
```
{
  "success": true,
  "message": "Admin dashboard fetched",
  "data": {
    "totalShips": 1,
    "totalCrew": 1,
    "pendingMaintenanceCount": 1,
    "overdueMaintenanceCount": 0,
    "upcomingDrills": 1,
    "missedDrills": 0,
    "compliancePercentage": 40.0,
    "highRiskShips": [
      {
        "shipId": "uuid",
        "shipName": "MV Ocean Star",
        "overdueMaintenance": 0,
        "missedDrills": 0,
        "compliancePercentage": 40.0
      }
    ]
  }
}
```

## Working Screenshots

## Admin Dashboard
![Admin Dashboard](./screenshot/Admin%20Dashboard.png)
## Crew-User Dashboard
![Crew-User Dashboard](./screenshot/Crew-User%20Dashboard.png)
## Login Page
![Login Page](./screenshot/Login%20Page.png)
## Signup Page
![Signup Page](./screenshot/Signup%20Page.png)

#### Author
```
Sai Kiran Vakada
Developer
```
