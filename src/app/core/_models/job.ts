import { JobDetails } from "./jobDetails";

export interface Job {
    createdAt?: string;
    deletedAt?: string;
    id?: number;
    productId?: number;
    simproJobId?: number;
    siteId?: number;
    updatedAt?: string;
    details?: JobDetails;
}