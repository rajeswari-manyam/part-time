// src/utils/SubCategories.ts - COMPREHENSIVE FIX

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
  "medical shops",

  // Category 4: Hotels & Travel
  "hotels",
  "budget hotels",
  "luxury hotels",
  "resorts",
  "lodges",
  "guest houses",
  "homestays",
  "service apartments",
  "hostels",
  "pg / paying guest",
  "travel agencies",
  "tour packages",
  "taxi services",
  "bike / car rentals",
  "bus ticket booking",
  "train ticket booking",

  // Category 5: Beauty & Wellness
  "beauty parlours",
  "salons",
  "spa & massage centres",
  "makeup artists",
  "mehendi artists",
  "fitness centres / gyms",
  "yoga centres",
  "skin clinics",
  "tattoo studios",

  // Category 6: Real Estate & Construction
  "property dealers",
  "rent/lease listings",
  "builders & developers",
  "architect services",
  "interior designers",
  "construction contractors",

  // Category 7: Shopping & Retail
  "supermarkets",
  "clothing stores",
  "shoe shops",
  "mobile stores",
  "electronics shops",
  "furniture stores",
  "jewellery stores",
  "stationery shops",
  "gift shops",
  "optical shops",

  // Category 8: Education & Training
  "schools",
  "colleges",
  "coaching centres",
  "tuition teachers",
  "computer training institutes",
  "music & dance classes",
  "spoken english classes",
  "driving schools",
  "skill development centres",

  // Category 13: Pet Services (Places)
  "pet shops",
  "pet clinics",

  // Category 14: Events & Entertainment
  "event halls",

  // Category 16: Courier & Logistics (Places)
  "courier offices",
  "parcel services",

  // Category 17: Sports & Activities
  "gyms",
  "sports clubs",
  "indoor play areas",
  "stadiums",

  // Category 19: Agriculture & Farming Services (Places)
  "fertilizer shops",
  "seeds shops",
  "farming tools",

  // Category 21: Creative & Art Services (Places)
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
  "chartered accountant",
  "lawyers",
  "notary",
  "insurance agents",
  "marketing agencies",
  "printing & publishing services",
  "event planners",
  "placement services",
  "registration consultants",

  // Category 12: Tech & Digital Services
  "mobile repair",
  "computer & laptop repair",
  "cctv installation",
  "software services",
  "website development",
  "internet website designers",
  "digital marketing",
  "graphic designers",

  // Category 13: Pet Services (Workers)
  "pet grooming",
  "pet training",

  // Category 14: Events & Entertainment (Workers)
  "dj services",
  "party decorations",
  "mandap decorations",

  // Category 18: Daily Wage Labour Hiring
  "construction labor",
  "loading/unloading workers",
  "garden workers",
  "cleaning helpers",
  "event helpers",
  "watchmen",

  // Category 19: Agriculture & Farming Services (Workers)
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

  // Category 21: Creative & Art Services (Workers)
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

// ✅ AUTOMOTIVE SUBCATEGORIES
export const AUTOMOTIVE_SUBCATEGORIES = [
  "car repair",
  "bike repair",
  "car wash",
  "bike wash",
  "automobile spare parts",
  "towing services",
];

// ✅ INDUSTRIAL SUBCATEGORIES - ALL VARIATIONS
export const INDUSTRIAL_SUBCATEGORIES = [
  // Category 15: Industrial & Local Services - FROM JSON
  "transporters",
  "water tank cleaning",
  "borewell services",
  "fabricators",
  "machine repair",
  "scrap dealers",

  // Category 16: Movers & Packers
  "movers & packers",

  // Additional variations that might be used
  "packers & movers",
  "welding services",
  "fabrication work",
  "scrap buyers",
];

// ✅ COMPREHENSIVE INDUSTRIAL CATEGORY MAP
// Maps all possible route variations to their card components
export const INDUSTRIAL_CATEGORY_MAP: Record<string, string[]> = {
  // BOREWELL SERVICES
  "borewell": [
    "borewell services",
    "borewell-services",
    "borewellservices",
    "borewell",
    "bore well",
    "bore-well",
    "borewell drilling",
    "borewell-drilling",
    "bore well drilling",
    "drilling services",
    "drilling-services",
    "well drilling",
    "well-drilling",
    "borewell contractors",
    "borewell-contractors",
    "borewell repair",
    "borewell-repair",
  ],

  // FABRICATORS
  "fabricators": [
    "fabricators",
    "fabricator",
    "fabrication work",
    "fabrication-work",
    "fabrication",
    "welding services",
    "welding-services",
    "welding",
    "metal fabrication",
    "metal-fabrication",
    "steel fabrication",
    "steel-fabrication",
    "iron fabrication",
    "iron-fabrication",
    "metal work",
    "metal-work",
    "steel work",
    "steel-work",
  ],

  // TRANSPORTERS
  "transporters": [
    "transporters",
    "transporter",
    "transport services",
    "transport-services",
    "goods transport",
    "goods-transport",
    "logistics",
    "logistics services",
    "logistics-services",
    "cargo services",
    "cargo-services",
    "cargo",
    "freight services",
    "freight-services",
    "freight",
    "goods carrier",
    "goods-carrier",
  ],

  // WATER TANK CLEANING
  "water-tank-cleaning": [
    "water tank cleaning",
    "water-tank-cleaning",
    "watertankcleaning",
    "tank cleaning services",
    "tank-cleaning-services",
    "tank cleaning",
    "tank-cleaning",
    "overhead tank cleaning",
    "overhead-tank-cleaning",
    "underground tank cleaning",
    "underground-tank-cleaning",
    "water tank",
    "water-tank",
    "sump cleaning",
    "sump-cleaning",
  ],

  // SCRAP DEALERS
  "scrap-dealers": [
    "scrap dealers",
    "scrap-dealers",
    "scrapdealers",
    "scrap dealer",
    "scrap-dealer",
    "scrap buyers",
    "scrap-buyers",
    "scrap buyer",
    "scrap-buyer",
    "scrap",
    "battery scrap",
    "battery-scrap",
    "e-waste scrap",
    "e-waste-scrap",
    "e-waste",
    "ewaste",
    "metal scrap",
    "metal-scrap",
    "recycling",
    "recycling services",
    "recycling-services",
    "scrap metal",
    "scrap-metal",
    "kabadi",
    "raddi",
  ],

  // MACHINE REPAIR
  "machine-repair": [
    "machine repair",
    "machine-repair",
    "machinerepair",
    "machine work",
    "machine-work",
    "machinery repair",
    "machinery-repair",
    "industrial machine repair",
    "industrial-machine-repair",
    "machine",
    "machinery",
    "machine services",
    "machine-services",
    "sewing machine repair",
    "sewing-machine-repair",
    "washing machine repair",
    "washing-machine-repair",
  ],

  // MOVERS & PACKERS
  "movers-packers": [
    "movers & packers",
    "movers-&-packers",
    "movers-packers",
    "moverspackers",
    "packers & movers",
    "packers-&-movers",
    "packers-movers",
    "packersmovers",
    "packers and movers",
    "packers-and-movers",
    "movers and packers",
    "movers-and-packers",
    "household shifting",
    "household-shifting",
    "relocation services",
    "relocation-services",
    "relocation",
    "shifting services",
    "shifting-services",
    "moving services",
    "moving-services",
    "packing services",
    "packing-services",
  ],
};

// ✅ FOOD SUBCATEGORIES
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

// ✅ HOSPITAL SUBCATEGORIES
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

// ✅ HOTEL & TRAVEL SUBCATEGORIES
export const HOTEL_SUBCATEGORIES = [
  "hotels",
  "budget hotels",
  "luxury hotels",
  "resorts",
  "lodges",
  "guest houses",
  "homestays",
  "service apartments",
  "hostels",
  "pg / paying guest",
  "travel agencies",
  "tour packages",
  "taxi services",
  "bike / car rentals",
  "bike/car rentals",
  "bus ticket booking",
  "train ticket booking",
];

// ✅ BEAUTY & WELLNESS SUBCATEGORIES
export const BEAUTY_SUBCATEGORIES = [
  "beauty parlours",
  "beauty-parlours",
  "beauty parlour",
  "salons",
  "salon",
  "spa & massage centres",
  "spa-&-massage-centres",
  "spa & massage",
  "spa",
  "massage centres",
  "massage",
  "makeup artists",
  "makeup-artists",
  "makeup artist",
  "mehendi artists",
  "mehendi-artists",
  "mehendi artist",
  "mehndi artists",
  "mehndi-artists",
  "fitness centres / gyms",
  "fitness-centres-/-gyms",
  "fitness centres",
  "fitness-centres",
  "gyms",
  "gym",
  "yoga centres",
  "yoga-centres",
  "yoga centre",
  "skin clinics",
  "skin-clinics",
  "skin clinic",
  "tattoo studios",
  "tattoo-studios",
  "tattoo studio",
];

// ✅ REAL ESTATE SUBCATEGORIES
export const REAL_ESTATE_SUBCATEGORIES = [
  "property dealers",
  "property-dealers",
  "property",
  "dealers",
  "real estate agents",
  "real-estate-agents",
  "builders & developers",
  "builders-&-developers",
  "builders-developers",
  "builders",
  "developers",
  "construction companies",
  "rent/lease listings",
  "rent-lease-listings",
  "rent/lease",
  "rent",
  "lease",
  "rental properties",
  "properties for rent",
  "architect services",
  "architect-services",
  "architects",
  "architectural services",
  "interior designers",
  "interior-designers",
  "interior",
  "interior design",
  "construction contractors",
  "construction-contractors",
  "construction",
  "contractors",
  "home construction",
];

// ✅ SHOPPING SUBCATEGORIES
export const SHOPPING_SUBCATEGORIES = [
  "grocery stores",
  "grocery-stores",
  "grocery",
  "supermarkets",
  "supermarket",
  "clothing stores",
  "clothing-stores",
  "clothing",
  "cloth",
  "clothes",
  "garments",
  "apparel",
  "shoe shops",
  "shoe-shops",
  "shoes",
  "footwear",
  "mobile stores",
  "mobile-stores",
  "mobile",
  "phone stores",
  "electronics shops",
  "electronics-shops",
  "electronics",
  "electronic",
  "furniture stores",
  "furniture-stores",
  "furniture",
  "jewellery stores",
  "jewellery-stores",
  "jewellery showrooms",
  "jewellery",
  "jewelry",
  "jeweller",
  "stationery shops",
  "stationery-shops",
  "stationery",
  "stationary",
  "gift shops",
  "gift-shops",
  "gift",
  "gifts",
  "optical shops",
  "optical-shops",
  "optical",
  "opticals",
  "eyewear",
  "hobbies",
  "hobby shops",
];

// ✅ EDUCATION SUBCATEGORIES
export const EDUCATION_SUBCATEGORIES = [
  "schools",
  "colleges",
  "coaching centres",
  "coaching",
  "tuition teachers",
  "computer training institutes",
  "music & dance classes",
  "spoken english classes",
  "driving schools",
  "skill development centres",
];

// ✅ BUSINESS & PROFESSIONAL SERVICES
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

// ✅ PET SERVICES
export const PET_SERVICE_SUBCATEGORIES = [
  "pet clinics",
  "pet shops",
  "pet grooming",
  "pet training",
];

// ✅ TECH & DIGITAL SERVICES
export const TECH_DIGITAL_SUBCATEGORIES = [
  "mobile repair",
  "mobile-repair",
  "phone repair",
  "smartphone repair",
  "laptop repair",
  "laptop-repair",
  "computer repair",
  "computer & laptop repair",
  "computer-&-laptop-repair",
  "computer-laptop-repair",
  "cctv installation",
  "cctv-installation",
  "security system",
  "security-system",
  "surveillance",
  "software services",
  "software-services",
  "software development",
  "software-development",
  "website development",
  "website-development",
  "web development",
  "web-development",
  "internet website designers",
  "internet-website-designers",
  "website designers",
  "website-designers",
  "web designers",
  "digital marketing",
  "digital-marketing",
  "online marketing",
  "seo services",
  "graphic designers",
  "graphic-designers",
  "graphic design",
  "graphic-design",
  "designers",
];

// ✅ EVENT SERVICES
export const EVENT_SUBCATEGORIES = [
  "party decorations",
  "party-decorations",
  "party decoration",
  "decorations",
  "mandap decorations",
  "mandap-decorations",
  "mandap decoration",
  "wedding decorations",
  "wedding-decorations",
  "dj services",
  "dj-services",
  "disc jockey",
  "disc-jockey",
  "dj",
];

// ✅ COURIER & LOGISTICS
export const COURIER_SUBCATEGORIES = [
  "courier offices",
  "courier-offices",
  "courier office",
  "courier",
  "courier services",
  "delivery services",
  "delivery-services",
  "delivery",
  "express delivery",
  "same day delivery",
  "parcel services",
  "parcel-services",
  "parcel",
  "parcels",
];

// ✅ AMENITY MAP
export const AMENITY_MAP: Record<string, string[]> = {
  // FOOD
  restaurants: ["amenity=restaurant"],
  cafes: ["amenity=cafe"],
  bakeries: ["shop=bakery"],
  "street food": ["amenity=fast_food"],
  "juice & smoothie shops": ["amenity=cafe", "shop=beverages"],
  "sweet shops": ["shop=confectionery"],
  "ice cream parlours": ["amenity=ice_cream"],

  // MEDICAL
  hospitals: ["amenity=hospital"],
  clinics: ["amenity=clinic", "amenity=doctors"],
  "dental clinics": ["amenity=dentist"],
  "eye hospitals": ["amenity=hospital"],
  pharmacies: ["amenity=pharmacy"],
  "diagnostic labs": ["amenity=laboratory"],
  "blood banks": ["amenity=blood_bank"],

  // STAY
  hotels: ["tourism=hotel"],
  resorts: ["tourism=resort"],
  lodges: ["tourism=guest_house"],
  "guest houses": ["tourism=guest_house"],

  // FITNESS
  gyms: ["leisure=fitness_centre"],
  "fitness centres / gyms": ["leisure=fitness_centre"],
  "yoga centres": ["leisure=sports_centre"],

  // EDUCATION
  schools: ["amenity=school"],
  colleges: ["amenity=college"],
  "coaching centres": ["amenity=training"],
  coaching: ["amenity=training"],

  // SHOPPING
  supermarkets: ["shop=supermarket"],
  "grocery stores": ["shop=convenience", "shop=supermarket"],

  // PETS
  "pet shops": ["shop=pet"],
  "vet clinics": ["amenity=veterinary"],

  // SERVICES
  "mobile repair": ["shop=mobile_phone"],
  "courier offices": ["amenity=courier"],

  // INDUSTRIAL (for completeness)
  "borewell services": ["craft=borewell_driller"],
  fabricators: ["craft=metal_construction"],
  transporters: ["office=transport"],
  "water tank cleaning": ["office=cleaning"],
  "scrap dealers": ["shop=scrap"],
  "machine repair": ["craft=machining"],

  default: ["amenity=restaurant"],
};

// ✅ HELPER FUNCTIONS

/**
 * Check if a subcategory is industrial
 */
export const isIndustrialSubcategory = (subcategory: string): boolean => {
  if (!subcategory) return false;

  const normalized = subcategory.toLowerCase().trim();

  // Check against all industrial category variations
  for (const variants of Object.values(INDUSTRIAL_CATEGORY_MAP)) {
    if (variants.some(variant => {
      const variantNormalized = variant.toLowerCase();
      return normalized === variantNormalized ||
        normalized.includes(variantNormalized) ||
        variantNormalized.includes(normalized);
    })) {
      return true;
    }
  }

  // Also check direct match in INDUSTRIAL_SUBCATEGORIES
  return INDUSTRIAL_SUBCATEGORIES.some(sub =>
    sub.toLowerCase() === normalized ||
    normalized.includes(sub.toLowerCase())
  );
};

/**
 * Get the main industrial category for a subcategory
 * Returns the key from INDUSTRIAL_CATEGORY_MAP
 */
export const getMainIndustrialCategory = (subcategory: string): string | null => {
  if (!subcategory) return null;

  const normalized = subcategory.toLowerCase().trim();

  for (const [mainCategory, variants] of Object.entries(INDUSTRIAL_CATEGORY_MAP)) {
    if (variants.some(variant => {
      const variantNormalized = variant.toLowerCase();
      return normalized === variantNormalized ||
        normalized.includes(variantNormalized) ||
        variantNormalized.includes(normalized);
    })) {
      return mainCategory;
    }
  }

  return null;
};

/**
 * Get the appropriate card component name for a subcategory
 */
export const getIndustrialCardComponent = (subcategory: string): string | null => {
  if (!subcategory) return null;

  const mainCategory = getMainIndustrialCategory(subcategory);

  if (!mainCategory) return null;

  // Map main categories to card component names
  const cardComponentMap: Record<string, string> = {
    "borewell": "BorewellServiceCard",
    "fabricators": "FabricatorServiceCard",
    "transporters": "TransporterServiceCard",
    "water-tank-cleaning": "WaterTankCleaningCard",
    "scrap-dealers": "ScrapDealerCard",
    "machine-repair": "MachineWorkCard",
    "movers-packers": "PackersMoversCard", // When component is created
  };

  return cardComponentMap[mainCategory] || null;
};
// ✅ SPORTS & ACTIVITIES SUBCATEGORIES (PLACES)
export const SPORTS_SUBCATEGORIES = [
  "gyms",
  "gym",
  "fitness centres",
  "fitness centers",
  "fitness centres / gyms",

  "sports clubs",
  "sports club",
  "sports academy",
  "sports academies",

  "stadiums",
  "stadium",

  "indoor play areas",
  "indoor play area",
  "indoor games",

  "playgrounds",
  "playground",

  "badminton courts",
  "badminton court",

  "cricket grounds",
  "cricket ground",

  "football grounds",
  "football ground",

  "swimming pools",
  "swimming pool",

  "yoga centres",
  "yoga center",
];
// ✅ AGRICULTURE & FARMING SUBCATEGORIES (UTIL SCREEN)
export const AGRICULTURE_SUBCATEGORIES = [
  // Places
  "fertilizer shops",
  "fertiliser shops",
  "seeds shops",
  "seed stores",
  "agro stores",
  "agriculture stores",
  "farming tools",
  "farm equipment",
  "irrigation equipment",

  // Services / Workers
  "tractor rental",
  "harvester rental",
  "farm labour",
  "agriculture labour",
  "veterinary doctors",
  "animal doctors",
  "water pump repair",
  "motor pump repair",
  "borewell services",
];
