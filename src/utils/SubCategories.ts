// src/utils/SubCategories.ts

export const PLACE_SUBCATEGORIES = [
  // Category 1: Restaurants & Food
  "restaurants",
  "cafes",
  "bakeries",
  "street food",
  "juice & smoothie shops",
  "sweet shops",
  "ice cream parlours",
  "catering services",
  "food delivery",
  "mess / tiffin services",

  // Category 2: Hospitals & Healthcare (Places)
  "hospitals",
  "clinics",
  "dental clinics",
  "eye hospitals",
  "dermatologists",
  "diagnostic labs",
  "blood banks",
  "ambulance services",
  "physiotherapy centres",
  "nursing services",
  "vet hospitals / pet clinics",
  "pharmacies / medical shops",

  // Category 4: Hotels & Travel
  "hotels",
  "resorts",
  "lodges",
  "guest houses",
  "travel agencies",
  "tour packages",
  "taxi services",
  "bike/car rentals",
  "bus ticket booking",
  "train ticket booking",

  // Category 7: Shopping & Retail
  "grocery stores",
  "supermarkets",
  "clothing stores",
  "shoe shops",
  "mobile stores",
  "electronics shops",
  "furniture stores",
  "jewellery stores",
  "jewellery showrooms",
  "stationery shops",
  "gift shops",
  "optical shops",
  "hobbies",

  // Category 8: Education & Training
  "schools",
  "colleges",
  "coaching centres",
  "coaching",
  "computer training institutes",
  "music & dance classes",
  "spoken english classes",
  "driving schools",
  "skill development centres",

  // Category 11: Business & Professional Services (Places)
  "printing & xerox shops",

  // Category 13: Pet Services (Places)
  "pet shops",
  "vet clinics",

  // Category 14: Events & Entertainment
  "event halls",

  // Category 16: Courier & Logistics
  "courier offices",
  "delivery services",
  "parcel services",

  // Category 17: Sports & Activities
  "gyms",
  "sports clubs",
  "indoor play areas",
  "stadiums",

  // Category 19: Agriculture & Farming Services
  "fertilizer shops",
  "seeds shops",
  "farming tools",

  // Category 21: Creative & Art Services
  "art supplies",
];

export const WORKER_SUBCATEGORIES = [
  // Category 3: Plumbers & Home Repair
  "plumbers",
  "electricians",
  "carpenters",
  "painters",
  "painting contractors",
  "ac repair",
  "fridge repair",
  "washing machine repair",
  "ro/water purifier service",
  "geyser repair",
  "gas stove repair",
  "home appliance repair",
  "solar panel installation",

  // Category 10: Home & Personal Services
  "maid services",
  "cook services",
  "babysitters",
  "elderly care",
  "laundry services",
  "dry cleaning",
  "house cleaning",
  "house keeping services",
  "water can supply",
  "gas delivery",

  // Category 11: Business & Professional Services
  "ca / tax consultants",
  "chartered accountant",
  "lawyers",
  "notary",
  "insurance agents",
  "marketing agencies",
  "printing & publishing services",
  "event planners",
  "photography/videography",
  "placement services",
  "registration consultants",

  // Category 13: Pet Services (Workers)
  "pet grooming",
  "pet training",

  // Category 14: Events & Entertainment
  "dj services",
  "catering",
  "party decorations",
  "light & sound",
  "mandap decorations",

  // Category 15: Industrial & Local Services
  "packers & movers",
  "transporters",
  "water tank cleaning",
  "borewell services",
  "welding services",
  "fabrication work",
  "fabricators",
  "machine repair",
  "scrap dealers",
  "scrap buyers",

  // Category 16: Courier & Logistics
  "movers & packers",

  // Category 18: Daily Wage Labour Hiring
  "construction labor",
  "loading/unloading workers",
  "garden workers",
  "cleaning helpers",
  "event helpers",
  "watchmen",

  // Category 19: Agriculture & Farming Services
  "tractor rental",
  "veterinary doctors",
  "farm labour",
  "water pump repair",

  // Category 20: Corporate & Office Services
  "office boy hiring",
  "receptionist hiring",
  "background verification",
  "document courier",
  "office cleaning",
  "hr & recruiting agencies",

  // Category 21: Creative & Art Services
  "painting artists",
  "caricature artists",
  "handmade gift designers",
  "wall murals",
  "craft training",

  // Category 22: Wedding & Traditional Services
  "wedding planners",
  "pandits / poojari",
  "band / music team",
  "flower decoration",
  "caterers",
  "sangeet choreographers",
];

// ✅ AUTOMOTIVE SUBCATEGORIES - ALL LOWERCASE for matching
export const AUTOMOTIVE_SUBCATEGORIES = [
  "car repair",
  "bike repair",
  "car wash",
  "bike wash",
  "automobile spare parts",
  "towing services",
];

// ✅ Food subcategories (must match lowercase exactly)
export const FOOD_SUBCATEGORIES = [
  "restaurants",
  "cafes",
  "bakeries",
  "street food",
  "juice & smoothie shops",
  "sweet shops",
  "ice cream parlours",
  "food delivery",
  "mess / tiffin services",
  "catering services",
];

// ✅ INDUSTRIAL CATEGORY MAP - UPDATED with comprehensive variations
// This maps main categories to their route variations for better matching
export const INDUSTRIAL_CATEGORY_MAP: Record<string, string[]> = {
  "packers & movers": [
    "packers & movers",
    "packers-movers",
    "packers-and-movers",
    "movers & packers",
    "movers-packers",
    "movers-and-packers",
    "household shifting",
    "relocation services",
    "relocation",
    "shifting services",
    "moving services",
    "packing services",
  ],
  transporters: [
    "transporters",
    "transporter",
    "transport services",
    "transport-services",
    "goods transport",
    "goods-transport",
    "logistics",
    "logistics services",
    "cargo services",
    "cargo",
    "freight services",
  ],
  "water services": [
    "water tank cleaning",
    "water-tank-cleaning",
    "tank cleaning services",
    "tank-cleaning-services",
    "tank cleaning",
    "overhead tank cleaning",
    "overhead-tank-cleaning",
    "underground tank cleaning",
    "underground-tank-cleaning",
    "water tank",
  ],
  "borewell services": [
    "borewell services",
    "borewell-services",
    "borewell",
    "bore well",
    "bore-well",
    "borewell drilling",
    "borewell-drilling",
    "borewell contractors",
    "borewell-contractors",
    "borewell repair",
    "borewell-repair",
    "drilling services",
    "well drilling",
  ],
  "metal work": [
    "welding services",
    "welding-services",
    "welding",
    "fabrication work",
    "fabrication-work",
    "fabricators",
    "fabricator",
    "fabrication",
    "metal fabrication",
    "metal-fabrication",
    "steel fabrication",
    "steel-fabrication",
    "iron fabrication",
  ],
  "machine services": [
    "machine repair",
    "machine-repair",
    "machine work",
    "machine-work",
    "machinery repair",
    "machinery-repair",
    "industrial machine repair",
    "industrial-machine-repair",
    "machine",
    "machinery",
    "machine services",
  ],
  "scrap & recycling": [
    "scrap dealers",
    "scrap-dealers",
    "scrap dealer",
    "scrap buyers",
    "scrap-buyers",
    "scrap buyer",
    "scrap",
    "battery scrap",
    "battery-scrap",
    "e-waste scrap",
    "e-waste-scrap",
    "e-waste",
    "metal scrap",
    "metal-scrap",
    "recycling",
    "recycling services",
    "scrap metal",
  ],
};

// ✅ Hospital subcategories (must match lowercase exactly)
export const HOSPITAL_SUBCATEGORIES = [
  "hospitals",
  "clinics",
  "dental clinics",
  "eye hospitals",
  "dermatologists",
  "diagnostic labs",
  "blood banks",
  "ambulance services",
  "physiotherapy centres",
  "nursing services",
  "vet hospitals / pet clinics",
  "pharmacies / medical shops",
];

// ✅ Hotel & Travel subcategories (must match lowercase exactly)
export const HOTEL_SUBCATEGORIES = [
  "hotels",
  "resorts",
  "lodges",
  "guest houses",
  "travel agencies",
  "tour packages",
  "taxi services",
  "bike/car rentals",
  "bus ticket booking",
  "train ticket booking",
];

// ✅ Beauty & Wellness subcategories - COMPREHENSIVE LIST with all variations
export const BEAUTY_SUBCATEGORIES = [
  // Beauty Parlours
  "beauty parlours",
  "beauty-parlours",
  "beautyparlours",
  "beauty parlour",

  // Salons
  "salons",
  "salon",

  // Spa & Massage
  "spa & massage centres",
  "spa-massage-centres",
  "spa & massage",
  "spa",
  "massage centres",
  "massage",

  // Makeup Artists
  "makeup artists",
  "makeup-artists",
  "makeup artist",

  // Mehendi Artists
  "mehendi artists",
  "mehendi-artists",
  "mehendi artist",
  "mehndi artists",
  "mehndi-artists",

  // Fitness & Gyms
  "fitness centres / gyms",
  "fitness-centres-/-gyms",
  "fitness centres",
  "fitness-centres",
  "gyms",
  "gym",

  // Yoga
  "yoga centres",
  "yoga-centres",
  "yoga centre",

  // Skin Clinics
  "skin clinics",
  "skin-clinics",
  "skin clinic",

  // Tattoo Studios
  "tattoo studios",
  "tattoo-studios",
  "tattoo studio",
];

// ✅ Real Estate subcategories - COMPREHENSIVE LIST with all variations
export const REAL_ESTATE_SUBCATEGORIES = [
  // Property Dealers
  "property dealers",
  "property-dealers",
  "property",
  "dealers",
  "real estate agents",
  "real-estate-agents",

  // Builders & Developers
  "builders & developers",
  "builders-developers",
  "builders",
  "developers",
  "construction companies",

  // Rent/Lease
  "rent/lease listings",
  "rent-lease-listings",
  "rent/lease",
  "rent",
  "lease",
  "rental properties",
  "properties for rent",

  // Architects
  "architect services",
  "architect-services",
  "architects",
  "architectural services",

  // Interior Designers
  "interior designers",
  "interior-designers",
  "interior",
  "interior design",

  // Construction Contractors (Workers category but related to real estate)
  "construction contractors",
  "construction-contractors",
  "construction",
  "contractors",
  "home construction",
];

// ✅ Shopping & Retail subcategories - COMPREHENSIVE LIST with all variations
export const SHOPPING_SUBCATEGORIES = [
  // Grocery & Supermarkets
  "grocery stores",
  "grocery-stores",
  "grocery",
  "supermarkets",
  "supermarket",

  // Clothing
  "clothing stores",
  "clothing-stores",
  "clothing",
  "cloth",
  "clothes",
  "garments",
  "apparel",

  // Footwear
  "shoe shops",
  "shoe-shops",
  "shoes",
  "footwear",

  // Mobile & Electronics
  "mobile stores",
  "mobile-stores",
  "mobile",
  "phone stores",
  "electronics shops",
  "electronics-shops",
  "electronics",
  "electronic",

  // Furniture
  "furniture stores",
  "furniture-stores",
  "furniture",

  // Jewellery
  "jewellery stores",
  "jewellery-stores",
  "jewellery showrooms",
  "jewellery",
  "jewelry",
  "jeweller",

  // Stationery
  "stationery shops",
  "stationery-shops",
  "stationery",
  "stationary",

  // Gift Shops
  "gift shops",
  "gift-shops",
  "gift",
  "gifts",

  // Optical
  "optical shops",
  "optical-shops",
  "optical",
  "opticals",
  "eyewear",

  // Hobbies & Others
  "hobbies",
  "hobby shops",
];

// ✅ Education & Training subcategories (lowercase, consistent)
export const EDUCATION_SUBCATEGORIES = [
  "schools",
  "colleges",
  "coaching centres",
  "computer training institutes",
  "music & dance classes",
  "spoken english classes",
  "driving schools",
  "skill development centres",
];

// ✅ Business & Professional Services subcategories (lowercase, consistent)
export const BUSINESS_SUBCATEGORIES = [
  "chartered accountant",
  "lawyers",
  "notary",
  "insurance agents",
  "marketing agencies",
  "printing & xerox shops",
  "printing & publishing services",
  "event planners",
  "placement services",
  "registration consultants",
];

// ✅ Pet Service subcategories
export const PET_SERVICE_SUBCATEGORIES = [
  "pet clinics",
  "pet shops",
  "pet grooming",
  "pet training",
];

// ✅ Tech & Digital Services subcategories - COMPREHENSIVE LIST with all variations
export const TECH_DIGITAL_SUBCATEGORIES = [
  // Mobile Repair
  "mobile repair",
  "mobile-repair",
  "phone repair",
  "smartphone repair",

  // Laptop Repair
  "laptop repair",
  "laptop-repair",
  "computer repair",
  "computer & laptop repair",
  "computer-laptop-repair",

  // CCTV Installation
  "cctv installation",
  "cctv-installation",
  "security system",
  "security-system",
  "surveillance",

  // Software Services
  "software services",
  "software-services",
  "software development",
  "software-development",

  // Website Development
  "website development",
  "website-development",
  "web development",
  "web-development",

  // Internet Website Designers
  "internet website designers",
  "internet-website-designers",
  "website designers",
  "website-designers",
  "web designers",

  // Digital Marketing
  "digital marketing",
  "digital-marketing",
  "online marketing",
  "seo services",

  // Graphic Designers
  "graphic designers",
  "graphic-designers",
  "graphic design",
  "graphic-design",
  "designers",
];

// ✅ Event Services subcategories - COMPREHENSIVE LIST with all variations
export const EVENT_SUBCATEGORIES = [
  // Party Decorations
  "party decorations",
  "party-decorations",
  "party decoration",
  "decorations",

  // Mandap Decorations
  "mandap decorations",
  "mandap-decorations",
  "mandap decoration",
  "wedding decorations",
  "wedding-decorations",

  // DJ Services
  "dj services",
  "dj-services",
  "disc jockey",
  "disc-jockey",
  "dj",
];

// ✅ Courier & Logistics subcategories - COMPREHENSIVE LIST with all variations
export const COURIER_SUBCATEGORIES = [
  // Courier Offices
  "courier offices",
  "courier-offices",
  "courier office",
  "courier",
  "courier services",

  // Delivery Services
  "delivery services",
  "delivery-services",
  "delivery",
  "express delivery",
  "same day delivery",

  // Parcel Services
  "parcel services",
  "parcel-services",
  "parcel",
  "parcels",

  // Packers & Movers
  "packers & movers",
  "packers-movers",
  "packers and movers",
  "movers & packers",
  "movers-packers",
  "packing services",
  "moving services",
  "relocation services",

  // Logistics
  "logistics",
  "logistics services",
  "cargo services",
  "cargo",

  // Transporters
  "transporters",
  "transport services",
  "goods transport",
];

// ✅ Add this mapping for main categories → subcategories
export const PLACE_CATEGORY_MAP: Record<string, string[]> = {
  "food & dining": [
    "restaurants",
    "cafes",
    "bakeries",
    "street food",
    "juice & smoothie shops",
    "sweet shops",
    "ice cream parlours",
  ],
  "travel / stay": ["hotels", "resorts", "lodges", "guest houses"],
  shopping: [
    "grocery stores",
    "supermarkets",
    "clothing stores",
    "shoe shops",
    "mobile stores",
    "electronics shops",
    "jewellery stores",
    "stationery shops",
  ],
  education: ["schools", "colleges", "coaching centres"],
  "transport / logistics": ["courier offices", "delivery services", "parcel services"],
  health: ["hospitals", "clinics", "pharmacies / medical shops"],
  "pet services": ["pet shops", "vet clinics"],
};

// ✅ AMENITY MAP - Updated to include industrial services
export const AMENITY_MAP: Record<string, string[]> = {
  // 🍽 FOOD
  restaurants: ["amenity=restaurant"],
  cafes: ["amenity=cafe"],
  bakeries: ["shop=bakery"],
  "street food": ["amenity=fast_food"],
  "juice & smoothie shops": ["amenity=cafe", "shop=beverages"],
  "sweet shops": ["shop=confectionery"],
  "ice cream parlours": ["amenity=ice_cream"],

  // 🏥 MEDICAL
  hospitals: ["amenity=hospital"],
  clinics: ["amenity=clinic", "amenity=doctors"],
  "dental clinics": ["amenity=dentist"],
  "eye hospitals": ["amenity=hospital"],
  pharmacies: ["amenity=pharmacy"],
  "diagnostic labs": ["amenity=laboratory"],
  "blood banks": ["amenity=blood_bank"],

  // 🏨 STAY
  hotels: ["tourism=hotel"],
  resorts: ["tourism=resort"],
  lodges: ["tourism=guest_house"],
  "guest houses": ["tourism=guest_house"],

  // 💪 FITNESS
  gyms: ["leisure=fitness_centre"],
  "fitness centres / gyms": ["leisure=fitness_centre"],
  "yoga centres": ["leisure=sports_centre"],

  // 🎓 EDUCATION
  schools: ["amenity=school"],
  colleges: ["amenity=college"],
  "coaching centres": ["amenity=training"],
  coaching: ["amenity=training"],

  // 🛒 SHOPPING
  supermarkets: ["shop=supermarket"],
  "grocery stores": ["shop=convenience", "shop=supermarket"],

  // 🐾 PETS
  "pet shops": ["shop=pet"],
  "vet clinics": ["amenity=veterinary"],

  // 📱 SERVICES
  "mobile repair": ["shop=mobile_phone"],
  "courier offices": ["amenity=courier"],

  // 🏭 INDUSTRIAL SERVICES (added for completeness)
  "borewell services": ["craft=borewell_driller"],
  fabricators: ["craft=metal_construction"],
  transporters: ["office=transport"],
  "water tank cleaning": ["office=cleaning"],
  "scrap dealers": ["shop=scrap"],
  "machine repair": ["craft=machining"],

  // fallback
  default: ["amenity=restaurant"],
};

// ✅ HELPER FUNCTION: Check if a subcategory is industrial
export const isIndustrialSubcategory = (subcategory: string): boolean => {
  const normalized = subcategory.toLowerCase();

  // Check if it matches any industrial category
  for (const variants of Object.values(INDUSTRIAL_CATEGORY_MAP)) {
    if (variants.some(variant => normalized.includes(variant))) {
      return true;
    }
  }

  return false;
};

// ✅ HELPER FUNCTION: Get main category for a subcategory
export const getMainIndustrialCategory = (subcategory: string): string | null => {
  const normalized = subcategory.toLowerCase();

  for (const [mainCategory, variants] of Object.entries(INDUSTRIAL_CATEGORY_MAP)) {
    if (variants.some(variant => normalized.includes(variant))) {
      return mainCategory;
    }
  }

  return null;
};