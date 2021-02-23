import { Job } from './job';
import { Transceiver } from './transceiver';
import { Vat } from './vat';

export interface Product {
    billingEnabled?: number;
    cancelledAt?: string;
    createdAt?: string;
    deletedAt?: string;
    description?: string;
    distributorId?: string;
    faultDate?: string;
    faultStatus?: string;
    faultTypes?: string;
    fonterraCaseId?: string;
    fonterraConfig?: {};
    fssRegion?: string;
    id?: number;
    installedAt?: string;
    lastCalibratedAt?: string;
    liveAt?: string;
    milkCompanyName?: string;
    name?: string;
    notes?: string;
    orgId?: number;
    plan?: string;
    siteId?: number;
    status?: string;
    supplier?: string;
    supplierDisplay?: string;
    supplierNumber?: string;
    transceiverId?: number;
    transceivers?: Transceiver[];
    type?: string;
    updatedAt?: string;
    vats?: Array<Vat>;
    job?: Job;
}