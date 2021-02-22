import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transceiver } from '../_models/transceiver';

@Injectable({
  providedIn: 'root'
})
export class TransceiverService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllTransceivers(): Observable<{ data: Transceiver[] }> {
    return this.httpClient.get<{ data: Transceiver[]; }>(this.baseUrl + "transceivers", { params: { include: "sensors", perPage: "1000000" } });
  }

  public getTransceiverData(transceiverId: number): Observable<{ data: any[] }> {
    return this.httpClient.get<{ data: any[]; }>(this.baseUrl + "transceivers/" + transceiverId + "/data");
  }

  public rebootTransceiver(transceiverId: number): Observable<{ data: boolean}> {
    return this.httpClient.get<{ data: boolean; }>(this.baseUrl + "transceivers/" + transceiverId + "/reboot");
  }
}
