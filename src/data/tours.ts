export type Tour = {
  slug: string;
  title: string;
  duration: string;
  priceFrom: number;
  category: 'safari' | 'day-trip' | 'combo' | 'cultural';
  image: string;
  shortDescription: string;
  highlights: string[];
  itinerary: { day: string; title: string; details: string }[];
  included: string[];
  excluded: string[];
  gallery: string[];
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const tours: Tour[] = [
  {
    slug: '3-day-masai-mara-classic',
    title: '3-Day Masai Mara Classic Safari',
    duration: '3 Days / 2 Nights',
    priceFrom: 720,
    category: 'safari',
    image: u('photo-1547471080-7cc2caa01a7e'),
    shortDescription:
      'A short but unforgettable escape into the heart of the Masai Mara — open plains, the Big Five, and golden African sunsets.',
    highlights: [
      'Game drives in the Masai Mara National Reserve',
      'Chance to spot the Big Five',
      'Sundowner views over the savannah',
      'Optional Maasai village visit',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Nairobi → Masai Mara', details: 'Morning departure from Nairobi, scenic drive via the Great Rift Valley, afternoon game drive.' },
      { day: 'Day 2', title: 'Full day in the Mara', details: 'Sunrise and afternoon game drives in search of lion, elephant, leopard, buffalo and rhino.' },
      { day: 'Day 3', title: 'Mara → Nairobi', details: 'Final morning game drive, brunch at camp, return to Nairobi by late afternoon.' },
    ],
    included: ['Park fees', '4x4 safari vehicle with pop-up roof', 'Professional driver-guide', 'Full board accommodation', 'Bottled water'],
    excluded: ['International flights', 'Visa fees', 'Travel insurance', 'Tips & gratuities', 'Optional balloon safari'],
    gallery: [u('photo-1547471080-7cc2caa01a7e'), u('photo-1516426122078-c23e76319801'), u('photo-1534177616072-ef7dc120449d')],
  },
  {
    slug: '5-day-great-migration',
    title: '5-Day Great Migration Safari',
    duration: '5 Days / 4 Nights',
    priceFrom: 1480,
    category: 'safari',
    image: u('photo-1516426122078-c23e76319801'),
    shortDescription:
      'Witness the world-famous wildebeest migration — millions of hooves thundering across the Mara River in one of nature’s greatest spectacles.',
    highlights: [
      'River crossings (July–October)',
      'Two full days of game drives',
      'Hot air balloon option at sunrise',
      'Mid-range and luxury camps available',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Nairobi → Mara', details: 'Drive to Masai Mara, evening game drive.' },
      { day: 'Day 2', title: 'Mara River crossings', details: 'Full-day with packed lunch, focus on the Mara River.' },
      { day: 'Day 3', title: 'Big cat country', details: 'Tracking lions, cheetah and leopard across the Mara Triangle.' },
      { day: 'Day 4', title: 'Cultural & landscape', details: 'Optional Maasai village visit, golden hour photography.' },
      { day: 'Day 5', title: 'Mara → Nairobi', details: 'Morning drive and return transfer to Nairobi.' },
    ],
    included: ['All park fees', '4x4 safari vehicle', 'Professional guide', 'Full board accommodation', 'All transfers'],
    excluded: ['Flights', 'Balloon safari (~$450)', 'Visas', 'Tips'],
    gallery: [u('photo-1516426122078-c23e76319801'), u('photo-1534177616072-ef7dc120449d'), u('photo-1549366021-9f761d040a94')],
  },
  {
    slug: '7-day-mara-amboseli',
    title: '7-Day Masai Mara & Amboseli Discovery',
    duration: '7 Days / 6 Nights',
    priceFrom: 2150,
    category: 'safari',
    image: u('photo-1534177616072-ef7dc120449d'),
    shortDescription:
      'A week-long adventure combining the legendary Masai Mara with elephants framed by Kilimanjaro in Amboseli.',
    highlights: ['Big cats of the Mara', 'Elephants of Amboseli', 'Mt. Kilimanjaro views', 'Lake Naivasha boat ride'],
    itinerary: [
      { day: 'Day 1', title: 'Nairobi → Lake Naivasha', details: 'Boat ride and walking safari at Crescent Island.' },
      { day: 'Day 2-3', title: 'Masai Mara', details: 'Two full days of game viewing in the Mara.' },
      { day: 'Day 4', title: 'Mara → Nairobi → Amboseli', details: 'Long transfer day with stops.' },
      { day: 'Day 5-6', title: 'Amboseli', details: 'Game drives with Kilimanjaro as backdrop.' },
      { day: 'Day 7', title: 'Amboseli → Nairobi', details: 'Morning game drive, return to Nairobi.' },
    ],
    included: ['Park fees', '4x4 vehicle', 'Guide', 'Full board lodging', 'Naivasha boat ride'],
    excluded: ['Flights', 'Visa', 'Insurance', 'Tips'],
    gallery: [u('photo-1534177616072-ef7dc120449d'), u('photo-1549366021-9f761d040a94'), u('photo-1547471080-7cc2caa01a7e')],
  },
  {
    slug: '4-day-luxury-mara',
    title: '4-Day Luxury Mara Tented Camp',
    duration: '4 Days / 3 Nights',
    priceFrom: 1890,
    category: 'safari',
    image: u('photo-1549366021-9f761d040a94'),
    shortDescription:
      'A boutique tented-camp experience deep in the Mara — exclusive game drives, gourmet bush dining and starlit evenings.',
    highlights: ['Luxury tented suite', 'Private game drives', 'Bush breakfast', 'Sundowner cocktails'],
    itinerary: [
      { day: 'Day 1', title: 'Fly-in to Mara', details: 'Light aircraft transfer from Nairobi, afternoon game drive.' },
      { day: 'Day 2', title: 'Bush breakfast & big cats', details: 'Sunrise drive with breakfast in the wild.' },
      { day: 'Day 3', title: 'Conservancy day', details: 'Walking safari and night game drive in adjoining conservancy.' },
      { day: 'Day 4', title: 'Mara → Nairobi', details: 'Morning drive and flight back.' },
    ],
    included: ['Domestic flights', 'Park & conservancy fees', 'Luxury full board', 'All drinks at camp', 'Guide'],
    excluded: ['International flights', 'Visa', 'Tips'],
    gallery: [u('photo-1549366021-9f761d040a94'), u('photo-1547471080-7cc2caa01a7e'), u('photo-1516426122078-c23e76319801')],
  },
  {
    slug: '6-day-mara-nakuru',
    title: '6-Day Mara, Nakuru & Naivasha Safari',
    duration: '6 Days / 5 Nights',
    priceFrom: 1650,
    category: 'safari',
    image: u('photo-1503614472-8c93d56e92ce'),
    shortDescription:
      'Three iconic Rift Valley parks in one journey — flamingoes, rhinos and the unmatched plains of the Mara.',
    highlights: ['Lake Nakuru rhinos', 'Flamingoes & pelicans', 'Naivasha boat safari', 'Three full Mara game drives'],
    itinerary: [
      { day: 'Day 1', title: 'Nairobi → Nakuru', details: 'Game drive in the afternoon.' },
      { day: 'Day 2', title: 'Nakuru → Naivasha', details: 'Boat ride and Hell\'s Gate cycling.' },
      { day: 'Day 3-5', title: 'Masai Mara', details: 'Three days of full game viewing.' },
      { day: 'Day 6', title: 'Mara → Nairobi', details: 'Return transfer.' },
    ],
    included: ['Park fees', '4x4 vehicle', 'Guide', 'Full board', 'Boat ride'],
    excluded: ['Flights', 'Visa', 'Tips'],
    gallery: [u('photo-1503614472-8c93d56e92ce'), u('photo-1516426122078-c23e76319801'), u('photo-1534177616072-ef7dc120449d')],
  },
  {
    slug: '8-day-honeymoon-kenya',
    title: '8-Day Kenya Honeymoon Safari',
    duration: '8 Days / 7 Nights',
    priceFrom: 3450,
    category: 'safari',
    image: u('photo-1516426122078-c23e76319801', 1400),
    shortDescription:
      'A romantic safari crafted for two — luxury lodges, private dinners and unforgettable shared moments in the wild.',
    highlights: ['Private candle-lit dinners', 'Couples spa treatments', 'Hot air balloon ride', 'Beach extension to Diani available'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival Nairobi', details: 'Welcome dinner at boutique hotel.' },
      { day: 'Day 2-4', title: 'Masai Mara', details: 'Luxury tented camp, balloon safari, bush dinner.' },
      { day: 'Day 5-7', title: 'Amboseli', details: 'Suite with Kilimanjaro view, private game drives.' },
      { day: 'Day 8', title: 'Departure', details: 'Return to Nairobi for departure flight.' },
    ],
    included: ['Domestic flights', 'Luxury full board', 'Balloon safari', 'Private guide', 'All park fees'],
    excluded: ['International flights', 'Visa', 'Tips'],
    gallery: [u('photo-1516426122078-c23e76319801'), u('photo-1549366021-9f761d040a94'), u('photo-1547471080-7cc2caa01a7e')],
  },

  // DAY TRIPS
  {
    slug: 'nairobi-national-park',
    title: 'Nairobi National Park Day Trip',
    duration: 'Half Day',
    priceFrom: 95,
    category: 'day-trip',
    image: u('photo-1535941339077-2dd1c7963098'),
    shortDescription:
      'The world\'s only wildlife park inside a capital city — lions, rhinos and giraffes against the Nairobi skyline.',
    highlights: ['Black rhino sanctuary', 'Lion & buffalo sightings', 'City skyline backdrop', '4-hour game drive'],
    itinerary: [{ day: 'Half Day', title: 'Park game drive', details: 'Hotel pickup at 06:00, return by midday.' }],
    included: ['Park fees', '4x4 vehicle', 'Guide', 'Bottled water'],
    excluded: ['Meals', 'Tips'],
    gallery: [u('photo-1535941339077-2dd1c7963098'), u('photo-1534177616072-ef7dc120449d')],
  },
  {
    slug: 'giraffe-centre-elephant-orphanage',
    title: 'Giraffe Centre & Elephant Orphanage',
    duration: 'Half Day',
    priceFrom: 75,
    category: 'day-trip',
    image: u('photo-1547471080-7cc2caa01a7e', 900),
    shortDescription:
      'Hand-feed endangered Rothschild giraffes and watch baby elephants being bottle-fed at the David Sheldrick Wildlife Trust.',
    highlights: ['Feed Rothschild giraffes', 'David Sheldrick orphanage', 'Conservation education', 'Great for families'],
    itinerary: [{ day: 'Half Day', title: 'Karen tour', details: 'Pickup 09:00, visit orphanage and giraffe centre.' }],
    included: ['Entry fees', 'Transport', 'Guide'],
    excluded: ['Lunch', 'Tips'],
    gallery: [u('photo-1547471080-7cc2caa01a7e')],
  },
  {
    slug: 'karen-blixen-museum',
    title: 'Karen Blixen Museum & Kazuri Beads',
    duration: 'Half Day',
    priceFrom: 65,
    category: 'day-trip',
    image: u('photo-1591025207163-942350e47db2'),
    shortDescription:
      'Step inside the colonial farmhouse from “Out of Africa” and visit the women-run Kazuri bead workshop.',
    highlights: ['Karen Blixen home & gardens', 'Kazuri beads workshop', 'Colonial Nairobi history', 'Souvenir shopping'],
    itinerary: [{ day: 'Half Day', title: 'Karen tour', details: 'Pickup 13:00, return by 17:30.' }],
    included: ['Entry fees', 'Transport', 'Guide'],
    excluded: ['Meals', 'Souvenirs'],
    gallery: [u('photo-1591025207163-942350e47db2')],
  },
  {
    slug: 'bomas-of-kenya',
    title: 'Bomas of Kenya Cultural Show',
    duration: 'Half Day',
    priceFrom: 55,
    category: 'day-trip',
    image: u('photo-1523805009345-7448845a9e53'),
    shortDescription:
      'Experience the music, dance and homestead architecture of 40+ Kenyan tribes in one afternoon.',
    highlights: ['Live tribal dances', 'Traditional homesteads', 'Cultural performances', 'Photo opportunities'],
    itinerary: [{ day: 'Half Day', title: 'Cultural show', details: 'Afternoon performances and homestead tour.' }],
    included: ['Entry fees', 'Transport', 'Guide'],
    excluded: ['Meals', 'Tips'],
    gallery: [u('photo-1523805009345-7448845a9e53')],
  },
  {
    slug: 'nairobi-city-tour',
    title: 'Nairobi City Highlights Tour',
    duration: 'Full Day',
    priceFrom: 110,
    category: 'day-trip',
    image: u('photo-1611348586804-61bf6c080437'),
    shortDescription:
      'See the best of Nairobi in a day — KICC viewpoint, Maasai Market, National Museum, and the railway museum.',
    highlights: ['KICC rooftop view', 'Maasai Market shopping', 'Nairobi National Museum', 'Local lunch included'],
    itinerary: [{ day: 'Full Day', title: 'City tour', details: '09:00 – 17:00 city highlights with lunch.' }],
    included: ['Entry fees', 'Transport', 'Guide', 'Lunch'],
    excluded: ['Souvenirs', 'Tips'],
    gallery: [u('photo-1611348586804-61bf6c080437')],
  },
  {
    slug: 'mt-longonot-hike',
    title: 'Mt. Longonot Day Hike',
    duration: 'Full Day',
    priceFrom: 90,
    category: 'day-trip',
    image: u('photo-1503614472-8c93d56e92ce', 900),
    shortDescription:
      'Hike the rim of a dormant volcano with sweeping views of the Great Rift Valley and Lake Naivasha.',
    highlights: ['Volcanic crater hike', 'Rift Valley views', '~6 hour hike', 'Moderate fitness level'],
    itinerary: [{ day: 'Full Day', title: 'Hike', details: 'Early departure, return to Nairobi by evening.' }],
    included: ['Park fees', 'Transport', 'Guide', 'Packed lunch'],
    excluded: ['Hiking gear', 'Tips'],
    gallery: [u('photo-1503614472-8c93d56e92ce')],
  },

  // COMBO
  {
    slug: 'combo-nairobi-mara-5day',
    title: '5-Day Nairobi & Masai Mara Combo',
    duration: '5 Days / 4 Nights',
    priceFrom: 1320,
    category: 'combo',
    image: u('photo-1611348586804-61bf6c080437', 1400),
    shortDescription:
      'The perfect introduction to Kenya — city culture, baby elephants, then three days deep in the Masai Mara.',
    highlights: ['Nairobi city tour', 'Elephant orphanage', 'Three days in the Mara', 'Cultural village visit'],
    itinerary: [
      { day: 'Day 1', title: 'Nairobi city day', details: 'Karen, giraffes and elephant orphanage.' },
      { day: 'Day 2-4', title: 'Masai Mara', details: 'Three days of game drives.' },
      { day: 'Day 5', title: 'Mara → Nairobi', details: 'Morning drive and return.' },
    ],
    included: ['All transfers', 'Guide', '4x4 vehicle', 'Full board on safari', 'B&B in Nairobi'],
    excluded: ['Flights', 'Visa', 'Tips'],
    gallery: [u('photo-1611348586804-61bf6c080437'), u('photo-1547471080-7cc2caa01a7e')],
  },
  {
    slug: 'combo-nairobi-mara-amboseli-7day',
    title: '7-Day Nairobi, Mara & Amboseli Combo',
    duration: '7 Days / 6 Nights',
    priceFrom: 2280,
    category: 'combo',
    image: u('photo-1534177616072-ef7dc120449d', 1400),
    shortDescription:
      'A full-spectrum Kenya combo: Nairobi culture, Masai Mara wildlife and Amboseli elephants under Kilimanjaro.',
    highlights: ['Big Five chances', 'Kilimanjaro views', 'Cultural Nairobi day', 'Two iconic parks'],
    itinerary: [
      { day: 'Day 1', title: 'Nairobi tour', details: 'City highlights and Karen.' },
      { day: 'Day 2-4', title: 'Masai Mara', details: 'Three full days of safari.' },
      { day: 'Day 5-6', title: 'Amboseli', details: 'Elephants of Amboseli.' },
      { day: 'Day 7', title: 'Return Nairobi', details: 'Final transfer.' },
    ],
    included: ['Park fees', 'Guide', 'Vehicle', 'Full board on safari'],
    excluded: ['Flights', 'Visa', 'Tips'],
    gallery: [u('photo-1534177616072-ef7dc120449d'), u('photo-1516426122078-c23e76319801')],
  },
  {
    slug: 'combo-mara-diani-9day',
    title: '9-Day Masai Mara & Diani Beach',
    duration: '9 Days / 8 Nights',
    priceFrom: 2890,
    category: 'combo',
    image: u('photo-1559825481-12a05cc00344'),
    shortDescription:
      'Bush meets beach — combine the thrill of the Mara with the white-sand bliss of Kenya\'s southern coast.',
    highlights: ['Masai Mara safari', 'Diani Beach all-inclusive', 'Indian Ocean snorkeling', 'Honeymoon-friendly'],
    itinerary: [
      { day: 'Day 1-4', title: 'Masai Mara', details: 'Wildlife adventure.' },
      { day: 'Day 5-9', title: 'Diani Beach', details: 'Beach relaxation, optional dolphin tour.' },
    ],
    included: ['Domestic flights', 'Mara full board', 'Diani all-inclusive', 'Transfers'],
    excluded: ['International flights', 'Visa', 'Tips'],
    gallery: [u('photo-1559825481-12a05cc00344'), u('photo-1516426122078-c23e76319801')],
  },

  // CULTURAL
  {
    slug: 'maasai-village-immersion',
    title: 'Maasai Village Cultural Immersion',
    duration: '2 Days / 1 Night',
    priceFrom: 380,
    category: 'cultural',
    image: u('photo-1523805009345-7448845a9e53', 1400),
    shortDescription:
      'Live alongside a Maasai community — learn beadwork, herd cattle, taste traditional foods and sleep in a cultural manyatta.',
    highlights: ['Stay in a Maasai manyatta', 'Traditional dance', 'Beadwork workshop', 'Community-led tourism'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & welcome', details: 'Travel to community, welcome ceremony.' },
      { day: 'Day 2', title: 'Daily life', details: 'Herding, cooking, walk-to-water, return.' },
    ],
    included: ['Transport', 'Community fee', 'All meals', 'Cultural guide'],
    excluded: ['Souvenirs', 'Tips'],
    gallery: [u('photo-1523805009345-7448845a9e53')],
  },
  {
    slug: 'bomas-cultural-deep-dive',
    title: 'Bomas of Kenya Deep Dive',
    duration: 'Full Day',
    priceFrom: 95,
    category: 'cultural',
    image: u('photo-1523805009345-7448845a9e53'),
    shortDescription:
      'A full-day exploration of Kenya\'s 40+ tribes — homesteads, cuisine, music and a backstage cultural lunch.',
    highlights: ['Backstage tour', 'Cultural lunch', 'Live performances', 'Tribal homesteads'],
    itinerary: [{ day: 'Full Day', title: 'Bomas tour', details: 'Morning to late afternoon experience.' }],
    included: ['Entry fees', 'Lunch', 'Transport', 'Guide'],
    excluded: ['Tips'],
    gallery: [u('photo-1523805009345-7448845a9e53')],
  },
  {
    slug: 'samburu-cultural-extension',
    title: 'Samburu Cultural Extension',
    duration: '3 Days / 2 Nights',
    priceFrom: 720,
    category: 'cultural',
    image: u('photo-1591025207163-942350e47db2', 1400),
    shortDescription:
      'Meet the Samburu people of northern Kenya — colorful warriors, ancient traditions and rare wildlife.',
    highlights: ['Samburu warrior dance', 'Special Five wildlife', 'Ewaso Nyiro river views', 'Cultural homestay'],
    itinerary: [
      { day: 'Day 1', title: 'Travel to Samburu', details: 'Scenic drive north.' },
      { day: 'Day 2', title: 'Cultural & wildlife', details: 'Village visit and game drive.' },
      { day: 'Day 3', title: 'Return', details: 'Drive back to Nairobi.' },
    ],
    included: ['Park fees', 'Transport', 'Guide', 'Full board'],
    excluded: ['Tips', 'Drinks'],
    gallery: [u('photo-1591025207163-942350e47db2')],
  },
];

export const byCategory = (cat: Tour['category']) => tours.filter((t) => t.category === cat);
export const findTour = (slug: string) => tours.find((t) => t.slug === slug);
