# Bonnalai Frontend Structure & Documentation

## 📁 Directory Organization

```
frontend/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx              # Root layout (theme provider, navigator setup)
│   ├── modal.tsx                # Modal screen
│   └── (tabs)/                  # Tab group (creates native tab bar)
│       ├── _layout.tsx          # Tab configuration
│       ├── dashboard.tsx        # Main dashboard (shows docs, subjects, years)
│       ├── documents.tsx        # Redirect to dashboard
│       └── index.tsx            # Redirect to dashboard
├── assets/                       # Static images
│   └── images/                  # App icons, splash, logos
├── components/                   # Reusable React Native UI components
│   ├── themed-text.tsx          # Text with theme support (light/dark)
│   ├── themed-view.tsx          # View container with theme-aware background
│   ├── haptic-tab.tsx           # Tab button with haptic feedback
│   ├── parallax-scroll-view.tsx # Scrollable view with parallax header
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── summary-card.tsx     # Shows stat with icon (Documents: 5)
│   │   ├── entity-chip.tsx      # Inline tag/badge (Subject names, Years)
│   │   ├── document-card.tsx    # Document item with title, description, open button
│   │   └── section-header.tsx   # Section title with optional action button
│   └── ui/                      # Low-level icon components
│       ├── icon-symbol.tsx      # SF Symbols on iOS, Material Icons on Android
│       ├── icon-symbol.ios.tsx  # iOS-specific icon implementation
│       └── collapsible.tsx      # Expandable component
├── constants/                    # App-wide constants
│   └── theme.ts                 # Color palettes and fonts
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Get current light/dark mode
│   ├── use-color-scheme.web.ts  # Web-specific theme detection
│   └── use-theme-color.ts       # Get theme-aware color
├── lib/                          # Utility helpers
│   └── api.ts                   # API client and type definitions
├── scripts/                      # Build/dev scripts
│   └── reset-project.js         # Reset Expo project
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── expo-env.d.ts                 # Expo environment type definitions
├── eslint.config.js              # ESLint configuration
└── README.md                     # Main project README
```

---

## 🛣️ Routing (`app/`)

Uses **Expo Router** for file-based navigation (similar to Next.js).

### **Route Structure**

```
/                               → Root layout with theme provider
├── (tabs)                      → Tab group (creates native bottom tab bar)
│   ├── /dashboard (default)    → Main dashboard screen
│   ├── /documents             → Redirects to dashboard
│   └── /                       → Redirects to dashboard
└── /modal                      → Modal presentation screen
```

### **How Expo Router Works**

- `_layout.tsx` = wrapper/parent screen (applies theme, navigation)
- `(tabs)/` = route group that creates a **native tab bar**
- File names become routes: `dashboard.tsx` → `/dashboard` tab
- `index.tsx` redirects to `/dashboard` on app launch
- `[id].tsx` = dynamic routes (for future: `/documents/[id]`)

---

## 🎨 Components (`components/`)

Reusable UI building blocks organized by purpose.

### **1. Core Themed Components**

These provide theme-aware styling for the entire app:

#### `themed-text.tsx`
```typescript
<ThemedText type="title" lightColor="#000" darkColor="#fff">
  Hello
</ThemedText>
```
- **Props:** `type` ('default' | 'title' | 'subtitle' | 'link'), `lightColor`, `darkColor`
- **Usage:** Every text element that respects light/dark theme
- **Styles:** Handles font sizes, weights, line heights

#### `themed-view.tsx`
```typescript
<ThemedView lightColor="#fff" darkColor="#000">
  Content
</ThemedView>
```
- **Props:** `lightColor`, `darkColor`
- **Usage:** Background containers that adapt to theme

#### `haptic-tab.tsx`
- Tab buttons with vibration feedback
- Used by tab navigator for native feel

#### `parallax-scroll-view.tsx`
- Scrollable view with header that parallaxes on scroll
- Used for hero sections

### **2. Dashboard Components** ⭐ (New Backend-Connected)

These are purpose-built for the dashboard and connect to API data:

#### `dashboard/summary-card.tsx`
Summary statistic card with icon and count:
```typescript
<SummaryCard 
  icon="doc.text" 
  label="Documents" 
  value="12"
  accentColor="#0A7EA4" 
/>
```
- **Shows:** Icon + big number + label
- **Props:** `icon`, `label`, `value`, `accentColor`
- **Used for:** Document count, subject count, year count

#### `dashboard/entity-chip.tsx`
Inline tag/badge for subjects and years:
```typescript
<EntityChip 
  label="Mathematics" 
  meta="ID 5"
  tint="#7C3AED" 
/>
```
- **Shows:** Colored pill with name and optional metadata
- **Props:** `label`, `meta?`, `tint`
- **Used for:** Horizontal scrolling lists of subjects/years

#### `dashboard/document-card.tsx`
Full document preview card:
```typescript
<DocumentCard 
  document={doc}
  subjectLabel="Math"
  yearLabel="2024" 
/>
```
- **Shows:** Document icon + title + description + metadata + open button
- **Feature:** Taps "Open" to load file URL in browser
- **Props:** `document`, `subjectLabel?`, `yearLabel?`
- **Used for:** Recent documents list

#### `dashboard/section-header.tsx`
Section title with optional action:
```typescript
<SectionHeader 
  title="Latest documents"
  actionLabel="Reload"
  onPressAction={() => loadData()}
/>
```
- **Shows:** Title + optional right-aligned action button
- **Props:** `title`, `actionLabel?`, `onPressAction?`

### **3. Icon Components**

#### `ui/icon-symbol.tsx`
Universal icon component that uses:
- **iOS:** SF Symbols (Apple's native icons)
- **Android/Web:** Material Icons

```typescript
<IconSymbol name="house.fill" size={28} color="#0A7EA4" />
```

**Available icons:**
- `house.fill` → home
- `magnifyingglass` → search
- `book.fill` → menu-book
- `eye.fill` → visibility
- `heart.fill` → favorite
- `doc.text` → description
- `paperplane.fill` → send
- `chevron.right` → chevron-right

---

## 📡 API Layer (`lib/api.ts`)

**Purpose:** Bridge between frontend and NestJS backend

### **Type Definitions**

```typescript
DocumentRecord = {
  id?: number | string;
  title?: string;
  description?: string;
  subject_id?: number | string;
  year_id?: number | string;
  file_url?: string;
  [key: string]: any;
}

SubjectRecord = {
  id?: number | string;
  name?: string;
  title?: string;
  label?: string;
  [key: string]: any;
}

YearRecord = {
  id?: number | string;
  name?: string;
  title?: string;
  label?: string;
  year?: string | number;
  [key: string]: any;
}

DashboardResponse = {
  documents: DocumentRecord[];
  subjects: SubjectRecord[];
  years: YearRecord[];
}
```

### **API Functions**

| Function | HTTP Method | Endpoint | Returns |
|----------|-------------|----------|---------|
| `fetchDocuments()` | GET | `/documents` | `DocumentRecord[]` |
| `fetchSubjects()` | GET | `/subjects` | `SubjectRecord[]` |
| `fetchYears()` | GET | `/years` | `YearRecord[]` |
| `fetchDashboardData()` | GET (parallel) | `/documents`, `/subjects`, `/years` | `DashboardResponse` |
| `uploadDocument(formData)` | POST | `/documents/upload` | `{ message, document }` |
| `getRecordLabel(record, fallback)` | - | - | `string` |

### **Smart URL Handling**

The API base URL is automatically determined:

```typescript
// Android emulator (special IP to reach host)
API_BASE_URL = 'http://10.0.2.2:3000'

// Web / iOS simulator
API_BASE_URL = 'http://localhost:3000'

// Custom via environment variable
EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL
```

**Usage:**

```typescript
// In component
import { fetchDocuments, fetchDashboardData, API_BASE_URL } from '@/lib/api';

const data = await fetchDashboardData(); // Fetches all 3 lists in parallel
const docs = await fetchDocuments(); // Fetch documents only
```

---

## 🎨 Theme System

### **Color Palettes** (`constants/theme.ts`)

```typescript
Colors = {
  light: {
    text: '#11181C',              // Dark text
    background: '#fff',           // White background
    tint: '#0a7ea4',              // Primary blue
    icon: '#687076',              // Gray icons
    tabIconDefault: '#687076',    // Inactive tabs
    tabIconSelected: '#0a7ea4',   // Active tabs
  },
  dark: {
    text: '#ECEDEE',              // Light text
    background: '#151718',        // Dark background
    tint: '#fff',                 // White accent
    icon: '#9BA1A6',              // Light gray icons
    tabIconDefault: '#9BA1A6',    // Inactive tabs
    tabIconSelected: '#fff',      // Active tabs
  },
};

Fonts = {
  // Platform-specific fonts
  sans: 'system-ui' (iOS) | 'normal' (Android)
  serif: 'ui-serif' (iOS) | 'serif' (others)
  rounded: 'ui-rounded' (iOS) | 'normal' (others)
  mono: 'ui-monospace' (iOS) | 'monospace' (others)
}
```

### **Theme Hooks** (`hooks/`)

#### `useColorScheme()`
Get current light/dark mode:
```typescript
const colorScheme = useColorScheme(); // 'light' | 'dark'
```

#### `useThemeColor()`
Get theme-aware color:
```typescript
const color = useThemeColor(
  { light: '#000', dark: '#fff' },
  'text' // default color key
);
```

#### `useColorScheme.web.ts`
Web-specific theme detection (uses prefers-color-scheme).

---

## 🔄 Dashboard Flow

### **Main Screen: `DashboardScreen`** (`app/(tabs)/dashboard.tsx`)

```
┌─ User opens app
│
├─ [Mount] useEffect → loadData()
│  │
│  └─ fetchDashboardData() {
│      ├─ GET /documents
│      ├─ GET /subjects
│      └─ GET /years (parallel Promise.allSettled)
│     }
│
├─ [State Update] setData({ documents, subjects, years })
│
└─ [Render] Components update with live data:
    │
    ├─ Header & Search bar
    │
    ├─ Hero card (call-to-action)
    │
    ├─ 3x SummaryCards (doc count, subject count, year count)
    │
    ├─ ScrollView of EntityChips (subjects)
    │
    ├─ ScrollView of EntityChips (years)
    │
    └─ FlatList of DocumentCards (recent documents)
```

### **Key Features**

| Feature | Implementation |
|---------|-----------------|
| **Pull-to-refresh** | `<RefreshControl onRefresh={() => loadData(false)} />` |
| **Live search** | `searchQuery` state filters documents by title, subject, year |
| **Error handling** | Error card displays if API fails |
| **Loading state** | Shows spinner while `loading === true` |
| **Empty states** | "No documents found" message when list is empty |
| **Mapping** | `subjectMap` & `yearMap` for ID → Label translation |

### **State Management**

```typescript
const [data, setData] = useState<DashboardState>({
  documents: [],
  subjects: [],
  years: [],
});
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────┐
│  User Opens App                 │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  DashboardScreen mounts         │
│  useEffect(() => loadData())    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  fetchDashboardData()           │
│  Calls NestJS Backend:          │
│  - GET /documents              │
│  - GET /subjects               │
│  - GET /years                  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  NestJS Backend                 │
│  Queries Supabase:              │
│  - documents table              │
│  - subjects table               │
│  - years table                  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Response: {                    │
│    documents: [...],            │
│    subjects: [...],             │
│    years: [...]                 │
│  }                              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  setData(response)              │
│  State updates                  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Components Re-Render:          │
│  - SummaryCards show counts     │
│  - EntityChips show names       │
│  - DocumentCards show files     │
└─────────────────────────────────┘
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.33 | React Native framework |
| `expo-router` | ~6.0.23 | File-based routing |
| `react-native` | 0.81.5 | Core iOS/Android APIs |
| `@react-navigation/native` | ^7.1.8 | Navigation library |
| `@react-navigation/bottom-tabs` | ^7.4.0 | Bottom tab navigator |
| `@expo/vector-icons` | ^15.0.3 | Material Icons |
| `expo-symbols` | ~1.0.8 | SF Symbols (iOS) |
| `react` | 19.1.0 | React framework |
| `react-native-reanimated` | ~4.1.1 | Animations |
| `expo-haptics` | ~15.0.8 | Vibration feedback |

---

## ⚙️ TypeScript Configuration

### **Path Aliases** (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]  // Allows @/ imports
    }
  }
}
```

**Usage:**
```typescript
// Instead of:
import { api } from '../../../../../lib/api'

// Write:
import { api } from '@/lib/api'
```

**Common imports:**
```typescript
import { ImageSymbol } from '@/components/ui/icon-symbol'
import { SummaryCard } from '@/components/dashboard/summary-card'
import { fetchDocuments } from '@/lib/api'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
```

---

## 🚀 How to Run

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Expo CLI (optional, auto-installed with `npm start`)

### **Installation**

```bash
cd frontend

# Install dependencies
npm install
```

### **Development**

```bash
# Interactive menu (choose platform)
npm start

# Then select:
# - w for web
# - i for iOS
# - a for Android
# - j for ESLint fix
```

### **Platform-Specific**

```bash
# Web (browser)
npm run web

# iOS (requires macOS)
npm run ios

# Android (requires Android Studio/emulator)
npm run android

# Linting
npm run lint
```

### **Environment Variables**

Create `.env.local` or `.env`:
```
EXPO_PUBLIC_API_URL=http://your-backend-ip:3000
```

If not set, defaults to:
- Android: `http://10.0.2.2:3000`
- Web/iOS: `http://localhost:3000`

---

## 📱 What You See

### **Dashboard Tab (Home)**
- ✅ Fetches documents, subjects, years from backend
- ✅ Shows 3 summary cards (counts)
- ✅ Shows scrollable subject chips
- ✅ Shows scrollable year chips
- ✅ Shows recent documents as cards
- ✅ Search bar filters across all fields
- ✅ Pull-to-refresh reloads data
- ✅ Error card if API fails
- ✅ Loading spinner while fetching

### **Documents Tab**
- Currently redirects to Dashboard
- Ready for custom documents page

### **Modal Screen**
- Available for presentational content (not in tab bar)

---

## 🔧 Build Configuration

### **Expo Config** (`app.json`)

```json
{
  "expo": {
    "name": "frontend",
    "version": "1.0.0",
    "orientation": "portrait",
    "plugins": ["expo-router", "expo-splash-screen"],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "ios/android": { /* native config */ }
  }
}
```

- **`typedRoutes`**: Type-safe navigation links
- **`reactCompiler`**: React Server Components optimization

---

## 📋 Component Usage Examples

### **Using the Dashboard**

```typescript
import { DashboardScreen } from '@/app/(tabs)/dashboard';

// Already the main tab, just run the app
npm run start
```

### **Adding a Custom Component**

```typescript
// components/custom/my-component.tsx
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function MyComponent() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: palette.text }]}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  text: { fontSize: 16, fontWeight: '600' },
});
```

### **Fetching Backend Data**

```typescript
import { useEffect, useState } from 'react';
import { fetchDocuments, type DocumentRecord } from '@/lib/api';

export function MyScreen() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetchDocuments();
      setDocuments(data);
    })();
  }, []);

  return (
    // Render documents
  );
}
```

---

## 🐛 Debugging

### **React Native Debugger**
```bash
npm start
# Press 'j' to open debugger in browser
```

### **Network Requests**
- Check API URL with: `console.log(API_BASE_URL)`
- Use `fetch` DevTools to inspect requests

### **Theme Issues**
- Use `useColorScheme()` for current scheme
- Test both light/dark by toggling system settings

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

---

## ✅ Next Steps

- [ ] Add document upload screen
- [ ] Add subjects management screen
- [ ] Add years management screen
- [ ] Implement document filtering by subject/year
- [ ] Add user authentication
- [ ] Implement offline caching
- [ ] Add push notifications

---

**Happy coding! 🚀**

