export interface Coordinates {
  latitude: float;
  longitude: float;
}

export type float = number;

export interface CanopyComposition {
  sugar_maple_pct: number;
  quaking_aspen_pct: number;
  red_oak_pct: number;
  american_beech_pct: number;
  paper_birch_pct: number;
  alpine_larch_pct: number;
  sourwood_pct: number;
  conifer_pct: number;
  vine_maple_pct: number;
  colorado_blue_spruce_pct: number;
  lodgepole_pine_pct: number;
  douglas_fir_pct: number;
}

export interface CurrentWeather {
  temperature_c: number;
  chill_hours_cumulative: number;
  solar_radiation_mj: number;
  drought_stress_index: number;
  cloud_cover_pct: number;
  wind_speed_kmh: number;
}

export interface Viewpoint {
  name: string;
  distance_km: number;
  elevation_m: number;
  species_focus: string;
}

export interface Trail {
  id: string;
  name: string;
  region: string;
  state: string;
  coordinates: Coordinates;
  elevation_m: number;
  length_km: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  summary: string;
  canopy_composition: CanopyComposition;
  current_weather: CurrentWeather;
  viewpoints: Viewpoint[];
  tags: string[];
  foliage_stage_pct?: number;
  peak_status?: string;
  days_to_peak?: number;
  peak_window_start?: string;
  peak_window_end?: string;
}

export interface CardCheckpoint {
  name: string;
  distance_km: number;
  elevation_m: number;
  foliage_note: string;
}

export interface PocketCardResponse {
  trail_id: string;
  trail_name: string;
  region: string;
  elevation_gain_m: number;
  total_length_km: number;
  estimated_hiking_time_hours: number;
  difficulty: string;
  foliage_status: string;
  foliage_stage_pct: number;
  primary_tree_species: string[];
  checkpoints: CardCheckpoint[];
  emergency_contacts: string[];
  field_guide_markdown: string;
  field_guide_html: string;
}

export interface AudioBriefingResponse {
  trail_id: string;
  trail_name: string;
  audio_base64?: string;
  audio_url?: string;
  audio_mime_type: string;
  duration_seconds: number;
  transcript: string;
  voice_engine: string;
}

export interface PhenologyTimelinePoint {
  date: string;
  days_from_today: number;
  chlorophyll_decay_pct: number;
  stage_pct: number;
  is_peak: boolean;
  status: string;
}

export interface TabPFNPredictionResponse {
  foliage_stage_pct: number;
  peak_status: string;
  days_to_peak: number;
  peak_window_start: string;
  peak_window_end: string;
  confidence_score: number;
  model_name: string;
}
