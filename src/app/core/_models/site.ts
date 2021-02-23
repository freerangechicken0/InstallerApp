import { Job } from "./job";

export interface Site {
    createdAt?: string;
    deletedAt?: string;
    id: number;
    latitude?: string;
    longitude?: string;
    name?: string;
    oldlatitude?: string;
    oldlongitude?: string;
    ordId?: number;
    simproId?: number;
    simprojobs?: Job[];
    thingGroupName?: string;
    updatedAt?: string;
}