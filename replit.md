# Video Streaming Platform - Adult Content Monetization

## Overview

This is a full-stack video streaming platform designed specifically for adult content monetization, built with React, Express.js, TypeScript, and PostgreSQL. The application serves as a video hosting platform with integrated advertising systems optimized for adult content creators in the Indian market.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store
- **File Upload**: Multer for handling video uploads (100MB limit)

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Tables**:
  - `users`: Admin authentication and user management
  - `videos`: Video metadata with external URL references
  - `ads`: Advertisement content and tracking
  - `adViews`: Revenue tracking and analytics

## Key Components

### Video Management System
- External video hosting integration (videos stored externally, metadata in database)
- Support for thumbnails, categories, tags, and duration tracking
- View counting and trending algorithm based on view metrics
- Admin panel for video CRUD operations

### Advertisement System
- Multiple ad types: banner, sidebar, midcontent, preroll
- Click and impression tracking with revenue calculation
- Integration with adult content ad networks (ExoClick, TrafficJunky, etc.)
- Real-time revenue dashboard with CPM optimization

### Authentication & Authorization
- Admin-only authentication system
- Environment-based credential configuration
- Session-based authentication with secure cookie management

### Content Organization
- Category-based video organization (Premium, Amateur, Professional, etc.)
- Search functionality across video titles and descriptions
- Trending videos based on view count and recency
- Featured video highlighting system

## Data Flow

### Video Upload Flow
1. Admin uploads video metadata through admin panel
2. External video URL and thumbnail are stored in database
3. Video is categorized and tagged for discovery
4. Thumbnail and metadata are immediately available for display

### Revenue Generation Flow
1. Ads are loaded based on placement type (banner, sidebar, etc.)
2. Impression tracking occurs when ad components mount
3. Click tracking happens on user interaction
4. Revenue is calculated and stored per ad view
5. Dashboard displays real-time revenue analytics

### User Experience Flow
1. Videos are displayed in grid layout with thumbnails
2. Clicking video redirects to external video host
3. Related videos are suggested based on category
4. Ads are strategically placed throughout the interface

## External Dependencies

### Video Hosting
- External video hosting services for actual video files
- Platform stores only metadata and external URLs
- Supports any video hosting provider via URL integration

### Ad Networks
- **ExoClick**: Primary ad network for adult content (India-focused)
- **TrafficJunky**: Premium adult advertising network
- **JuicyAds**: Adult-focused advertising platform
- Custom ad integration for direct advertiser relationships

### Database Infrastructure
- **Neon**: Serverless PostgreSQL hosting
- WebSocket support for real-time features
- Connection pooling for optimal performance

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon system

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for rapid development
- TypeScript compilation with strict mode enabled
- Drizzle Kit for database schema management and migrations

### Production Build
- Vite production build with code splitting and optimization
- ESBuild for server-side TypeScript compilation
- Static asset optimization and compression

### Environment Configuration
- Environment variables for video content management
- Secure admin credential configuration
- Database connection string management
- Ad network API integration keys

### Platform Deployment
- **Primary**: Render.com deployment with automatic GitHub integration
- **Alternative**: Vercel, Netlify, or other Node.js hosting platforms
- PostgreSQL database provisioning through Neon or similar providers

## Changelog

- June 29, 2025: Initial setup
- June 29, 2025: Complete transformation to professional adult content platform with admin dashboard, category management, and monetization systems
- July 2, 2025: Fixed critical authentication issues - admin dashboard now properly protected, removed upload functionality for regular users, implemented session-based authentication with proper cookie handling

## User Preferences

Preferred communication style: Simple, everyday language.

## Authentication System

- Admin access requires ADMIN_USERNAME and ADMIN_PASSWORD environment variables
- Session-based authentication with secure cookie handling
- Admin dashboard completely protected - requires login to access
- Upload functionality removed - platform only uses external video URLs
- Header shows appropriate buttons based on authentication status