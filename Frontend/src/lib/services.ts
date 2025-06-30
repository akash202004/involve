export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  isNew?: boolean;
  route: string;
  category: string;
}

export interface ServiceDetails {
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  category: string;
}

// Main service categories from features section
export const MAIN_SERVICES: ServiceItem[] = [
  {
    id: 'womens-salon',
    title: "Women's Salon & Spa",
    icon: '/Assets/female-svgrepo-com.svg',
    route: '/booking/services?service=womens-salon',
    category: 'Beauty & Wellness',
  },
  {
    id: 'mens-salon',
    title: "Men's Salon & Massage",
    icon: '/Assets/men-in-suits-to-guide-svgrepo-com.svg',
    route: '/booking/services?service=mens-salon',
    category: 'Beauty & Wellness',
  },
  {
    id: 'mechanics',
    title: 'Mechanics',
    icon: '/Assets/spraying-svgrepo-com.svg',
    isNew: true,
    route: '/booking/services?service=mechanics',
    category: 'Automotive',
  },
  {
    id: 'electrician',
    title: 'Electrician',
    icon: '/Assets/plumber-svgrepo-com.svg',
    route: '/booking/services?service=electrician',
    category: 'Home Services',
  },
  {
    id: 'plumber',
    title: 'Plumber',
    icon: '/Assets/plumber-svgrepo-com.svg',
    route: '/booking/services?service=plumber',
    category: 'Home Services',
  },
  {
    id: 'carpenter',
    title: 'Carpenter',
    icon: '/Assets/painting-brush-svgrepo-com.svg',
    route: '/booking/services?service=carpenter',
    category: 'Home Services',
  },
];

// All available services with details
export const ALL_SERVICES: Record<string, ServiceDetails> = {
  // Hair Services
  Haircut: {
    name: "Haircut",
    description: "Professional haircut service",
    price: 299,
    duration: "30-45 min",
    icon: "✂",
    category: "Hair Services",
  },
  "Hair Color": {
    name: "Hair Color",
    description: "Professional hair coloring",
    price: 899,
    duration: "1-2 hours",
    icon: "🎨",
    category: "Hair Services",
  },
  "Hair Styling": {
    name: "Hair Styling",
    description: "Creative hair styling",
    price: 499,
    duration: "45-60 min",
    icon: "💇‍♂",
    category: "Hair Services",
  },
  "Hair Treatment": {
    name: "Hair Treatment",
    description: "Deep conditioning and repair",
    price: 599,
    duration: "45-60 min",
    icon: "💆‍♂",
    category: "Hair Services",
  },
  "Hair Spa": {
    name: "Hair Spa",
    description: "Relaxing hair spa",
    price: 799,
    duration: "60-90 min",
    icon: "🧖‍♂",
    category: "Hair Services",
  },
  "Hair Extensions": {
    name: "Hair Extensions",
    description: "Hair extension service",
    price: 1499,
    duration: "2-3 hours",
    icon: "👩‍🦱",
    category: "Hair Services",
  },

  // Grooming Services
  "Beard Trim": {
    name: "Beard Trim",
    description: "Beard trimming and shaping",
    price: 199,
    duration: "20-30 min",
    icon: "🪒",
    category: "Grooming Services",
  },
  Shave: {
    name: "Shave",
    description: "Traditional hot towel shave",
    price: 299,
    duration: "30-45 min",
    icon: "🪒",
    category: "Grooming Services",
  },
  "Beard Styling": {
    name: "Beard Styling",
    description: "Beard styling and grooming",
    price: 399,
    duration: "30-45 min",
    icon: "🧔",
    category: "Grooming Services",
  },
  Facial: {
    name: "Facial",
    description: "Rejuvenating facial treatment",
    price: 399,
    duration: "45-60 min",
    icon: "✨",
    category: "Grooming Services",
  },
  Threading: {
    name: "Threading",
    description: "Eyebrow and face threading",
    price: 99,
    duration: "15-20 min",
    icon: "🧵",
    category: "Grooming Services",
  },
  Waxing: {
    name: "Waxing",
    description: "Professional waxing",
    price: 199,
    duration: "20-30 min",
    icon: "🪒",
    category: "Grooming Services",
  },
  Manicure: {
    name: "Manicure",
    description: "Nail care and polish",
    price: 299,
    duration: "30-45 min",
    icon: "💅",
    category: "Grooming Services",
  },
  Pedicure: {
    name: "Pedicure",
    description: "Foot care and polish",
    price: 399,
    duration: "45-60 min",
    icon: "🦶",
    category: "Grooming Services",
  },
  Makeup: {
    name: "Makeup",
    description: "Professional makeup",
    price: 899,
    duration: "60-90 min",
    icon: "💄",
    category: "Beauty Services",
  },

  // Massage Services
  "Head Massage": {
    name: "Head Massage",
    description: "Relaxing head massage",
    price: 299,
    duration: "30-45 min",
    icon: "💆‍♂",
    category: "Massage Services",
  },
  "Body Massage": {
    name: "Body Massage",
    description: "Full body massage",
    price: 799,
    duration: "60-90 min",
    icon: "💆‍♂",
    category: "Massage Services",
  },
  "Foot Massage": {
    name: "Foot Massage",
    description: "Therapeutic foot massage",
    price: 399,
    duration: "30-45 min",
    icon: "🦶",
    category: "Massage Services",
  },
  "Thai Massage": {
    name: "Thai Massage",
    description: "Traditional Thai massage",
    price: 999,
    duration: "90-120 min",
    icon: "🧘‍♂",
    category: "Massage Services",
  },
  "Deep Tissue": {
    name: "Deep Tissue",
    description: "Deep tissue massage",
    price: 899,
    duration: "60-90 min",
    icon: "💪",
    category: "Massage Services",
  },
  Relaxation: {
    name: "Relaxation",
    description: "Gentle relaxation massage",
    price: 599,
    duration: "45-60 min",
    icon: "😌",
    category: "Massage Services",
  },

  // Cleaning Services
  "Home Cleaning": {
    name: "Home Cleaning",
    description: "Complete home cleaning",
    price: 599,
    duration: "2-3 hours",
    icon: "🏠",
    category: "Cleaning Services",
  },
  "Kitchen Cleaning": {
    name: "Kitchen Cleaning",
    description: "Kitchen deep cleaning",
    price: 399,
    duration: "1-2 hours",
    icon: "🍳",
    category: "Cleaning Services",
  },
  "Bathroom Cleaning": {
    name: "Bathroom Cleaning",
    description: "Bathroom sanitization",
    price: 299,
    duration: "45-60 min",
    icon: "🚿",
    category: "Cleaning Services",
  },
  "Window Cleaning": {
    name: "Window Cleaning",
    description: "Window and glass cleaning",
    price: 199,
    duration: "30-45 min",
    icon: "🪟",
    category: "Cleaning Services",
  },
  "Carpet Cleaning": {
    name: "Carpet Cleaning",
    description: "Deep carpet cleaning",
    price: 499,
    duration: "1-2 hours",
    icon: "🟫",
    category: "Cleaning Services",
  },
  "Sofa Cleaning": {
    name: "Sofa Cleaning",
    description: "Upholstery cleaning",
    price: 399,
    duration: "1-2 hours",
    icon: "🛋️",
    category: "Cleaning Services",
  },

  // Appliance Repair
  "AC Repair": {
    name: "AC Repair",
    description: "Air conditioner repair",
    price: 599,
    duration: "1-2 hours",
    icon: "❄️",
    category: "Appliance Repair",
  },
  "Refrigerator Repair": {
    name: "Refrigerator Repair",
    description: "Refrigerator maintenance",
    price: 499,
    duration: "1-2 hours",
    icon: "🧊",
    category: "Appliance Repair",
  },
  "Washing Machine Repair": {
    name: "Washing Machine Repair",
    description: "Washing machine service",
    price: 399,
    duration: "1-2 hours",
    icon: "🧺",
    category: "Appliance Repair",
  },
  "Microwave Repair": {
    name: "Microwave Repair",
    description: "Microwave oven repair",
    price: 299,
    duration: "30-60 min",
    icon: "📟",
    category: "Appliance Repair",
  },
  "TV Repair": {
    name: "TV Repair",
    description: "Television repair service",
    price: 399,
    duration: "1-2 hours",
    icon: "📺",
    category: "Appliance Repair",
  },

  // Plumbing Services
  "Pipe Repair": {
    name: "Pipe Repair",
    description: "Pipe and fitting repair",
    price: 399,
    duration: "1-2 hours",
    icon: "🔧",
    category: "Plumbing Services",
  },
  "Tap Repair": {
    name: "Tap Repair",
    description: "Faucet and tap repair",
    price: 299,
    duration: "30-60 min",
    icon: "🚰",
    category: "Plumbing Services",
  },
  "Toilet Repair": {
    name: "Toilet Repair",
    description: "Toilet and commode repair",
    price: 399,
    duration: "1-2 hours",
    icon: "🚽",
    category: "Plumbing Services",
  },
  "Drain Cleaning": {
    name: "Drain Cleaning",
    description: "Drain and sewer cleaning",
    price: 499,
    duration: "1-2 hours",
    icon: "🕳️",
    category: "Plumbing Services",
  },
  "Water Heater": {
    name: "Water Heater",
    description: "Water heater installation/repair",
    price: 599,
    duration: "2-3 hours",
    icon: "🔥",
    category: "Plumbing Services",
  },

  // Electrical Services
  Wiring: {
    name: "Wiring",
    description: "Electrical wiring service",
    price: 499,
    duration: "2-3 hours",
    icon: "⚡",
    category: "Electrical Services",
  },
  "Switch Repair": {
    name: "Switch Repair",
    description: "Switch and socket repair",
    price: 199,
    duration: "30-60 min",
    icon: "🔌",
    category: "Electrical Services",
  },
  "Fan Installation": {
    name: "Fan Installation",
    description: "Ceiling fan installation",
    price: 299,
    duration: "1-2 hours",
    icon: "💨",
    category: "Electrical Services",
  },
  "Light Installation": {
    name: "Light Installation",
    description: "Light fixture installation",
    price: 199,
    duration: "30-60 min",
    icon: "💡",
    category: "Electrical Services",
  },
  "MCB Repair": {
    name: "MCB Repair",
    description: "Circuit breaker repair",
    price: 399,
    duration: "1-2 hours",
    icon: "🔋",
    category: "Electrical Services",
  },

  // Carpenter Services
  "Furniture Repair": {
    name: "Furniture Repair",
    description: "Wooden furniture repair",
    price: 399,
    duration: "1-2 hours",
    icon: "🪑",
    category: "Carpenter Services",
  },
  "Door Repair": {
    name: "Door Repair",
    description: "Door and lock repair",
    price: 299,
    duration: "1-2 hours",
    icon: "🚪",
    category: "Carpenter Services",
  },
  "Window Repair": {
    name: "Window Repair",
    description: "Window frame repair",
    price: 399,
    duration: "1-2 hours",
    icon: "🪟",
    category: "Carpenter Services",
  },
  "Cabinet Installation": {
    name: "Cabinet Installation",
    description: "Kitchen cabinet installation",
    price: 599,
    duration: "2-3 hours",
    icon: "🗄️",
    category: "Carpenter Services",
  },
  "Shelf Installation": {
    name: "Shelf Installation",
    description: "Wall shelf installation",
    price: 199,
    duration: "30-60 min",
    icon: "📚",
    category: "Carpenter Services",
  },

  // Painting Services
  "Interior Painting": {
    name: "Interior Painting",
    description: "Interior wall painting",
    price: 799,
    duration: "4-6 hours",
    icon: "🎨",
    category: "Painting Services",
  },
  "Exterior Painting": {
    name: "Exterior Painting",
    description: "Exterior wall painting",
    price: 999,
    duration: "6-8 hours",
    icon: "🏠",
    category: "Painting Services",
  },
  "Door Painting": {
    name: "Door Painting",
    description: "Door and gate painting",
    price: 299,
    duration: "1-2 hours",
    icon: "🚪",
    category: "Painting Services",
  },
  "Furniture Painting": {
    name: "Furniture Painting",
    description: "Furniture refinishing",
    price: 499,
    duration: "2-3 hours",
    icon: "🪑",
    category: "Painting Services",
  },
  "Wall Texture": {
    name: "Wall Texture",
    description: "Wall texture application",
    price: 699,
    duration: "3-4 hours",
    icon: "🧱",
    category: "Painting Services",
  },

  // Pest Control
  "General Pest Control": {
    name: "General Pest Control",
    description: "General pest control service",
    price: 599,
    duration: "2-3 hours",
    icon: "🕷️",
    category: "Pest Control",
  },
  "Cockroach Control": {
    name: "Cockroach Control",
    description: "Cockroach elimination",
    price: 399,
    duration: "1-2 hours",
    icon: "🪳",
    category: "Pest Control",
  },
  "Termite Control": {
    name: "Termite Control",
    description: "Termite treatment",
    price: 799,
    duration: "3-4 hours",
    icon: "🐜",
    category: "Pest Control",
  },
  "Rodent Control": {
    name: "Rodent Control",
    description: "Rat and mouse control",
    price: 499,
    duration: "2-3 hours",
    icon: "🐀",
    category: "Pest Control",
  },
  "Bed Bug Control": {
    name: "Bed Bug Control",
    description: "Bed bug treatment",
    price: 699,
    duration: "2-3 hours",
    icon: "🛏️",
    category: "Pest Control",
  },

  // Mechanic Services
  "Car Service": {
    name: "Car Service",
    description: "Car maintenance service",
    price: 999,
    duration: "2-3 hours",
    icon: "🚗",
    category: "Mechanic Services",
  },
  "Bike Service": {
    name: "Bike Service",
    description: "Bike maintenance service",
    price: 499,
    duration: "1-2 hours",
    icon: "🏍️",
    category: "Mechanic Services",
  },
  "AC Service": {
    name: "AC Service",
    description: "Car AC service",
    price: 599,
    duration: "1-2 hours",
    icon: "❄️",
    category: "Mechanic Services",
  },
  "Oil Change": {
    name: "Oil Change",
    description: "Engine oil change",
    price: 299,
    duration: "30-60 min",
    icon: "🛢️",
    category: "Mechanic Services",
  },
  "Tire Service": {
    name: "Tire Service",
    description: "Tire repair and replacement",
    price: 399,
    duration: "1-2 hours",
    icon: "🛞",
    category: "Mechanic Services",
  },
};

// Helper function to search services
export const searchServices = (query: string): Array<{ service: ServiceDetails; type: 'main' | 'detailed' }> => {
  const results: Array<{ service: ServiceDetails; type: 'main' | 'detailed' }> = [];
  const lowerQuery = query.toLowerCase();

  // Search in main services
  MAIN_SERVICES.forEach(mainService => {
    if (mainService.title.toLowerCase().includes(lowerQuery) || 
        mainService.category.toLowerCase().includes(lowerQuery)) {
      // Find corresponding detailed services
      Object.values(ALL_SERVICES).forEach(detailedService => {
        if (detailedService.category.toLowerCase().includes(mainService.category.toLowerCase())) {
          results.push({ service: detailedService, type: 'detailed' });
        }
      });
    }
  });

  // Search in detailed services
  Object.values(ALL_SERVICES).forEach(service => {
    if (service.name.toLowerCase().includes(lowerQuery) || 
        service.description.toLowerCase().includes(lowerQuery) ||
        service.category.toLowerCase().includes(lowerQuery)) {
      results.push({ service, type: 'detailed' });
    }
  });

  // Remove duplicates based on service name
  const uniqueResults = results.filter((result, index, self) => 
    index === self.findIndex(r => r.service.name === result.service.name)
  );

  return uniqueResults.slice(0, 10); // Limit to 10 results
};

// Get all service categories
export const getServiceCategories = (): string[] => {
  const categories = new Set<string>();
  Object.values(ALL_SERVICES).forEach(service => {
    categories.add(service.category);
  });
  return Array.from(categories).sort();
}; 