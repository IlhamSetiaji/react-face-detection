# Face Detection Frontend

A modern React TypeScript application for testing face detection API capabilities. Built with Vite, React Bootstrap, and Bun.

## Features

- 🔍 **Face Detection**: Upload images and detect faces using a backend API
- � **Camera Detection**: Real-time face detection using your device camera with automatic confidence adjustment
- �📊 **Real-time Results**: View detailed detection results including confidence scores, bounding boxes, and face landmarks
- 🖼️ **Image Annotation**: Generate and download annotated images with face detection overlays
- 🤖 **Auto-Confidence**: Intelligent confidence level adjustment for optimal detection results
- 📱 **Responsive Design**: Modern Bootstrap-based UI that works on all devices
- ⚡ **Fast Development**: Built with Vite for lightning-fast development experience
- 🎯 **TypeScript**: Full type safety and excellent developer experience
- 🎨 **Modern UI**: Clean, professional interface with Bootstrap 5 and Bootstrap Icons
- 🚀 **Navigation**: Multi-page application with React Router

## Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Bun** - Fast package manager and runtime
- **Bootstrap 5** - Modern CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Bootstrap Icons** - Comprehensive icon library
- **React Router** - Client-side routing and navigation

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ActionButtons.tsx      # Detection action buttons
│   ├── AnnotatedImage.tsx     # Annotated image display
│   ├── CameraView.tsx         # Camera interface component
│   ├── CapturedImage.tsx      # Captured image display
│   ├── ConfidenceSlider.tsx   # Confidence threshold control
│   ├── DetectionResults.tsx   # Results display
│   ├── ErrorAlert.tsx         # Error handling UI
│   ├── ImageUpload.tsx        # File upload component
│   ├── Navigation.tsx         # Navigation bar
│   ├── ServerStatus.tsx       # Server status indicator
│   └── index.ts              # Component exports
├── hooks/               # Custom React hooks
│   ├── useCamera.ts          # Camera functionality with auto-confidence
│   └── useFaceDetection.ts   # Main business logic
├── pages/               # Application pages
│   ├── CameraPage.tsx        # Camera detection page
│   ├── UploadPage.tsx        # Image upload page
│   └── index.ts              # Page exports
├── services/            # External API communication
│   ├── apiService.ts         # Face detection API client
│   └── cameraService.ts      # Camera access and control
├── types/               # TypeScript definitions
│   └── index.ts              # All type definitions
├── App.tsx             # Main application with routing
├── main.tsx            # Application entry point
├── App.css             # Component-specific styles
└── index.css           # Global styles
```
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── App.css              # Component styles
└── index.css            # Global styles
```

## Prerequisites

- [Bun](https://bun.sh/) - Fast package manager
- A face detection API server running on `http://localhost:5000`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd face-detection-fe
```

2. Install dependencies:
```bash
bun install
```

## Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
bun run build
```

Preview the production build:
```bash
bun run preview
```

## API Requirements

The application expects a backend API with the following endpoints:

### Health Check
- **GET** `/health`
- Returns: `{ "status": "healthy" }`

### Face Detection
- **POST** `/detect`
- Body: FormData with `image` (file) and `confidence` (number)
- Returns: JSON with detection results

### Face Detection with Annotation
- **POST** `/detect-and-annotate`
- Body: FormData with `image` (file) and `confidence` (number)
- Returns: Annotated image as blob

## Features Overview

### Upload Image Detection
- Manual file selection with preview
- Adjustable confidence threshold (0.1 - 1.0)
- JSON detection results
- Annotated image generation

### Camera Detection
- Real-time camera access
- Automatic confidence adjustment (0.1 - 0.7)
- Smart detection strategy:
  1. Starts with confidence 0.5
  2. If no faces found, tries lower values (0.3, 0.2, 0.1)
  3. If still no faces, tries higher confidence (0.7)
  4. Returns best result from 5 attempts
- Live video preview
- Instant capture and detection
- Mobile-friendly camera interface

### Server Status Monitoring
- Real-time server health checking
- Visual indicators for online/offline status
- Manual refresh capability

### Detection Results
- Processing time metrics
- Image dimensions
- Face count and details
- Bounding box coordinates
- Confidence scores
- Facial landmarks detection status

### Navigation
- Clean navigation between upload and camera modes
- Responsive navigation bar
- Bootstrap-styled interface

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
