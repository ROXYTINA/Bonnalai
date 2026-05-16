# 📚 Bonnalai

A comprehensive educational document management system built with a modern tech stack. Bonnalai enables seamless organization, distribution, and access to educational resources across multiple platforms.

---

## 🎯 Project Overview

Bonnalai is a **monorepo** containing three interconnected applications:
- **Backend API** (NestJS) - Core server handling business logic
- **Web Frontend** (React) - Desktop/web access to resources
- **Mobile App** (React Native / Expo) - Native iOS and Android support

This architecture ensures consistent data across all platforms with a single, powerful backend API.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **NestJS** | Progressive Node.js framework for scalable APIs |
| **TypeScript** | Type-safe development |
| **Supabase** | PostgreSQL database + real-time features + file storage |
| **TypeORM** | Object-relational mapping for databases |
| **Mongoose** | MongoDB integration |
| **Multer** | File upload handling |
| **class-validator** | DTO validation |
| **Dotenv** | Environment variable management |

### Frontend (Web)
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Expo Web** | Web runtime |
| **React Navigation** | Navigation management |
| **Custom Hooks** | State management |

### Mobile (React Native)
| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform mobile development |
| **Expo 54** | Development platform & runtime |
| **Expo Router** | File-based routing |
| **React Navigation** | Bottom tab navigation |
| **React Native Reanimated** | Smooth animations |
| **Expo Vector Icons** | Icon library |

---

## 📂 Project Structure

```
Bonnalai/
│
├── 📦 backend/                          # NestJS API Server
│   ├── src/
│   │   ├── main.ts                      # Application entry point
│   │   ├── app.module.ts                # Root module with imports
│   │   ├── app.controller.ts            # Health check & root routes
│   │   ├── app.service.ts               # Root service
│   │   ├── supabase.ts                  # Supabase client initialization
│   │   │
│   │   ├── 📂 documents/                # Document management
│   │   │   ├── documents.controller.ts  # File upload/download endpoints
│   │   │   ├── documents.service.ts     # Upload, retrieve, delete logic
│   │   │   └── documents.module.ts      # Module configuration
│   │   │
│   │   ├── 📂 subjects/                 # Subject management
│   │   │   ├── subjects.controller.ts
│   │   │   ├── subjects.service.ts
│   │   │   └── subjects.module.ts
│   │   │
│   │   ├── 📂 years/                    # Academic years management
│   │   │   ├── years.controller.ts
│   │   │   ├── years.service.ts
│   │   │   └── years.module.ts
│   │   │
│   │   ├── 📂 supabase/                 # Supabase integration
│   │   │   ├── supabase.module.ts
│   │   │   └── supabase.service.ts      # Supabase provider
│   │   │
│   │   └── 📂 test/                     # Test endpoints
│   │       ├── test.controller.ts
│   │       └── test.service.ts
│   │
│   ├── lib/
│   │   └── supabaseServer.ts            # Server-side utilities
│   │
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 🌐 frontend/                         # React Web Application
│   ├── app/
│   │   ├── _layout.tsx                  # Root layout wrapper
│   │   ├── modal.tsx                    # Modal screen
│   │   └── (tabs)/                      # Tab-based navigation
│   │       ├── _layout.tsx              # Tab layout configuration
│   │       └── index.tsx                # Home/main tab screen
│   │
│   ├── components/
│   │   ├── themed-text.tsx              # Themed text component
│   │   ├── themed-view.tsx              # Themed container
│   │   ├── parallax-scroll-view.tsx     # Scroll view with parallax
│   │   ├── hello-wave.tsx               # Greeting component
│   │   ├── haptic-tab.tsx               # Interactive tab with haptics
│   │   ├── external-link.tsx            # External link handler
│   │   └── ui/
│   │       ├── collapsible.tsx          # Expandable component
│   │       ├── icon-symbol.tsx          # Icon rendering
│   │       └── icon-symbol.ios.tsx      # iOS-specific icons
│   │
│   ├── constants/
│   │   └── theme.ts                     # Theme colors & styling
│   │
│   ├── hooks/
│   │   ├── use-color-scheme.ts          # Color scheme detection
│   │   ├── use-color-scheme.web.ts      # Web-specific color scheme
│   │   └── use-theme-color.ts           # Theme color hook
│   │
│   ├── assets/images/                   # App icons & splash screens
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 📱 mobile/                           # Same as frontend (Expo handles)
│   └── (same structure as frontend/)
│
├── package.json                         # Monorepo root configuration
└── README.md                            # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn**
- Supabase account with credentials
- `.env` file configured in backend/

### Setup Instructions

1. **Clone and Install**
   ```bash
   cd Bonnalai
   npm install
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file:
   ```env
   PORT=3000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running Applications

**Backend (Development)**
```bash
cd backend
npm run start:dev
```
→ Runs on http://localhost:3000

**Frontend (Web)**
```bash
cd frontend
npm run web
```

**Mobile (iOS)**
```bash
cd frontend
npm run ios
```

**Mobile (Android)**
```bash
cd frontend
npm run android
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/test` | Retrieve test data |
| `POST` | `/test` | Create test entry |
| `GET` | `/documents` | List all documents |
| `POST` | `/documents` | Upload new document |
| `GET` | `/subjects` | List all subjects |
| `POST` | `/subjects` | Create subject |
| `GET` | `/years` | List academic years |
| `POST` | `/years` | Create academic year |

---

## 📊 Module Architecture

### Backend Modules

```
AppModule (Root)
├── SupabaseModule
│   └── SupabaseService (provides Supabase client)
├── DocumentsModule
│   ├── DocumentsController
│   └── DocumentsService
├── SubjectsModule
│   ├── SubjectsController
│   └── SubjectsService
├── YearsModule
│   ├── YearsController
│   └── YearsService
└── TestModule
    ├── TestController
    └── TestService
```

---

## 🧪 Testing

**Unit Tests**
```bash
cd backend
npm run test
```

**Watch Mode**
```bash
cd backend
npm run test:watch
```

**E2E Tests**
```bash
cd backend
npm run test:e2e
```

**Coverage Report**
```bash
cd backend
npm run test:cov
```

---

## 📝 Available Scripts

### Backend
```bash
npm run build           # Build for production
npm run start           # Start production server
npm run start:dev       # Development with hot reload
npm run start:debug     # Debug mode
npm run start:prod      # Run compiled production build
npm run lint            # Lint and fix code
npm run format          # Format code with Prettier
npm run test            # Run tests
npm run test:e2e        # End-to-end tests
```

### Frontend
```bash
npm run start          # Start Expo dev server
npm run web            # Run web version
npm run ios            # Run iOS app
npm run android        # Run Android app
npm run lint           # Lint code
npm run reset-project  # Reset to default state
```

---

## 🎨 Features

✅ **Multi-platform Support** - Web, iOS, Android  
✅ **Real-time Updates** - Supabase integration  
✅ **File Management** - Upload and manage documents  
✅ **Organized Structure** - Subjects and academic years  
✅ **Type Safety** - Full TypeScript support  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Dark Mode** - Theme support built-in  

---

## 🔐 Security

- Environment variables for sensitive credentials
- Supabase Row-Level Security (RLS)
- File upload validation
- TypeScript for compile-time type checking
- Input validation with class-validator

---

## 📚 Documentation

- [NestJS Docs](https://docs.nestjs.com/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)

---

## 📄 License

UNLICENSED - Proprietary project

---

## 👥 Development Team

Developed as a full-stack educational platform.

---

**Last Updated:** May 14, 2026

