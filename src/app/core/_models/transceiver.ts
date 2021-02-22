import {Sensor} from './sensor';

export interface Transceiver {
    awsThingGroups?: string;
    batchNumber?: number; // iidk
    bootloaderVersion?: string; //idk
    bridgeConfig?: {};
    createdAt?: string;
    deletedAt?: string;
    ebVersion?: string; //idk
    firmwareVersion?: string;
    id?: number;
    imei?: string;
    mbVersion?: string; //idk
    poNumber?: number; //idk
    principalId?: string;
    sbVersion?: string; //idk
    sensors?: Array<Sensor>;
    serialNumber?: string;
    simIccid?: number;
    siteId?: number;
    status?: string;
    thingGroupName?: string;
    thingId?: string;
    type?: string;
    updatedAt?: string;    
}