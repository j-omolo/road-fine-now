
// Mock data for the FineXpress application

// Offense types with corresponding fine amounts
export interface TrafficOffense {
  id: string;
  code: string;
  description: string;
  amount: number;
  category: 'Minor' | 'Major' | 'Critical';
}

export const trafficOffenses: TrafficOffense[] = [
  {
    id: "off-001",
    code: "SPD-01",
    description: "Speeding (10-20 km/h over limit)",
    amount: 5000,
    category: 'Minor'
  },
  {
    id: "off-002",
    code: "SPD-02",
    description: "Speeding (20-40 km/h over limit)",
    amount: 10000,
    category: 'Major'
  },
  {
    id: "off-003",
    code: "SPD-03",
    description: "Speeding (40+ km/h over limit)",
    amount: 20000,
    category: 'Critical'
  },
  {
    id: "off-004",
    code: "RLT-01",
    description: "Running a red light",
    amount: 15000,
    category: 'Major'
  },
  {
    id: "off-005",
    code: "STP-01",
    description: "Failure to stop at stop sign",
    amount: 7500,
    category: 'Minor'
  },
  {
    id: "off-006",
    code: "DWI-01",
    description: "Driving without insurance",
    amount: 25000,
    category: 'Critical'
  },
  {
    id: "off-007",
    code: "DWL-01",
    description: "Driving without license",
    amount: 15000,
    category: 'Major'
  },
  {
    id: "off-008",
    code: "PZV-01",
    description: "Parking in no-parking zone",
    amount: 3500,
    category: 'Minor'
  },
  {
    id: "off-009",
    code: "MTH-01",
    description: "Mobile phone use while driving",
    amount: 10000,
    category: 'Major'
  },
  {
    id: "off-010",
    code: "SBT-01",
    description: "Not wearing seatbelt",
    amount: 5000,
    category: 'Minor'
  }
];

// Fine status options
export type FineStatus = 'Pending' | 'Paid' | 'Overdue' | 'Disputed' | 'Canceled';

// Fine interface
export interface Fine {
  id: string;
  ticketNumber: string;
  licensePlate: string;
  offenseId: string;
  amount: number;
  status: FineStatus;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  location: string;
  issuedBy: string; // Officer ID
  notes?: string;
  driverEmail?: string;
  photoUrl?: string;
}

// Generate mock fines
export const mockFines: Fine[] = [
  {
    id: "fine-001",
    ticketNumber: "FX-20250420-001",
    licensePlate: "ABC123",
    offenseId: "off-001",
    amount: 5000,
    status: 'Pending',
    issueDate: "2025-04-19T10:30:00Z",
    dueDate: "2025-05-03T23:59:59Z",
    location: "Main St & 5th Ave",
    issuedBy: "1", // Officer ID (John Officer)
    notes: "Driver was polite and acknowledged the violation",
    driverEmail: "driver@example.com"
  },
  {
    id: "fine-002",
    ticketNumber: "FX-20250420-002",
    licensePlate: "XYZ789",
    offenseId: "off-004",
    amount: 15000,
    status: 'Paid',
    issueDate: "2025-04-18T15:45:00Z",
    dueDate: "2025-05-02T23:59:59Z",
    paymentDate: "2025-04-19T09:15:00Z",
    location: "Highway 101, Mile 35",
    issuedBy: "1", // Officer ID (John Officer)
    notes: "Driver ran through red light at high speed"
  },
  {
    id: "fine-003",
    ticketNumber: "FX-20250420-003",
    licensePlate: "DEF456",
    offenseId: "off-006",
    amount: 25000,
    status: 'Overdue',
    issueDate: "2025-04-10T08:20:00Z",
    dueDate: "2025-04-17T23:59:59Z",
    location: "Beach Road & Ocean Drive",
    issuedBy: "1", // Officer ID (John Officer)
    notes: "Driver had no insurance documentation",
    driverEmail: "driver@example.com"
  },
  {
    id: "fine-004",
    ticketNumber: "FX-20250420-004",
    licensePlate: "GHI789",
    offenseId: "off-009",
    amount: 10000,
    status: 'Disputed',
    issueDate: "2025-04-15T14:10:00Z",
    dueDate: "2025-04-29T23:59:59Z",
    location: "Central Park, East Entrance",
    issuedBy: "1", // Officer ID (John Officer)
    notes: "Driver was using mobile phone while driving"
  },
  {
    id: "fine-005",
    ticketNumber: "FX-20250420-005",
    licensePlate: "ABC123",
    offenseId: "off-010",
    amount: 5000,
    status: 'Pending',
    issueDate: "2025-04-20T09:45:00Z",
    dueDate: "2025-05-04T23:59:59Z",
    location: "Downtown, 3rd & Market",
    issuedBy: "1", // Officer ID (John Officer)
    notes: "Driver and passenger not wearing seatbelts",
    driverEmail: "driver@example.com"
  }
];

// Function to get offense details by ID
export const getOffenseById = (id: string): TrafficOffense | undefined => {
  return trafficOffenses.find(offense => offense.id === id);
};

// Function to format currency (cents to dollars)
export const formatCurrency = (amount: number): string => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
};

// Function to get user-readable fine status with appropriate styling class
export const getFineStatusDetails = (status: FineStatus): { label: string, className: string } => {
  switch (status) {
    case 'Pending':
      return { label: 'Pending Payment', className: 'status-pending' };
    case 'Paid':
      return { label: 'Paid', className: 'status-paid' };
    case 'Overdue':
      return { label: 'Overdue', className: 'status-overdue' };
    case 'Disputed':
      return { label: 'Under Dispute', className: 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium' };
    case 'Canceled':
      return { label: 'Canceled', className: 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium' };
  }
};

// Function to get user's fines
export const getUserFines = (userId: string, role: string): Fine[] => {
  if (role === 'driver') {
    // For drivers, filter by their email
    return mockFines.filter(fine => fine.driverEmail === 'driver@example.com');
  } else if (role === 'officer') {
    // For officers, filter by officer ID
    return mockFines.filter(fine => fine.issuedBy === userId);
  } else {
    // For admins, return all fines
    return mockFines;
  }
};
