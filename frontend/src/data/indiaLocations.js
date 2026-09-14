// Comprehensive Agricultural Geospatial Dataset of Indian States & Districts
// Coordinates, primary soil types, representative crops, and agro-climatic zones

export const INDIA_STATES_DATA = [
  {
    state: "Punjab",
    districts: [
      { name: "Ludhiana", lat: 30.9010, lon: 75.8573, soil: "Alluvial Loam", crop: "Wheat", zone: "Trans-Gangetic Plain" },
      { name: "Amritsar", lat: 31.6340, lon: 74.8723, soil: "Alluvial", crop: "Basmati Rice", zone: "Trans-Gangetic Plain" },
      { name: "Bathinda", lat: 30.2110, lon: 74.9455, soil: "Sandy Loam", crop: "Cotton", zone: "Semi-Arid Punjab" },
      { name: "Patiala", lat: 30.3398, lon: 76.3869, soil: "Alluvial Clay Loam", crop: "Wheat", zone: "Trans-Gangetic Plain" },
      { name: "Jalandhar", lat: 31.3260, lon: 75.5762, soil: "Alluvial", crop: "Potato & Wheat", zone: "Doaba Region" },
      { name: "Firozpur", lat: 30.9255, lon: 74.6122, soil: "Sandy Loam", crop: "Paddy & Mustard", zone: "Border Belt" },
      { name: "Sangrur", lat: 30.2458, lon: 75.8421, soil: "Alluvial Loam", crop: "Paddy & Wheat", zone: "Malwa Region" },
      { name: "Hoshiarpur", lat: 31.5273, lon: 75.9149, soil: "Loamy Sand", crop: "Citrus (Kinnow)", zone: "Sub-Montane Kandi" }
    ]
  },
  {
    state: "Maharashtra",
    districts: [
      { name: "Nashik", lat: 19.9975, lon: 73.7898, soil: "Black Soil (Regur)", crop: "Grapes & Onion", zone: "Western Maharashtra" },
      { name: "Pune", lat: 18.5204, lon: 73.8567, soil: "Medium Black Soil", crop: "Sugarcane & Vegetables", zone: "Western Maharashtra" },
      { name: "Nagpur", lat: 21.1458, lon: 79.0882, soil: "Black Clayey Soil", crop: "Citrus (Orange) & Cotton", zone: "Vidarbha" },
      { name: "Chhatrapati Sambhaji Nagar", lat: 19.8762, lon: 75.3433, soil: "Black Cotton Soil", crop: "Cotton & Maize", zone: "Marathwada" },
      { name: "Solapur", lat: 17.6599, lon: 75.9064, soil: "Deep Black Soil", crop: "Pomegranate & Jowar", zone: "Scarcity Zone" },
      { name: "Kolhapur", lat: 16.7050, lon: 74.2433, soil: "Laterite & Black Loam", crop: "Sugarcane", zone: "South Maharashtra" },
      { name: "Ahmednagar", lat: 19.0952, lon: 74.7496, soil: "Medium Black Soil", crop: "Soybean & Pearl Millet", zone: "Central Maharashtra" },
      { name: "Amravati", lat: 20.9374, lon: 77.7796, soil: "Deep Black Loam", crop: "Cotton & Soybean", zone: "Vidarbha" }
    ]
  },
  {
    state: "Uttar Pradesh",
    districts: [
      { name: "Varanasi", lat: 25.3176, lon: 82.9739, soil: "Alluvial Loam", crop: "Paddy & Vegetables", zone: "Eastern Plain Zone" },
      { name: "Lucknow", lat: 26.8467, lon: 80.9462, soil: "Alluvial Sandy Loam", crop: "Mango & Wheat", zone: "Central Plain" },
      { name: "Meerut", lat: 28.9845, lon: 77.7064, soil: "Alluvial Soil", crop: "Sugarcane & Wheat", zone: "Western Plain" },
      { name: "Prayagraj", lat: 25.4358, lon: 81.8463, soil: "Alluvial Loam", crop: "Guava & Pulses", zone: "Southern Plain" },
      { name: "Agra", lat: 27.1767, lon: 78.0081, soil: "Sandy Loam", crop: "Potato & Mustard", zone: "South-Western Semi-Arid" },
      { name: "Gorakhpur", lat: 26.7606, lon: 83.3732, soil: "Tarai Alluvial", crop: "Sugarcane & Paddy", zone: "North Eastern Plain" },
      { name: "Bareilly", lat: 28.3670, lon: 79.4304, soil: "Alluvial Loam", crop: "Wheat & Sugarcane", zone: "Rohilkhand" },
      { name: "Kanpur", lat: 26.4499, lon: 80.3319, soil: "Alluvial", crop: "Wheat & Mustard", zone: "Central Plain" }
    ]
  },
  {
    state: "Madhya Pradesh",
    districts: [
      { name: "Indore", lat: 22.7196, lon: 75.8577, soil: "Medium Black Soil", crop: "Soybean & Wheat", zone: "Malwa Plateau" },
      { name: "Bhopal", lat: 23.2599, lon: 77.4126, soil: "Deep Black Soil", crop: "Gram & Wheat", zone: "Vindhya Plateau" },
      { name: "Ujjain", lat: 23.1765, lon: 75.7885, soil: "Black Cotton Soil", crop: "Soybean & Garlic", zone: "Malwa Plateau" },
      { name: "Jabalpur", lat: 23.1815, lon: 79.9864, soil: "Mixed Red & Black", crop: "Paddy & Pea", zone: "Kymore Plateau" },
      { name: "Gwalior", lat: 26.2183, lon: 78.1828, soil: "Alluvial & Clayey", crop: "Mustard & Wheat", zone: "Gird Region" },
      { name: "Hoshangabad", lat: 22.7519, lon: 77.7289, soil: "Deep Clayey Black", crop: "Wheat (Sharbati) & Paddy", zone: "Central Narmada Valley" }
    ]
  },
  {
    state: "Gujarat",
    districts: [
      { name: "Rajkot", lat: 22.3039, lon: 70.8022, soil: "Medium Black Soil", crop: "Groundnut & Cotton", zone: "North Saurashtra" },
      { name: "Surat", lat: 21.1702, lon: 72.8311, soil: "Heavy Black Clay", crop: "Sugarcane & Banana", zone: "South Gujarat" },
      { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, soil: "Sandy Loam (Goradu)", crop: "Wheat & Cotton", zone: "Middle Gujarat" },
      { name: "Junagadh", lat: 21.5222, lon: 70.4579, soil: "Medium Black & Coastal", crop: "Groundnut & Mango (Kesar)", zone: "South Saurashtra" },
      { name: "Vadodara", lat: 22.3072, lon: 73.1812, soil: "Black Loam", crop: "Cotton & Tobacco", zone: "Middle Gujarat" },
      { name: "Mehsana", lat: 23.5880, lon: 72.3693, soil: "Sandy Loam", crop: "Castor & Mustard", zone: "North Gujarat" }
    ]
  },
  {
    state: "Haryana",
    districts: [
      { name: "Karnal", lat: 29.6857, lon: 76.9905, soil: "Alluvial Loam", crop: "Basmati Rice & Wheat", zone: "Eastern Haryana" },
      { name: "Hisar", lat: 29.1492, lon: 75.7217, soil: "Sandy Loam", crop: "Cotton & Mustard", zone: "Western Semi-Arid" },
      { name: "Ambala", lat: 30.3782, lon: 76.7767, soil: "Alluvial Loam", crop: "Paddy & Wheat", zone: "Northern Plain" },
      { name: "Sirsa", lat: 29.5349, lon: 75.0298, soil: "Arid Sandy Loam", crop: "Cotton & Wheat", zone: "Western Semi-Arid" },
      { name: "Rohtak", lat: 28.8955, lon: 76.6066, soil: "Sandy Loam", crop: "Wheat & Mustard", zone: "Central Haryana" }
    ]
  },
  {
    state: "Rajasthan",
    districts: [
      { name: "Jaipur", lat: 26.9124, lon: 75.7873, soil: "Sandy Loam", crop: "Mustard & Barley", zone: "Semi-Arid Eastern Plain" },
      { name: "Jodhpur", lat: 26.2389, lon: 73.0243, soil: "Desert Sandy Soil", crop: "Pearl Millet (Bajra) & Guar", zone: "Arid Western Plain" },
      { name: "Kota", lat: 25.2138, lon: 75.8648, soil: "Deep Black Soil", crop: "Soybean & Mustard", zone: "Humid South Eastern Plain" },
      { name: "Sri Ganganagar", lat: 29.9038, lon: 73.8772, soil: "Alluvial & Desert Sand", crop: "Wheat, Cotton & Kinnow", zone: "Irrigated North Western Plain" },
      { name: "Bikaner", lat: 28.0229, lon: 73.3119, soil: "Arid Sandy Soil", crop: "Moth Bean & Groundnut", zone: "Hyper Arid Partially Irrigated" }
    ]
  },
  {
    state: "Andhra Pradesh",
    districts: [
      { name: "Guntur", lat: 16.3067, lon: 80.4365, soil: "Black Cotton Soil", crop: "Red Chilli & Cotton", zone: "Krishna Godavari Zone" },
      { name: "Vijayawada", lat: 16.5062, lon: 80.6480, soil: "Deltaic Alluvium", crop: "Paddy & Mango", zone: "Krishna Godavari Delta" },
      { name: "Kurnool", lat: 15.8281, lon: 78.0373, soil: "Red Loam & Black Soil", crop: "Groundnut & Sunflower", zone: "Scarce Rainfall Zone" },
      { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185, soil: "Red Sandy Loam", crop: "Sugarcane & Paddy", zone: "North Coastal Zone" },
      { name: "Anantapur", lat: 14.6819, lon: 77.6006, soil: "Red Sandy Soil", crop: "Groundnut", zone: "Scarce Rainfall Zone" }
    ]
  },
  {
    state: "Telangana",
    districts: [
      { name: "Hyderabad", lat: 17.3850, lon: 78.4867, soil: "Red Sandy Loam (Chaluka)", crop: "Vegetables & Maize", zone: "Southern Telangana" },
      { name: "Warangal", lat: 17.9689, lon: 79.5941, soil: "Black Loam & Red Soil", crop: "Cotton & Chilli", zone: "Central Telangana" },
      { name: "Karimnagar", lat: 18.4386, lon: 79.1288, soil: "Medium Black & Red Loam", crop: "Paddy & Maize", zone: "Northern Telangana" },
      { name: "Nizamabad", lat: 18.6725, lon: 78.0941, soil: "Black Cotton Soil", crop: "Turmeric & Paddy", zone: "Northern Telangana" }
    ]
  },
  {
    state: "Karnataka",
    districts: [
      { name: "Belagavi", lat: 15.8497, lon: 74.4977, soil: "Medium to Deep Black", crop: "Sugarcane & Soybean", zone: "Northern Transition Zone" },
      { name: "Dharwad", lat: 15.4589, lon: 75.0078, soil: "Black Cotton Soil", crop: "Cotton & Bengal Gram", zone: "Northern Transition Zone" },
      { name: "Mysuru", lat: 12.2958, lon: 76.6394, soil: "Red Sandy Loam", crop: "Paddy & Ragi", zone: "Southern Dry Zone" },
      { name: "Raichur", lat: 16.2120, lon: 77.3439, soil: "Deep Black Soil", crop: "Cotton & Paddy", zone: "North Eastern Dry Zone" },
      { name: "Shivamogga", lat: 13.9299, lon: 75.5681, soil: "Laterite & Red Loam", crop: "Areca Nut & Paddy", zone: "Southern Transition Zone" }
    ]
  },
  {
    state: "Tamil Nadu",
    districts: [
      { name: "Thanjavur", lat: 10.7870, lon: 79.1378, soil: "Riverine Alluvium", crop: "Paddy (Rice Bowl of TN)", zone: "Cauvery Delta Zone" },
      { name: "Coimbatore", lat: 11.0168, lon: 76.9558, soil: "Red & Black Loam", crop: "Cotton & Coconut", zone: "Western Zone" },
      { name: "Madurai", lat: 9.9252, lon: 78.1198, soil: "Clayey Loam", crop: "Jasmine & Paddy", zone: "Southern Zone" },
      { name: "Salem", lat: 11.6643, lon: 78.1460, soil: "Red Sandy Loam", crop: "Tapioca & Mango", zone: "North Western Zone" }
    ]
  },
  {
    state: "Bihar",
    districts: [
      { name: "Patna", lat: 25.5941, lon: 85.1376, soil: "Alluvial Loam", crop: "Paddy & Wheat", zone: "South Bihar Alluvial Plain" },
      { name: "Muzaffarpur", lat: 26.1209, lon: 85.3647, soil: "Calcareous Alluvium", crop: "Litchi (Shahi) & Maize", zone: "North West Alluvial Plain" },
      { name: "Bhagalpur", lat: 25.2425, lon: 86.9842, soil: "Fine Alluvial Clay", crop: "Katarni Rice & Silk Mango", zone: "South East Alluvial Plain" },
      { name: "Gaya", lat: 24.7914, lon: 85.0002, soil: "Old Alluvial Sandy Loam", crop: "Wheat & Lentil", zone: "South Bihar Alluvial Plain" }
    ]
  },
  {
    state: "West Bengal",
    districts: [
      { name: "Burdwan", lat: 23.2324, lon: 87.8615, soil: "Alluvial Clay Loam", crop: "Aman Paddy & Potato", zone: "Old Alluvial Zone" },
      { name: "Hooghly", lat: 22.9038, lon: 88.3968, soil: "Gangetic Alluvium", crop: "Jute & Potato", zone: "New Alluvial Zone" },
      { name: "Nadia", lat: 23.4710, lon: 88.5565, soil: "Fertile Alluvial Loam", crop: "Jute, Rice & Mustard", zone: "New Alluvial Zone" },
      { name: "Murshidabad", lat: 24.1759, lon: 88.2802, soil: "Alluvial Loam", crop: "Paddy, Jute & Mango", zone: "Central Gangetic" }
    ]
  },
  {
    state: "Odisha",
    districts: [
      { name: "Cuttack", lat: 20.4625, lon: 85.8828, soil: "Deltaic Alluvium", crop: "Paddy & Pulses", zone: "East & South Eastern Coastal Plain" },
      { name: "Sambalpur", lat: 21.4669, lon: 83.9812, soil: "Red & Yellow Loam", crop: "Paddy & Oilseeds", zone: "Western Undulating Zone" },
      { name: "Balasore", lat: 21.4934, lon: 86.9135, soil: "Coastal Saline & Alluvial", crop: "Paddy & Mustard", zone: "North Eastern Coastal Plain" }
    ]
  },
  {
    state: "Kerala",
    districts: [
      { name: "Wayanad", lat: 11.6854, lon: 76.1320, soil: "Forest Loam & Laterite", crop: "Coffee & Black Pepper", zone: "High Altitude Zone" },
      { name: "Palakkad", lat: 10.7867, lon: 76.6548, soil: "Red Sandy Loam", crop: "Paddy (Rice Bowl of Kerala)", zone: "Palakkad Plains" },
      { name: "Idukki", lat: 9.8510, lon: 76.9443, soil: "Lateritic Mountain Soil", crop: "Cardamom & Tea", zone: "Highland Zone" }
    ]
  }
];

// Helper to flatten all districts for instant search and distance matching
export const ALL_INDIAN_DISTRICTS = INDIA_STATES_DATA.flatMap((s) =>
  s.districts.map((d) => ({
    ...d,
    state: s.state,
    fullName: `${d.name}, ${s.state}`
  }))
);

// Calculate Haversine distance in kilometers
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest Indian district for given GPS coordinates
export function findNearestIndianDistrict(lat, lon) {
  let closest = ALL_INDIAN_DISTRICTS[0];
  let minDistance = Infinity;

  for (const item of ALL_INDIAN_DISTRICTS) {
    const dist = getDistanceKm(lat, lon, item.lat, item.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return {
    ...closest,
    distanceKm: Math.round(minDistance)
  };
}
