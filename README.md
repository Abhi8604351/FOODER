# FoodFlex Pro - Advanced MEAN Stack Delivery System

FoodFlex Pro is a production-ready, highly scalable food delivery platform built with MongoDB, Express, Angular 17, and Node.js.

## ✨ Advanced Features

### 🚀 Backend (Production-Grade)
- **Service Layer Architecture**: Clean separation of concerns between Controllers, Services, and Models.
- **Security Hardened**: 
  - `Helmet` for secure headers.
  - `Express-Rate-Limit` for DDoS protection.
  - `Mongo-Sanitize` & `XSS-Clean` for input protection.
- **Performance**: 
  - Advanced Pagination, Filtering, and Sorting.
  - Text search indexing for dishes.
- **Analytics Engine**: Real-time revenue calculation and monthly stats aggregation.
- **Winston Logger**: Professional logging with rotation and stream support.

### 🎨 Frontend (Modern UI/UX)
- **Angular 17 Standalone**: Performance-optimized architecture.
- **Reactive UI**: Debounced search and dynamic filtering.
- **Notifications**: Global toast system for real-time feedback.
- **UX Polishing**: Skeleton loaders, global progress bars, and premium animations (`animate.css`).
- **Clean Styling**: Custom CSS variables with a modular design system.

## 🛠 Tech Stack
- **Database**: MongoDB (Mongoose)
- **Backend**: Node.js, Express.js
- **Frontend**: Angular 17 (Standalone), RxJS, Tailwind/CSS
- **DevOps**: Docker, Docker Compose

## 📦 Installation & Setup

### Local Setup
1. **Clone the project**
2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Docker Deployment
Run the entire stack with a single command:
```bash
docker-compose up --build
```

## 🔐 Credentials
- **Admin**: `admin@example.com` / `admin123`
- **User**: Register a new account on the shop.

## 📁 File Structure
- `/backend`: Node.js server with Service layer.
- `/frontend`: Angular 17 SPA.
- `docker-compose.yml`: Full stack orchestration.

---
Developed ❤️ by ABHISHEK SINGH
