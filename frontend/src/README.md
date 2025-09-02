# Fitness Tracker Frontend

A modern React TypeScript application for tracking workouts and fitness progress.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Layout)
│   ├── navigation/     # Navigation components (ProtectedRoute)
│   └── ui/             # Base UI components (Button, Input, LoadingSpinner)
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard with stats and recent workouts
│   ├── Login.tsx       # Login page with authentication
│   ├── WorkoutLog.tsx  # Workout history with filtering and pagination
│   ├── ExerciseLibrary.tsx # Browse and search exercises
│   ├── Templates.tsx   # Workout templates management
│   └── Settings.tsx    # User settings and preferences
├── services/           # API services
│   ├── api.ts         # Base API service with axios configuration
│   ├── authService.ts # Authentication related API calls
│   ├── workoutService.ts # Workout management API calls
│   └── exerciseService.ts # Exercise library API calls
├── hooks/              # Custom React hooks
│   ├── useAuth.ts     # Authentication state management
│   ├── useWorkouts.ts # Workout data management
│   ├── useExercises.ts # Exercise data management
│   ├── useLocalStorage.ts # Local storage helper
│   └── useDebounce.ts # Debounced values for search
├── types/              # TypeScript type definitions
│   └── index.ts       # All application types and interfaces
├── utils/              # Utility functions
│   ├── formatters.ts  # Date, duration, weight formatting
│   ├── validators.ts  # Form and data validation
│   ├── helpers.ts     # General helper functions
│   └── constants.ts   # Application constants
├── routes/             # Routing configuration
│   └── AppRoutes.tsx  # Main routing setup with protected routes
└── App.tsx            # Main application component
```

## Key Features

### Authentication
- JWT-based authentication
- Protected routes
- Automatic token refresh
- Login/logout functionality

### Workout Management
- Create, edit, and delete workouts
- Track exercises, sets, reps, and weights
- Workout templates for quick setup
- Filtering and search capabilities

### Exercise Library
- Browse comprehensive exercise database
- Filter by category, muscle group, and equipment
- Search functionality
- Exercise details with instructions and videos

### Dashboard
- Overview of recent workouts
- Performance statistics
- Quick action buttons
- Progress tracking

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Accessible components
- Custom UI components

## Technology Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## API Integration

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

### Workouts
- `GET /workouts` - Get user workouts (with pagination and filters)
- `POST /workouts` - Create new workout
- `GET /workouts/:id` - Get specific workout
- `PUT /workouts/:id` - Update workout
- `DELETE /workouts/:id` - Delete workout
- `GET /workouts/stats` - Get workout statistics

### Exercises
- `GET /exercises` - Get exercises (with pagination and filters)
- `GET /exercises/:id` - Get specific exercise
- `GET /exercises/categories` - Get exercise categories
- `GET /exercises/muscle-groups` - Get muscle groups
- `GET /exercises/equipment` - Get equipment types
- `GET /exercises/search` - Search exercises

### Templates
- `GET /templates` - Get workout templates
- `POST /templates` - Create template
- `GET /templates/:id` - Get specific template
- `PUT /templates/:id` - Update template
- `DELETE /templates/:id` - Delete template
- `POST /templates/:id/create-workout` - Create workout from template

## Component Usage Examples

### Using Custom Hooks

```tsx
import { useWorkouts } from '../hooks';

function WorkoutList() {
  const { workouts, loading, error, loadWorkouts } = useWorkouts();
  
  // Component logic here
}
```

### Using UI Components

```tsx
import { Button, Input, LoadingSpinner } from '../components/ui';

function MyForm() {
  return (
    <form>
      <Input
        label="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={nameError}
      />
      <Button
        variant="primary"
        loading={isSubmitting}
        onClick={handleSubmit}
      >
        Save Workout
      </Button>
    </form>
  );
}
```

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Performance Optimizations

- Code splitting with React.lazy
- Debounced search inputs
- Pagination for large datasets
- Optimized re-renders with React.memo
- Efficient state management
- Image optimization

## Development Guidelines

1. **TypeScript**: All components should be fully typed
2. **Responsive**: Design mobile-first with Tailwind breakpoints
3. **Accessibility**: Follow WCAG 2.1 AA guidelines
4. **Testing**: Write unit tests for utility functions
5. **Error Handling**: Implement proper error boundaries and user feedback
6. **Performance**: Use React DevTools Profiler to identify bottlenecks