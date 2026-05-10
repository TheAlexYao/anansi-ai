export type Format = "16:9" | "9:16" | "1:1";

export type Brief = {
  product: string;
  feeling: string;
  reference: string;
  reference_weight: number;
  story_tension: number;
  human_approval: boolean;
};

export type PaletteSwatch = {
  name: string;
  hex: string;
};

export type MoodTile =
  | { kind: "image"; src: string; label: string }
  | { kind: "palette" }
  | { kind: "sketch" };

export type Mood = {
  title: string;
  subtitle: string;
  palette: PaletteSwatch[];
  themes: string[];
  tiles: MoodTile[];
};

export type Direction = {
  id: string;
  title: string;
  body: string;
  tone: string;
};

export type SceneOption = {
  id: string;
  title: string;
  src: string;
  lens: string;
  motion: string;
  duration: string;
  strength: string;
};

export type Scene = {
  id: string;
  label: string;
  time: string;
  options: SceneOption[];
};

export type QueueItem = {
  id: string;
  status: "RENDERING" | "NEEDS PICK" | "APPROVED" | "QUEUED" | "FAILED";
  progress: string;
  src: string;
  duration: string;
  video_src?: string;
};

export type Output = {
  title: string;
  subtitle: string;
  format_label: string;
  poster_lines: string[];
  poster_src: string;
  audio_label: string;
  captions: boolean;
  safe_zones: boolean;
  duration: string;
  video_src?: string;
};

export type Project = {
  id: string;
  title: string;
  format: Format;
  duration_seconds: number;
  brief: Brief;
  mood: Mood;
  directions: Direction[];
  selected_direction: string;
  tone_chips: string[];
  pacing: number;
  scenes: Scene[];
  selected_scenes: Record<string, string>;
  queue: QueueItem[];
  queue_count: number;
  model: string;
  output: Output;
  asset_drop?: {
    drive_folder: string;
    site_folder: string;
    final_output_path: string;
    final_output_url: string;
    note: string;
  };
};
