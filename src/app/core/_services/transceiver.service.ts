import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Transceiver } from '../_models/transceiver';

@Injectable({
  providedIn: 'root'
})
export class TransceiverService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';
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

  public getTransceiver(transceiverId: number): Observable<Transceiver> {
    return this.httpClient.get<Transceiver>(this.baseUrl + "transceivers/" + transceiverId, { params: { include: "sensors" } });
  }

  public getAllTransceivers(): void {
    if (this.filter) {
      this.page = 1;
    }
    this.httpClient.get<{ data: Transceiver[] }>(this.baseUrl + "transceivers", { params: { include: "sensors", perPage: "30", page: this.page.toString() } }).subscribe((trans) => {
      if (this.filter) {
        this.filter = null;
        this.transceivers.next(trans.data);
      }
      else {
        this.transceivers.next(this.transceivers.value.concat(trans.data));
      }
      this.page++;
    });
  }

  public getFilteredTransceivers(filter: string): void {
    if (!this.filter || this.filter !== filter) {
      this.page = 1;
    }
    this.httpClient.get<{ data: Transceiver[] }>(this.baseUrl + "transceivers", { params: { include: "sensors", "filter[serialNumber]": filter, perPage: "30", page: this.page.toString() } }).subscribe((trans) => {
      if (!this.filter || this.filter !== filter) {
        this.filter = filter;
        if (trans.data.length) {
          this.transceivers.next(trans.data);
        }
        else {
          if (this.page === 1) {
            this.transceivers.next([null]);
          }
        }
      }
      else {
        this.transceivers.next(this.transceivers.value.concat(trans.data));
      }
      this.page++;
    });
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
    if (filter) {
      this.httpClient.get<{ data: any[] }>(this.baseUrl + "transceivers/" + transceiverId + "/data", { params: { filter: filter } }).subscribe((entry) => {
        if (entry.data.length) {
          if (filter === "boot") {
            this.boot.next(entry.data[0].date);
          }
          else if (filter === "cell") {
            this.cell.next({ rssi: entry.data[0].data.rssi, date: entry.data[0].date });
          }
        }
      });
    }
    else {
      //three baked in calls to have 90 entries
      this.key = "";
      this.sort = "";
      this.transceiverData = new BehaviorSubject([]);
      this.httpClient.get<{ data: any[], links: any }>(this.baseUrl + "transceivers/" + transceiverId + "/data", { params: { key: this.key, sortKey: this.sort } }).subscribe((data) => {
        if (data.data && data.data.length) {
          this.key = data.links.nextKey;
          this.sort = data.links.nextSort;
          this.transceiverData.next(this.transceiverData.value.concat(data.data));
          this.httpClient.get<{ data: any[], links: any }>(this.baseUrl + "transceivers/" + transceiverId + "/data", { params: { key: this.key, sortKey: this.sort } }).subscribe((data) => {
            if (data.data && data.data.length) {
              this.key = data.links.nextKey;
              this.sort = data.links.nextSort;
              this.transceiverData.next(this.transceiverData.value.concat(data.data));
              this.httpClient.get<{ data: any[], links: any }>(this.baseUrl + "transceivers/" + transceiverId + "/data", { params: { key: this.key, sortKey: this.sort } }).subscribe((data) => {
                if (data.data && data.data.length) {
                  this.key = data.links.nextKey;
                  this.sort = data.links.nextSort;
                  this.transceiverData.next(this.transceiverData.value.concat(data.data));
                }
              });
            }
          });
        }
      });
    }
  }

  public rebootTransceiver(transceiverId: number): Observable<{ data: boolean }> {
    return this.httpClient.get<{ data: boolean; }>(this.baseUrl + "transceivers/" + transceiverId + "/reboot");
  }
}
