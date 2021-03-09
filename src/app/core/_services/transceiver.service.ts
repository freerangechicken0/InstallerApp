import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transceiver } from '../_models/transceiver';
import { TRANSCEIVERS, TRANSCEIVER_BOOT_DATA, TRANSCEIVER_CELL_DATA, TRANSCEIVER_DATA } from './data';

@Injectable({
  providedIn: 'root'
})
export class TransceiverService {
  public transceivers: BehaviorSubject<Transceiver[]> = new BehaviorSubject([]);
  public page: number = 1;
  public filter: string = null;
  public transceiverData: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public key: string = "";
  public sort: string = "";
  public boot: BehaviorSubject<string> = new BehaviorSubject(null);
  public cell: BehaviorSubject<{ rssi: number, date: string }> = new BehaviorSubject(null);

  constructor(
    private httpClient: HttpClient
  ) { }

  public getTransceiver(transceiverId: number): Transceiver {
    return TRANSCEIVERS.find((transceiver) => (transceiver.id === transceiverId));
  }

  public getAllTransceivers(): void {
    // if (this.filter) {
    //   this.page = 1;
    // }
    // this.httpClient.get<{ data: Transceiver[] }>(this.baseUrl + "transceivers", { params: { include: "sensors", perPage: "30", page: this.page.toString() } }).subscribe((trans) => {
    //   if (this.filter) {
    //     this.filter = null;
    //     this.transceivers.next(trans.data);
    //   }
    //   else {
    //     this.transceivers.next(this.transceivers.value.concat(trans.data));
    //   }
    //   this.page++;
    // });
    this.transceivers.next(TRANSCEIVERS);
  }

  public getFilteredTransceivers(filter: string): void {
    // if (!this.filter || this.filter !== filter) {
    //   this.page = 1;
    // }
    // this.httpClient.get<{ data: Transceiver[] }>(this.baseUrl + "transceivers", { params: { include: "sensors", "filter[serialNumber]": filter, perPage: "30", page: this.page.toString() } }).subscribe((trans) => {
    //   if (!this.filter || this.filter !== filter) {
    //     this.filter = filter;
    //     if (trans.data.length) {
    //       this.transceivers.next(trans.data);
    //     }
    //     else {
    //       if (this.page === 1) {
    //         this.transceivers.next([null]);
    //       }
    //     }
    //   }
    //   else {
    //     this.transceivers.next(this.transceivers.value.concat(trans.data));
    //   }
    //   this.page++;
    // });
    const arr = TRANSCEIVERS.filter((transceiver) => (transceiver.serialNumber.includes(filter)));
    this.transceivers.next(arr.length ? arr : [null]);
  }

  public loadMore(): void {
    if (this.filter) {
      this.getFilteredTransceivers(this.filter);
    }
    else {
      this.getAllTransceivers();
    }
  }

  public getTransceiverData(transceiverId: number, filter: string): void {
    if (filter === "boot") {
      this.boot.next(TRANSCEIVER_BOOT_DATA[0].date);
    }
    else if (filter === "cell") {
      this.cell.next({ rssi: TRANSCEIVER_CELL_DATA[0].data.rssi, date: TRANSCEIVER_CELL_DATA[0].date })
    }
    else {
      this.transceiverData.next(TRANSCEIVER_DATA);
    }
  }
}
