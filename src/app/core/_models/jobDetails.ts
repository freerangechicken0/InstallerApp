export interface JobDetails {
    completedAt?: string;
    createdAt?: string;
    description?: string;
    dueDate?: string;
    dueTime?: any; //fix
    id?: number;
    notes?: string[];
    stage?: string;
    status?: string;
    technician?: string;
    type?: string;
    exception?: string;
    headers?: {};
    original?: { errors: { path: string, message: string, value: string }[] };
}