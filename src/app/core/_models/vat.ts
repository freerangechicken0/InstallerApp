import { Transceiver } from "./transceiver";

export interface Vat {
    alertHcpOffset?: string;
    alertInletTooWarm?: string;
    alertMilkTooCold?: string;
    calibratedAt?: string;
    createdAt?: string;
    deletedAt?: string;
    dryOff?: number;
    emptyDistance?: number;
    formula?: string;
    height?: number;
    id?: number;
    label?: string;
    model?: string;
    productId?: number;
    siteId?: number;
    size?: number;
    sizeString?: string;
    state?: string;
    stirrerThresh?: number;
    transceiver?: Transceiver;
    transceiverId?: number;
    updatedAt?: string;
    vatOffset?: number;
    withholdData?: number;
}
