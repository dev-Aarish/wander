import { Trail } from '../types';

export const INITIAL_TRAILS: Trail[] = [
  {
    id: "trail-franconia-ridge-nh",
    name: "Franconia Ridge Loop",
    region: "White Mountains, New Hampshire",
    state: "NH",
    coordinates: { latitude: 44.1425, longitude: -71.6828 },
    elevation_m: 1590,
    length_km: 14.3,
    difficulty: "Hard",
    summary: "Iconic alpine ridge walk traversing Mount Lincoln and Mount Lafayette above the tree line with breathtaking fiery red and orange sugar maple valleys below.",
    canopy_composition: {
      sugar_maple_pct: 48.0,
      paper_birch_pct: 28.0,
      american_beech_pct: 14.0,
      red_oak_pct: 5.0,
      conifer_pct: 5.0,
      quaking_aspen_pct: 0,
      alpine_larch_pct: 0,
      sourwood_pct: 0,
      vine_maple_pct: 0,
      colorado_blue_spruce_pct: 0,
      lodgepole_pine_pct: 0,
      douglas_fir_pct: 0
    },
    current_weather: {
      temperature_c: 8.5,
      chill_hours_cumulative: 320,
      solar_radiation_mj: 11.2,
      drought_stress_index: 0.18,
      cloud_cover_pct: 20,
      wind_speed_kmh: 18
    },
    viewpoints: [
      { name: "Falling Waters Cascade", distance_km: 2.1, elevation_m: 880, species_focus: "Sugar Maple & Yellow Birch" },
      { name: "Haystack Mountain Summit", distance_km: 5.4, elevation_m: 1450, species_focus: "Alpine Scrub & Valley Foliage Panorama" },
      { name: "Mount Lafayette Alpine Ridge", distance_km: 9.2, elevation_m: 1590, species_focus: "360-Degree Autumn Vista" }
    ],
    tags: ["ridge walk", "alpine", "sugar maple", "waterfalls", "360 vista", "epic"],
    foliage_stage_pct: 94.2,
    peak_status: "Peak Vibrant",
    days_to_peak: 2,
    peak_window_start: "Oct 11",
    peak_window_end: "Oct 14"
  },
  {
    id: "trail-maroon-bells-co",
    name: "Maroon Bells Scenic Loop & Crater Lake",
    region: "Rocky Mountains, Colorado",
    state: "CO",
    coordinates: { latitude: 39.0708, longitude: -106.9890 },
    elevation_m: 3080,
    length_km: 6.1,
    difficulty: "Moderate",
    summary: "Gleaming golden quaking aspen groves reflecting in the pristine alpine waters of Maroon Lake and Crater Lake beneath towering jagged fourteeners.",
    canopy_composition: {
      quaking_aspen_pct: 78.0,
      colorado_blue_spruce_pct: 12.0,
      lodgepole_pine_pct: 7.0,
      red_oak_pct: 0.0,
      sugar_maple_pct: 3.0,
      paper_birch_pct: 0,
      american_beech_pct: 0,
      alpine_larch_pct: 0,
      sourwood_pct: 0,
      conifer_pct: 0,
      vine_maple_pct: 0,
      douglas_fir_pct: 0
    },
    current_weather: {
      temperature_c: 5.2,
      chill_hours_cumulative: 410,
      solar_radiation_mj: 13.8,
      drought_stress_index: 0.29,
      cloud_cover_pct: 15,
      wind_speed_kmh: 12
    },
    viewpoints: [
      { name: "Maroon Lake Reflection Shore", distance_km: 0.5, elevation_m: 2920, species_focus: "Quaking Aspen Mirror Reflections" },
      { name: "Crater Lake Aspen Meadow", distance_km: 2.9, elevation_m: 3080, species_focus: "Golden Aspen Canopy with Pyramid Peak Backdrop" }
    ],
    tags: ["golden aspen", "lake reflection", "rockies", "photography", "fourteeners"],
    foliage_stage_pct: 98.6,
    peak_status: "Peak Vibrant",
    days_to_peak: 1,
    peak_window_start: "Oct 10",
    peak_window_end: "Oct 13"
  },
  {
    id: "trail-craggy-gardens-nc",
    name: "Craggy Pinnacle Trail",
    region: "Blue Ridge Parkway, North Carolina",
    state: "NC",
    coordinates: { latitude: 35.7061, longitude: -82.3789 },
    elevation_m: 1795,
    length_km: 2.3,
    difficulty: "Easy",
    summary: "Short and rewarding climb through twisted rhododendron tunnels and high-elevation red oaks bursting into deep crimson, russet, and gold overlooking the Appalachian ridges.",
    canopy_composition: {
      red_oak_pct: 42.0,
      sourwood_pct: 26.0,
      sugar_maple_pct: 18.0,
      american_beech_pct: 9.0,
      conifer_pct: 5.0,
      quaking_aspen_pct: 0,
      paper_birch_pct: 0,
      alpine_larch_pct: 0,
      vine_maple_pct: 0,
      colorado_blue_spruce_pct: 0,
      lodgepole_pine_pct: 0,
      douglas_fir_pct: 0
    },
    current_weather: {
      temperature_c: 11.0,
      chill_hours_cumulative: 210,
      solar_radiation_mj: 12.4,
      drought_stress_index: 0.12,
      cloud_cover_pct: 30,
      wind_speed_kmh: 14
    },
    viewpoints: [
      { name: "Craggy Observation Deck", distance_km: 1.1, elevation_m: 1795, species_focus: "Sourwood Crimson & Red Oak Ridge Sweep" }
    ],
    tags: ["blue ridge", "sunset vista", "sourwood", "crimson oak", "family friendly"],
    foliage_stage_pct: 74.0,
    peak_status: "Approaching Peak",
    days_to_peak: 6,
    peak_window_start: "Oct 16",
    peak_window_end: "Oct 19"
  },
  {
    id: "trail-mount-mansfield-vt",
    name: "Sunset Ridge to Mount Mansfield",
    region: "Green Mountains, Vermont",
    state: "VT",
    coordinates: { latitude: 44.5438, longitude: -72.8144 },
    elevation_m: 1339,
    length_km: 5.3,
    difficulty: "Hard",
    summary: "Classic Vermont climb ascending open bedrock ridges through dense northern hardwood forest rich with electric orange sugar maples and bright yellow birches.",
    canopy_composition: {
      sugar_maple_pct: 55.0,
      paper_birch_pct: 22.0,
      american_beech_pct: 15.0,
      red_oak_pct: 4.0,
      conifer_pct: 4.0,
      quaking_aspen_pct: 0,
      alpine_larch_pct: 0,
      sourwood_pct: 0,
      vine_maple_pct: 0,
      colorado_blue_spruce_pct: 0,
      lodgepole_pine_pct: 0,
      douglas_fir_pct: 0
    },
    current_weather: {
      temperature_c: 7.8,
      chill_hours_cumulative: 345,
      solar_radiation_mj: 10.9,
      drought_stress_index: 0.15,
      cloud_cover_pct: 35,
      wind_speed_kmh: 22
    },
    viewpoints: [
      { name: "Cantilever Rock Overlook", distance_km: 1.8, elevation_m: 890, species_focus: "Sugar Maple Carpet" },
      { name: "The Chin (Highest Peak in VT)", distance_km: 5.3, elevation_m: 1339, species_focus: "Lake Champlain & Green Mountain Foliage" }
    ],
    tags: ["vermont", "sugar maple", "bedrock", "highest peak", "sunset view"],
    foliage_stage_pct: 91.5,
    peak_status: "Peak Vibrant",
    days_to_peak: 3,
    peak_window_start: "Oct 12",
    peak_window_end: "Oct 15"
  },
  {
    id: "trail-cascade-mountain-ny",
    name: "Cascade and Porter Mountains",
    region: "Adirondacks High Peaks, New York",
    state: "NY",
    coordinates: { latitude: 44.2186, longitude: -73.8601 },
    elevation_m: 1249,
    length_km: 7.7,
    difficulty: "Moderate",
    summary: "Adirondack High Peak hike featuring exposed granite slabs with sweeping views of the cascade lakes surrounded by rich mosaic fall foliage.",
    canopy_composition: {
      sugar_maple_pct: 44.0,
      american_beech_pct: 24.0,
      paper_birch_pct: 20.0,
      red_oak_pct: 7.0,
      conifer_pct: 5.0,
      quaking_aspen_pct: 0,
      alpine_larch_pct: 0,
      sourwood_pct: 0,
      vine_maple_pct: 0,
      colorado_blue_spruce_pct: 0,
      lodgepole_pine_pct: 0,
      douglas_fir_pct: 0
    },
    current_weather: {
      temperature_c: 8.0,
      chill_hours_cumulative: 330,
      solar_radiation_mj: 11.5,
      drought_stress_index: 0.16,
      cloud_cover_pct: 25,
      wind_speed_kmh: 16
    },
    viewpoints: [
      { name: "Cascade Summit Slabs", distance_km: 3.8, elevation_m: 1249, species_focus: "Adirondack Lake Valley Colors" }
    ],
    tags: ["high peaks", "granite slabs", "adirondacks", "lakes", "moderate"],
    foliage_stage_pct: 88.0,
    peak_status: "Peak Vibrant",
    days_to_peak: 4,
    peak_window_start: "Oct 13",
    peak_window_end: "Oct 16"
  },
  {
    id: "trail-enchantments-wa",
    name: "Colchuck Lake & Aasgard Pass",
    region: "Cascade Range, Washington",
    state: "WA",
    coordinates: { latitude: 47.4975, longitude: -120.8358 },
    elevation_m: 2390,
    length_km: 14.5,
    difficulty: "Hard",
    summary: "Stunning glacial blue lake framed by jagged granite spires and rare Alpine Larches that turn incandescent canary gold every October.",
    canopy_composition: {
      alpine_larch_pct: 65.0,
      vine_maple_pct: 18.0,
      douglas_fir_pct: 12.0,
      sugar_maple_pct: 0.0,
      quaking_aspen_pct: 5.0,
      paper_birch_pct: 0,
      american_beech_pct: 0,
      red_oak_pct: 0,
      sourwood_pct: 0,
      conifer_pct: 0,
      colorado_blue_spruce_pct: 0,
      lodgepole_pine_pct: 0
    },
    current_weather: {
      temperature_c: 4.1,
      chill_hours_cumulative: 430,
      solar_radiation_mj: 10.4,
      drought_stress_index: 0.22,
      cloud_cover_pct: 40,
      wind_speed_kmh: 20
    },
    viewpoints: [
      { name: "Colchuck Lake Shoreline", distance_km: 6.8, elevation_m: 1730, species_focus: "Turquoise Waters & Golden Larch Rim" },
      { name: "Aasgard Pass Crest", distance_km: 9.4, elevation_m: 2390, species_focus: "High Plateau Golden Larch Basin" }
    ],
    tags: ["golden larch", "alpine lake", "cascades", "granite peaks", "turquoise water"],
    foliage_stage_pct: 99.1,
    peak_status: "Peak Vibrant",
    days_to_peak: 1,
    peak_window_start: "Oct 10",
    peak_window_end: "Oct 13"
  },
  {
    id: "trail-alum-cave-tn",
    name: "Alum Cave Trail to Mount LeConte",
    region: "Great Smoky Mountains, Tennessee",
    state: "TN",
    coordinates: { latitude: 35.6295, longitude: -83.4503 },
    elevation_m: 2010,
    length_km: 17.7,
    difficulty: "Hard",
    summary: "Ascend through one of the most biodiverse deciduous temperate forests in the world, passing Alum Cave Bluffs to panoramic autumn views at Cliff Tops.",
    canopy_composition: {
      sugar_maple_pct: 32.0,
      red_oak_pct: 35.0,
      american_beech_pct: 16.0,
      sourwood_pct: 11.0,
      conifer_pct: 6.0,
      quaking_aspen_pct: 0,
      paper_birch_pct: 0,
      alpine_larch_pct: 0,
      vine_maple_pct: 0,
      colorado_blue_spruce_pct: 0,
      lodgepole_pine_pct: 0,
      douglas_fir_pct: 0
    },
    current_weather: {
      temperature_c: 12.4,
      chill_hours_cumulative: 180,
      solar_radiation_mj: 13.0,
      drought_stress_index: 0.10,
      cloud_cover_pct: 20,
      wind_speed_kmh: 10
    },
    viewpoints: [
      { name: "Arch Rock", distance_km: 2.2, elevation_m: 1180, species_focus: "Yellow Birch Canopy Arch" },
      { name: "Alum Cave Bluffs", distance_km: 3.7, elevation_m: 1500, species_focus: "Valley of Fiery Maples & Crimson Oaks" },
      { name: "Cliff Tops Sunset Point", distance_km: 8.8, elevation_m: 2000, species_focus: "Endless Smoky Mountain Blue & Amber Ridges" }
    ],
    tags: ["smoky mountains", "biodiversity", "cave bluffs", "leconte", "long hike"],
    foliage_stage_pct: 62.5,
    peak_status: "Approaching Peak",
    days_to_peak: 9,
    peak_window_start: "Oct 19",
    peak_window_end: "Oct 22"
  },
  {
    id: "trail-lake-of-the-clouds-mi",
    name: "Escarpment Trail at Lake of the Clouds",
    region: "Porcupine Mountains, Michigan",
    state: "MI",
    coordinates: { latitude: 46.8042, longitude: -89.7578 },
    elevation_m: 435,
    length_km: 6.9,
    difficulty: "Moderate",
    summary: "Cliffside trail looking down into the vast old-growth maple-hemlock forest surrounding the emerald Lake of the Clouds in Michigan's remote Upper Peninsula.",
    canopy_composition: {
      sugar_maple_pct: 52.0,
      red_oak_pct: 20.0,
      paper_birch_pct: 16.0,
      american_beech_pct: 8.0,
      conifer_pct: 4.0,
      quaking_aspen_pct: 0,
      alpine_larch_pct: 0,
      sourwood_pct: 0,
      vine_maple_pct: 0,
      colorado_blue_spruce_pct: 0,
      lodgepole_pine_pct: 0,
      douglas_fir_pct: 0
    },
    current_weather: {
      temperature_c: 6.5,
      chill_hours_cumulative: 360,
      solar_radiation_mj: 10.8,
      drought_stress_index: 0.14,
      cloud_cover_pct: 45,
      wind_speed_kmh: 19
    },
    viewpoints: [
      { name: "Lake of the Clouds Escarpment Overlook", distance_km: 0.4, elevation_m: 410, species_focus: "Vast Carpet of Old Growth Amber Maples" },
      { name: "Cuyahoga Peak Ridge", distance_km: 3.1, elevation_m: 435, species_focus: "Carp River Valley & Horizon Colors" }
    ],
    tags: ["upper peninsula", "old growth", "lake of the clouds", "escarpment", "midwest gem"],
    foliage_stage_pct: 95.8,
    peak_status: "Peak Vibrant",
    days_to_peak: 2,
    peak_window_start: "Oct 11",
    peak_window_end: "Oct 14"
  }
];
