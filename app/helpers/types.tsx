// interfaces for JSON data from strava

export interface Athlete {
    id: number;
    resource_state: number;
}

export interface Map {
    id: string;
    summary_polyline: string;
    resource_state: number;
}

export interface Activity {
    resource_state: number;
    athlete: Athlete;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    sport_type: string;
    workout_type: number | null;
    id: number;
    start_date: string;
    start_date_local: string;
    timezone: string;
    kudos_count: number;
    comment_count: number;
    athlete_count: number;
    photo_count: number;
    map: Map;
    average_speed: number;
    max_speed: number;
    average_heartrate: number;
    max_heartrate: number;
}