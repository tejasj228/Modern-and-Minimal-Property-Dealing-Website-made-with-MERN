// Slideshow images
export const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1592394675778-4239b838fb2c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Modern House'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1673447620374-05f8b4842b41?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Luxury Villa'
  },
  {
    id: 3,
    image: 'https://i.pinimg.com/736x/63/08/b4/6308b4f4b61e0dfe0a5b2ff46fb81355.jpg',
    alt: 'Apartment Complex'
  },
  {
    id: 4,
    image: 'https://i.pinimg.com/736x/3f/14/2a/3f142a2a37a24f0dee2dbafb0eb0964a.jpg',
    alt: 'Apartment Complex 2'
  }
];

// Why Choose Us features
export const features = [
  {
    id: 1,
    icon: 'fas fa-award',
    title: 'Expert Guidance',
    description: 'Our experienced team provides expert advice and guidance throughout your property journey, ensuring you make informed decisions.'
  },
  {
    id: 2,
    icon: 'fas fa-map-marked-alt',
    title: 'Prime Locations',
    description: 'We specialize in premium properties across key areas including Noida, Greater Noida Expressway, and Yamuna Expressway.'
  },
  {
    id: 3,
    icon: 'fas fa-handshake',
    title: 'Trusted Service',
    description: 'With years of experience and countless satisfied clients, we\'ve built a reputation for trust and reliability in the market.'
  }
];

// Areas data
export const areas = {
  'central-noida': {
    name: 'Central Noida',
    description: 'Prime commercial and residential properties in the heart of Noida with excellent connectivity, modern amenities, and established infrastructure making it a preferred destination for businesses and residents.',
    subAreas: [
      {
        id: 1,
        title: 'Sector 62 Residential',
        description: 'Modern apartments and independent houses with excellent connectivity to metro and major commercial hubs.'
      },
      {
        id: 2,
        title: 'Sector 63 IT Hub',
        description: 'Premium office spaces and commercial complexes in the heart of Noida\'s IT corridor.'
      },
      {
        id: 3,
        title: 'Sector 50 Premium Villas',
        description: 'Luxury independent villas and builder floors in one of Noida\'s most prestigious sectors.'
      },
      {
        id: 4,
        title: 'Sector 61 Commercial',
        description: 'Strategic commercial properties with high footfall and excellent investment potential.'
      },
      {
        id: 5,
        title: 'Sector 58 Mixed Development',
        description: 'Integrated township with residential, commercial, and retail spaces offering complete lifestyle solutions.'
      },
      {
        id: 6,
        title: 'Sector 59 High-Rise Apartments',
        description: 'Modern high-rise residential complexes with world-class amenities and security features.'
      }
    ]
  },
  'noida-expressway': {
    name: 'Noida Greater Noida Expressway',
    description: 'Strategic locations along the expressway offering excellent investment opportunities, modern infrastructure, and seamless connectivity to Delhi, Gurgaon, and other major business hubs.',
    subAreas: [
      {
        id: 1,
        title: 'Sector 137 New Developments',
        description: 'Contemporary residential projects with modern amenities and excellent connectivity to the expressway.'
      },
      {
        id: 2,
        title: 'Sector 143 IT Corridor',
        description: 'Prime commercial spaces along the IT corridor with major multinational companies as neighbors.'
      },
      {
        id: 3,
        title: 'Sector 150 Luxury Residences',
        description: 'Premium residential complexes with world-class facilities and direct expressway connectivity.'
      },
      {
        id: 4,
        title: 'Sector 144 Mixed Use',
        description: 'Integrated development combining residential, commercial, and retail spaces for modern living.'
      },
      {
        id: 5,
        title: 'Sector 168 Investment Hub',
        description: 'Emerging sector with high appreciation potential and excellent infrastructure development.'
      },
      {
        id: 6,
        title: 'Sector 142 Commercial Plaza',
        description: 'Modern commercial complexes with retail outlets, offices, and entertainment facilities.'
      }
    ]
  },
  'yamuna-expressway': {
    name: 'Yamuna Expressway',
    description: 'Emerging real estate destination with world-class infrastructure, excellent connectivity to Delhi and Agra, and upcoming Jewar Airport making it a hotspot for future growth and investment.',
    subAreas: [
      {
        id: 1,
        title: 'Sector 22D Residential',
        description: 'Affordable housing projects with modern amenities and excellent connectivity to the expressway.'
      },
      {
        id: 2,
        title: 'Sector 25 Luxury Villas',
        description: 'Premium villa projects with large plot sizes and world-class amenities in a serene environment.'
      },
      {
        id: 3,
        title: 'Sector 29 Investment Zone',
        description: 'High-growth potential area with upcoming infrastructure development and airport connectivity.'
      },
      {
        id: 4,
        title: 'Sector 32 Commercial Hub',
        description: 'Emerging commercial center with retail complexes, office spaces, and entertainment facilities.'
      },
      {
        id: 5,
        title: 'Sector 35 Airport Vicinity',
        description: 'Strategic location near the upcoming Jewar Airport with excellent appreciation potential.'
      },
      {
        id: 6,
        title: 'Sector 18 Integrated Township',
        description: 'Complete township development with residential, commercial, and recreational facilities.'
      }
    ]
  }
};

// Properties data
export const properties = {
  'central-noida': [
    {
      id: 1,
      price: '₹85 Lakhs',
      title: 'Modern 3BHK Apartment',
      location: 'Sector 62, Central Noida',
      beds: 3,
      baths: 2,
      area: '1250 sq ft'
    },
    {
      id: 2,
      price: '₹1.2 Crores',
      title: 'Luxury 4BHK Villa',
      location: 'Sector 50, Central Noida',
      beds: 4,
      baths: 3,
      area: '2000 sq ft'
    }
  ],
  'noida-expressway': [
    {
      id: 1,
      price: '₹95 Lakhs',
      title: 'Contemporary 3BHK Flat',
      location: 'Sector 137, Noida Expressway',
      beds: 3,
      baths: 2,
      area: '1400 sq ft'
    }
  ],
  'yamuna-expressway': [
    {
      id: 1,
      price: '₹65 Lakhs',
      title: 'Spacious 2BHK Apartment',
      location: 'Sector 22D, Yamuna Expressway',
      beds: 2,
      baths: 2,
      area: '1100 sq ft'
    }
  ]
};