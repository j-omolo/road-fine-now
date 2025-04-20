
# FineXpress - Web-Based Roadside Fine Collection System

## Overview

FineXpress is a mobile-friendly web application designed to assist traffic enforcement officers in issuing, managing, and collecting road traffic fines directly on the road. The system streamlines the process of ticketing offenders, ensures transparency, and enables digital payment of fines by drivers via a secure online portal.

## Target Users

- **Traffic Officers**: Issue fines in real-time from the roadside
- **Drivers/Civilians**: View and pay fines online
- **Admins/Supervisors**: Monitor activities, generate reports, and manage system settings

## 🎯 Key Features

### Officer Panel
- Secure officer login
- Real-time fine issuance with:
  - License plate input
  - Traffic offense selection with auto-calculated amounts
  - Notes section
  - Auto-generated digital ticket
- Personal fine history tracking
- Mobile-responsive interface

### Admin Panel
- Comprehensive admin dashboard
- Manage traffic offense types and fine amounts
- View and filter all issued fines
- Generate and export reports
- Monitor officer activities
- System settings management

### Driver Portal
- Easy access to fine details
- View complete fine information
- Secure online payment processing
- Digital receipt generation
- Mobile-friendly interface

## ⚙️ Tech Stack

- **Frontend**: 
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - React Query for data management
  - React Router for navigation

- **UI/UX Features**:
  - Responsive design for all devices
  - Modern, intuitive interface
  - Real-time updates
  - Toast notifications
  - Form validations

## Getting Started

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server
npm run dev
```

## Development & Deployment

This project is built using Vite for fast development and optimized production builds. To deploy:

```sh
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Browser Support

The application is tested and supported on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

To contribute to this project:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

