
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
  - Photo upload capability
  - GPS location capture
  - Notes section
  - Auto-generated digital ticket
- Ability to send ticket via SMS or email
- Personal fine history tracking
- Mobile-responsive interface

### Admin Panel
- Comprehensive admin dashboard
- Manage traffic offense types and fine amounts
- Officer management 
  - List officers
  - Edit officer details
  - Monitor officer activities
- View and filter all issued fines
- Generate and export reports (CSV/PDF)
- System settings management
- Activity logs

### Driver Portal
- Easy access to fine details
- View complete fine information
- Secure online payment processing (ItaSend integration)
- Digital receipt generation
- QR code ticket access
- Mobile-friendly interface

## ⚙️ Tech Stack

- **Frontend**: 
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - React Query for data management
  - React Router for navigation

- **Backend**:
  - Supabase integration
  - Real-time database
  - Authentication
  - API management

- **Payment**:
  - ItaSend payment gateway
  - Secure transaction processing

- **UI/UX Features**:
  - Responsive design for all devices
  - Modern, intuitive interface
  - Real-time updates
  - Toast notifications
  - Form validations

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd finexpress

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development & Deployment

Built with Vite for fast development and optimized builds:

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

Tested and supported on latest versions of:
- Chrome
- Firefox
- Safari
- Edge

## Upcoming Features
- Enhanced officer management
- Advanced reporting
- More payment gateway integrations

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details.

## Contact

For support or inquiries, please contact [Your Contact Information]
