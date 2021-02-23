import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hazard } from '../_models/hazard';
import { HealthAndSafety } from '../_models/healthAndSafety';
import { Job } from '../_models/job';
import { JobDetails } from '../_models/jobDetails';
import { TempCheck } from '../_models/tempCheck';
import { Vat } from '../_models/vat';

@Injectable({
  providedIn: 'root'
})
export class SimproService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public getJobDetails(job: Job): Observable<{ data: JobDetails }> {
    if (!job.details) {
      return this.httpClient.get<{ data: JobDetails }>(this.baseUrl + "simprojobs/" + job.id + "/details", {});
    }
    else {
      return new Observable(null);
    }
  }

  public submitNote(job: Job, healthAndSafetyData: HealthAndSafety, vats: Vat[], preTemps: TempCheck[], postTemps: TempCheck[], vatSerials: string[]): Observable<{ data: boolean }> {
    let vatInfo = this.createVatsInfo(vats, preTemps, postTemps, vatSerials);

    let healthAndSafety = JSON.parse(JSON.stringify(healthAndSafetyData));
    healthAndSafety.hazards = this.stripOptions(healthAndSafety.hazards);
    healthAndSafety.customHazards = this.stripOpens(healthAndSafety.customHazards);

    let note = { vatInfo, healthAndSafety };
    let data = { note: JSON.stringify(note) };
    return this.httpClient.post<{ data: boolean }>(this.baseUrl + "simprojobs/" + job.id + "/notes", { data });
  }

  public stripOptions(hazards: Hazard[]): Hazard[] {
    return hazards.map((hazard) => ({ name: hazard.name, identified: hazard.identified }));
  }

  public stripOpens(hazards: Hazard[]): Hazard[] {
    return hazards.map((hazard) => {
      let { open, ...rest } = hazard;
      return rest;
    });
  }

  public createVatsInfo(vats: Vat[], preTemps: TempCheck[], postTemps: TempCheck[], vatSerials: string[]) {
    return vats.map((vat, index) => {
      return { vatId: vat.id, preTemp: preTemps[index], postTemp: postTemps[index], serialNumber: vatSerials[index] };
    })
  }
}
