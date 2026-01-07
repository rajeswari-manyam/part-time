export const AMENITY_MAP: Record<string, string[]> = {
  restaurants: ["restaurant"],
  cafes: ["cafe"],
  bakeries: ["bakery"],
  "street food": ["fast_food"],
  "juice & smoothie shops": ["juice_bar", "cafe"],
  "sweet shops": ["confectionery"],
  "ice cream parlours": ["ice_cream"],

  hospitals: ["hospital"],
  clinics: ["clinic", "doctors"],
  "dental clinics": ["dentist"],
  "eye hospitals": ["hospital"],
  pharmacies: ["pharmacy"],
  "diagnostic labs": ["laboratory"],
  "blood banks": ["blood_bank"],

  hotels: ["hotel"],
  resorts: ["resort"],
  lodges: ["guest_house"],
  "guest houses": ["guest_house"],

  gyms: ["gym", "fitness_centre"],
  "fitness centres / gyms": ["gym", "fitness_centre"],
  "yoga centres": ["yoga"],

  schools: ["school"],
  colleges: ["college"],
  "coaching centres": ["training"],
  coaching: ["training"],

  supermarkets: ["supermarket"],
  "grocery stores": ["supermarket", "convenience"],

  "pet shops": ["pet"],
  "vet clinics": ["veterinary"],

  "mobile repair": ["mobile_phone"],
  "courier offices": ["courier"],

  default: ["restaurant"],
};
