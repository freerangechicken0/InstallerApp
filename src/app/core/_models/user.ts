export interface User {
    email: string;
    fuel: boolean;
    id: number;
    name: string;
    orgRoles: {
        id: number;
        name: string;
        role: string;
        roleId: number;
        supplierNumber: string;
    }[];
    phone: string;
    preferences: any; //fix
    super: boolean;
}