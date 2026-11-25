export type Flavor = {
  id: string;
  name: string;
  short: string;
  notes: string;
  pairing: string;
  heat: number; // 1–10
  scoville: string;
  price: number;
  size: string;
  sauce: string; // sauce colour inside the jar
  glow: string; // section tint
  labelInk: string; // accent on the jar label
};

export const flavors: Flavor[] = [
  {
    id: "habanero-ash",
    name: "Habanero Ash",
    short: "Fire-charred habanero, burnt honey, lime zest.",
    notes:
      "We blister Yucatán habaneros over oak until the skins split, then fold in honey we take right to the edge of burning. Bright heat up front, a long smoky finish.",
    pairing: "Tacos al pastor, grilled pineapple, fried chicken",
    heat: 7,
    scoville: "≈ 85,000 SHU",
    price: 14,
    size: "250 ml",
    sauce: "#ff4d00",
    glow: "#ff5400",
    labelInk: "#ff5400",
  },
  {
    id: "black-garlic-chipotle",
    name: "Black Garlic Chipotle",
    short: "40-day black garlic, morita chipotle, cocoa nib.",
    notes:
      "Garlic aged forty days until it turns sweet and jammy, ground with smoked morita chillies and a pinch of cocoa. Deep, savoury, almost balsamic. The one people put on everything.",
    pairing: "Short rib, roast mushrooms, eggs any style",
    heat: 4,
    scoville: "≈ 10,000 SHU",
    price: 15,
    size: "250 ml",
    sauce: "#300802",
    glow: "#8a1c06",
    labelInk: "#ff8a3d",
  },
  {
    id: "ghost-saffron",
    name: "Ghost Saffron",
    short: "Bhut jolokia, Khorasan saffron, yellow mustard.",
    notes:
      "Our hottest jar. Ghost peppers fermented for three weeks, cut with saffron and stone-ground mustard so the heat arrives floral and golden before it climbs. Use by the drop.",
    pairing: "Curries, seafood stew, a very brave pizza",
    heat: 10,
    scoville: "≈ 900,000 SHU",
    price: 18,
    size: "200 ml",
    sauce: "#f0a000",
    glow: "#e89400",
    labelInk: "#ffb400",
  },
];

export const steps = [
  {
    title: "Char",
    body: "Whole chillies go straight onto an oak fire at around 900°C until the skins blister and blacken. This is where the smoke comes from. No liquid smoke, ever.",
  },
  {
    title: "Ferment",
    body: "The charred peppers rest with sea salt in clay crocks for 21 days. Fermentation rounds off the harsh edges and builds the deep, tangy backbone.",
  },
  {
    title: "Simmer",
    body: "Low and slow in copper with the rest of the recipe: aged garlic, honey, saffron. Four hours, stirred by hand, tasted every half hour.",
  },
  {
    title: "Pour",
    body: "Hot-filled into heavy glass jars, sealed, and numbered by the person who made the batch. 600 jars a week. When they're gone, they're gone.",
  },
];

export const ingredients = [
  {
    name: "Habanero",
    origin: "Yucatán, Mexico",
    detail: "Picked fully ripe for a fruity, apricot-like heat.",
    stat: "100k–350k SHU",
  },
  {
    name: "Black garlic",
    origin: "Aged in-house",
    detail: "Forty days of low, humid heat turn it sweet and molasses-dark.",
    stat: "40 days",
  },
  {
    name: "Bhut jolokia",
    origin: "Assam, India",
    detail: "The ghost pepper. A slow build that keeps climbing for minutes.",
    stat: "≈ 1M SHU",
  },
  {
    name: "Saffron",
    origin: "Khorasan, Iran",
    detail: "Hand-picked threads, steeped overnight before they go in.",
    stat: "Grade I",
  },
  {
    name: "Oak smoke",
    origin: "Our own fire pit",
    detail: "Seasoned oak only. It burns hot and leaves a clean, sweet smoke.",
    stat: "900°C",
  },
  {
    name: "Raw honey",
    origin: "Local apiary",
    detail: "Wildflower honey, caramelised until it's just shy of bitter.",
    stat: "Unfiltered",
  },
];
