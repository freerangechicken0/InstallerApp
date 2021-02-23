import { Hazard } from "./hazard";

export interface HealthAndSafety {
    timeStarted?: number;
    hazards?: Hazard[];
    customHazards?: Hazard[];
    signature?: string;
}