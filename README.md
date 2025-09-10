# Tilli Assessment App

A Next.js application for teachers to manage student assessment rubrics with photo scanning and manual entry capabilities. Built with a mobile-first responsive design.

## Features

- **Photo Upload & AI Scanning**: Upload multiple photos of rubric sheets for automatic processing
- **Manual Entry**: Enter student assessment data manually using a structured form
- **Student Cards**: View all assessments with individual student performance cards
- **Mobile Authentication**: Appwrite-based mobile authentication for teachers
- **Mobile-First Design**: Fully responsive interface optimized for mobile devices
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Internationalization**: Full Arabic and English language support with RTL layout

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS (Mobile-first responsive design)
- **Backend**: Appwrite (Database, Authentication, Storage)
- **UI Components**: Lucide React icons
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: React Dropzone
- **Internationalization**: react-i18next with Arabic and English support

## Project Structure

```
tilli-assessment-1/
├── src/                          # Source code directory
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes
│   │   │   └── student-assessment-rubric-scanning/
│   │   │       └── route.ts      # Photo processing endpoint
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── upload-photos/        # Photo upload page
│   │   │   └── page.tsx
│   │   ├── manual-entry/         # Manual entry page
│   │   │   └── page.tsx
│   │   └── view-assessments/     # View assessments page
│   │       └── page.tsx
│   ├── components/               # React components
│   │   ├── AuthProvider.tsx      # Authentication context
│   │   ├── LoginForm.tsx         # Mobile authentication form
│   │   ├── ProtectedRoute.tsx    # Route protection
│   │   ├── StarRating.tsx        # Star rating component
│   │   └── LanguageSwitcher.tsx  # Language switcher component
│   ├── lib/                      # Utility libraries
│   │   ├── appwrite.ts           # Appwrite client configuration
│   │   ├── auth.ts               # Authentication utilities
│   │   ├── utils.ts              # Utility functions
│   │   ├── emoji-assignment.ts   # Emoji assignment utilities
│   │   └── i18n.ts               # Internationalization configuration
│   ├── locales/                  # Translation files
│   │   ├── en.json               # English translations
│   │   └── ar.json               # Arabic translations
│   └── types/                    # TypeScript type definitions
│       └── index.ts
├── public/                       # Static assets
│   └── images/                   # Image assets
│       ├── logo/                 # App and company logos
│       ├── mascot/               # Mascot images
│       └── icons/                # App icons
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tilli-assessment-1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Appwrite**

   Update `lib/appwrite.ts` with your Appwrite credentials:

   ```typescript
   const client = new Client()
     .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
     .setProject("your-project-id"); // Your project ID
   ```

4. **Set up Appwrite Database**

   Create the following collections in your Appwrite project:

   - **assessments** collection with attributes:
     - `teacherName` (string, required)
     - `school` (string, required)
     - `grade` (string, required)
     - `date` (string, required)
     - `students` (string, required) - JSON array
     - `isManualEntry` (boolean, required)
     - `createdAt` (datetime)
     - `updatedAt` (datetime)

5. **Enable Anonymous Authentication**

   In your Appwrite project:

   - Go to Auth > Settings
   - Enable Anonymous authentication

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Internationalization (i18n)

The application supports multiple languages with full RTL (Right-to-Left) support for Arabic:

### Supported Languages

- **English (en)**: Default language with LTR layout
- **Arabic (ar)**: Full RTL support with Arabic fonts

### Language Features

- **Language Switcher**: Globe icon in the navbar to switch between languages
- **RTL Support**: Automatic layout direction switching for Arabic
- **Arabic Fonts**: Noto Sans Arabic font for proper Arabic text rendering
- **Persistent Language**: Language preference saved in localStorage
- **Dynamic Content**: All text content dynamically translated

### Translation Structure

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error"
  },
  "login": {
    "title": "Hello teacher! 👋",
    "teacherName": "Teacher Name"
  },
  "dashboard": {
    "title": "Assessment Dashboard",
    "subtitle": "Choose how you'd like to create student assessments"
  }
}
```

### Adding New Languages

1. Create a new translation file in `src/locales/`
2. Add the language to the `LanguageSwitcher` component
3. Update the i18n configuration in `src/lib/i18n.ts`

## Mobile-First Design

The application is built with a mobile-first responsive design approach:

### Responsive Breakpoints

- **Mobile**: Default (320px+)
- **Small**: `sm:` (640px+)
- **Medium**: `md:` (768px+)
- **Large**: `lg:` (1024px+)

### Mobile Optimizations

- Touch-friendly buttons and inputs
- Optimized spacing and typography for mobile screens
- Responsive grids that stack on mobile
- Mobile-optimized navigation
- Touch-friendly file upload interface

### Key Mobile Features

- **Responsive Navigation**: Collapsible header with mobile-friendly buttons
- **Touch-Friendly Forms**: Larger touch targets and optimized input fields
- **Mobile Photo Upload**: Drag & drop optimized for mobile devices
- **Responsive Cards**: Student assessment cards that adapt to screen size
- **Simple Authentication**: One-click anonymous authentication

## Authentication

### Simple Authentication Flow

1. **Get Started**: User clicks the "Get Started" button
2. **Anonymous Session**: Appwrite creates an anonymous session
3. **Session Creation**: User is authenticated and redirected to dashboard

### Authentication Components

- **AuthProvider**: Manages authentication state across the app
- **LoginForm**: Simple authentication form with single button
- **ProtectedRoute**: Protects routes from unauthenticated access

### Authentication States

- **Loading**: Checking authentication status
- **Unauthenticated**: Show login form
- **Authenticated**: Show protected content

## Usage

### Authentication

- Simple one-click authentication
- No phone number or SMS required
- Anonymous sessions for easy access

### Photo Upload

1. Navigate to "Upload Photos"
2. Fill in teacher information
3. Drag & drop or select photos of rubric sheets
4. Submit for AI processing
5. Review and save results

### Manual Entry

1. Navigate to "Manual Entry"
2. Fill in teacher information
3. Add students and rate each criterion
4. Save assessment data

### View Assessments

- View all saved assessments
- See individual student performance cards
- Filter by teacher, school, or date

## API Endpoints

### POST /api/student-assessment-rubric-scanning

Processes uploaded photos and returns structured student data.

**Request:**

- `FormData` with teacher info and photos

**Response:**

```typescript
{
  teacherName: string;
  school: string;
  grade: string;
  date: string;
  students: Student[];
}
```

## Data Models

### Student

```typescript
interface Student {
  studentName: string;
  q1Answer: string; // Self Awareness - Basic emotions
  q2Answer: string; // Self Awareness - Preferences
  q3Answer: string; // Self Awareness - Strengths/weaknesses
  q4Answer: string; // Self Management - Difficult emotions
  q5Answer: string; // Self Management - Recognize others' emotions
  q6Answer: string; // Self Management - Conflict resolution
  q7Answer: string; // Self Management - Impulse control
}
```

### Assessment Record

```typescript
interface AssessmentRecord {
  $id?: string;
  teacherName: string;
  school: string;
  grade: string;
  date: string;
  students: Student[];
  isManualEntry: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Auth User

```typescript
interface AuthUser {
  $id: string;
  name?: string;
  phone?: string;
  email?: string;
}
```

## Rating System

- **1 - Beginner**: Student is just starting to develop this skill
- **2 - Growing**: Student shows some proficiency but needs improvement
- **3 - Expert**: Student demonstrates mastery of this skill

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=your-appwrite-endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

### Mobile Development

The application is optimized for mobile development:

1. **Responsive Testing**: Test on various screen sizes
2. **Touch Interactions**: Ensure all interactions work on touch devices
3. **Performance**: Optimize for mobile network conditions
4. **Accessibility**: Ensure mobile accessibility standards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
