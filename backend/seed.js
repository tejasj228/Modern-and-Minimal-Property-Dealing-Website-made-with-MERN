const mongoose = require('mongoose');
const Area = require('./models/Area');
const Property = require('./models/Property');
const SliderImage = require('./models/SliderImage');
require('dotenv').config();

// Your existing data with order fields added
const areas = {
  'central-noida': {
    key: 'central-noida',
    name: 'Central Noida',
    description: 'Prime commercial and residential properties in the heart of Noida with excellent connectivity, modern amenities, and established infrastructure making it a preferred destination for businesses and residents.',
    order: 0, // 🆕 Added order field
    subAreas: [
      {
        id: 1,
        title: 'Sector 62 Residential',
        description: 'Modern apartments and independent houses with excellent connectivity to metro and major commercial hubs.',
        order: 0 // 🆕 Added order field
      },
      {
        id: 2,
        title: 'Sector 63 IT Hub',
        description: 'Premium office spaces and commercial complexes in the heart of Noida\'s IT corridor.',
        order: 1 // 🆕 Added order field
      },
      {
        id: 3,
        title: 'Sector 50 Premium Villas',
        description: 'Luxury independent villas and builder floors in one of Noida\'s most prestigious sectors.',
        order: 2 // 🆕 Added order field
      },
      {
        id: 4,
        title: 'Sector 61 Commercial',
        description: 'Strategic commercial properties with high footfall and excellent investment potential.',
        order: 3 // 🆕 Added order field
      },
      {
        id: 5,
        title: 'Sector 58 Mixed Development',
        description: 'Integrated township with residential, commercial, and retail spaces offering complete lifestyle solutions.',
        order: 4 // 🆕 Added order field
      },
      {
        id: 6,
        title: 'Sector 59 High-Rise Apartments',
        description: 'Modern high-rise residential complexes with world-class amenities and security features.',
        order: 5 // 🆕 Added order field
      }
    ]
  },
  'noida-expressway': {
    key: 'noida-expressway',
    name: 'Noida Greater Noida Expressway',
    description: 'Strategic locations along the expressway offering excellent investment opportunities, modern infrastructure, and seamless connectivity to Delhi, Gurgaon, and other major business hubs.',
    order: 1, // 🆕 Added order field
    subAreas: [
      {
        id: 1,
        title: 'Sector 137 New Developments',
        description: 'Contemporary residential projects with modern amenities and excellent connectivity to the expressway.',
        order: 0 // 🆕 Added order field
      },
      {
        id: 2,
        title: 'Sector 143 IT Corridor',
        description: 'Prime commercial spaces along the IT corridor with major multinational companies as neighbors.',
        order: 1 // 🆕 Added order field
      },
      {
        id: 3,
        title: 'Sector 150 Luxury Residences',
        description: 'Premium residential complexes with world-class facilities and direct expressway connectivity.',
        order: 2 // 🆕 Added order field
      },
      {
        id: 4,
        title: 'Sector 144 Mixed Use',
        description: 'Integrated development combining residential, commercial, and retail spaces for modern living.',
        order: 3 // 🆕 Added order field
      },
      {
        id: 5,
        title: 'Sector 168 Investment Hub',
        description: 'Emerging sector with high appreciation potential and excellent infrastructure development.',
        order: 4 // 🆕 Added order field
      },
      {
        id: 6,
        title: 'Sector 142 Commercial Plaza',
        description: 'Modern commercial complexes with retail outlets, offices, and entertainment facilities.',
        order: 5 // 🆕 Added order field
      }
    ]
  },
  'yamuna-expressway': {
    key: 'yamuna-expressway',
    name: 'Yamuna Expressway',
    description: 'Emerging real estate destination with world-class infrastructure, excellent connectivity to Delhi and Agra, and upcoming Jewar Airport making it a hotspot for future growth and investment.',
    order: 2, // 🆕 Added order field
    subAreas: [
      {
        id: 1,
        title: 'Sector 22D Residential',
        description: 'Affordable housing projects with modern amenities and excellent connectivity to the expressway.',
        order: 0 // 🆕 Added order field
      },
      {
        id: 2,
        title: 'Sector 25 Luxury Villas',
        description: 'Premium villa projects with large plot sizes and world-class amenities in a serene environment.',
        order: 1 // 🆕 Added order field
      },
      {
        id: 3,
        title: 'Sector 29 Investment Zone',
        description: 'High-growth potential area with upcoming infrastructure development and airport connectivity.',
        order: 2 // 🆕 Added order field
      },
      {
        id: 4,
        title: 'Sector 32 Commercial Hub',
        description: 'Emerging commercial center with retail complexes, office spaces, and entertainment facilities.',
        order: 3 // 🆕 Added order field
      },
      {
        id: 5,
        title: 'Sector 35 Airport Vicinity',
        description: 'Strategic location near the upcoming Jewar Airport with excellent appreciation potential.',
        order: 4 // 🆕 Added order field
      },
      {
        id: 6,
        title: 'Sector 18 Integrated Township',
        description: 'Complete township development with residential, commercial, and recreational facilities.',
        order: 5 // 🆕 Added order field
      }
    ]
  }
};

const properties = [
  {
    price: '₹85 Lakhs',
    title: 'Modern 3BHK Apartment',
    location: 'Sector 62, Central Noida',
    beds: 3,
    baths: 2,
    area: '1250 sq ft',
    areaKey: 'central-noida',
    description: 'Beautiful modern apartment with all amenities',
    features: ['Parking', 'Security', 'Gym', 'Garden'],
    links: {
      acres99: 'https://99acres.com/sample-property-1',
      magicbricks: 'https://magicbricks.com/sample-property-1'
    },
    order: 0 // 🆕 Added order field
  },
  {
    price: '₹1.2 Crores',
    title: 'Luxury 4BHK Villa',
    location: 'Sector 50, Central Noida',
    beds: 4,
    baths: 3,
    area: '2000 sq ft',
    areaKey: 'central-noida',
    description: 'Spacious luxury villa with premium finishes',
    features: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
    links: {
      acres99: 'https://99acres.com/sample-property-2',
      magicbricks: 'https://magicbricks.com/sample-property-2'
    },
    order: 1 // 🆕 Added order field
  },
  {
    price: '₹95 Lakhs',
    title: 'Contemporary 3BHK Flat',
    location: 'Sector 137, Noida Expressway',
    beds: 3,
    baths: 2,
    area: '1400 sq ft',
    areaKey: 'noida-expressway',
    description: 'Modern flat with expressway connectivity',
    features: ['Metro Connectivity', 'Shopping Mall', 'Parking', 'Security'],
    links: {
      acres99: 'https://99acres.com/sample-property-3',
      magicbricks: 'https://magicbricks.com/sample-property-3'
    },
    order: 0 // 🆕 Added order field
  },
  {
    price: '₹65 Lakhs',
    title: 'Spacious 2BHK Apartment',
    location: 'Sector 22D, Yamuna Expressway',
    beds: 2,
    baths: 2,
    area: '1100 sq ft',
    areaKey: 'yamuna-expressway',
    description: 'Affordable apartment with good connectivity',
    features: ['Airport Connectivity', 'Green Spaces', 'Parking', 'Security'],
    links: {
      acres99: 'https://99acres.com/sample-property-4',
      magicbricks: 'https://magicbricks.com/sample-property-4'
    },
    order: 0 // 🆕 Added order field
  }
];

const sliderImages = [
  {
    title: 'Modern House',
    imageUrl: 'https://images.unsplash.com/photo-1592394675778-4239b838fb2c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: 'Modern House',
    order: 0 // 🆕 Updated order field
  },
  {
    title: 'Luxury Villa',
    imageUrl: 'https://images.unsplash.com/photo-1673447620374-05f8b4842b41?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: 'Luxury Villa',
    order: 1 // 🆕 Updated order field
  },
  {
    title: 'Apartment Complex',
    imageUrl: 'https://i.pinimg.com/736x/63/08/b4/6308b4f4b61e0dfe0a5b2ff46fb81355.jpg',
    altText: 'Apartment Complex',
    order: 2 // 🆕 Updated order field
  },
  {
    title: 'Apartment Complex 2',
    imageUrl: 'https://i.pinimg.com/736x/3f/14/2a/3f142a2a37a24f0dee2dbafb0eb0964a.jpg',
    altText: 'Apartment Complex 2',
    order: 3 // 🆕 Updated order field
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Area.deleteMany({});
    await Property.deleteMany({});
    await SliderImage.deleteMany({});

    // Seed Areas with order
    console.log('🏢 Seeding areas with order...');
    for (const areaData of Object.values(areas)) {
      const area = new Area(areaData);
      await area.save();
      console.log(`  ✅ Added area: ${areaData.name} (order: ${areaData.order})`);
    }

    // Seed Properties with order
    console.log('🏠 Seeding properties with order...');
    for (const propertyData of properties) {
      const property = new Property(propertyData);
      await property.save();
      console.log(`  ✅ Added property: ${propertyData.title} (order: ${propertyData.order})`);
    }

    // Seed Slider Images with order
    console.log('🖼️ Seeding slider images with order...');
    for (const imageData of sliderImages) {
      const sliderImage = new SliderImage(imageData);
      await sliderImage.save();
      console.log(`  ✅ Added slider image: ${imageData.title} (order: ${imageData.order})`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Areas: ${Object.keys(areas).length} (with order)`);
    console.log(`   Properties: ${properties.length} (with order)`);
    console.log(`   Slider Images: ${sliderImages.length} (with order)`);
    console.log('\n🔄 Order fields have been added to all documents!');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
console.log('🚀 Starting database seeding...');
console.log('This will clear existing data and add fresh data with order fields.');
console.log('');

seedDatabase();