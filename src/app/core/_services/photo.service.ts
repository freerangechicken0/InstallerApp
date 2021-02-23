import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as xml2js from 'xml2js';
import { Photo } from '../_models/photo';
import { Signature } from '../_models/signature';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';

  public photos: { transceiverPhotos: Photo[], vatPhotos: Photo[][] } = null;
  public noPhotos: boolean = false;

  constructor(
    private httpClient: HttpClient
  ) { }

  public validatePhotos(): boolean {
    if (this.noPhotos) {
      return true;
    }
    let bool = true;
    if (!this.photos ||
      !this.photos?.transceiverPhotos ||
      !this.photos?.vatPhotos) {
      bool = false;
    }
    else {
      this.photos.transceiverPhotos.forEach((photo) => {
        if (!photo || !photo.photo || !photo.vatId) {
          bool = false;
        }
      });
      this.photos.vatPhotos.forEach((vatPhotos) => {
        if (!vatPhotos) {
          bool = false;
        }
        vatPhotos.forEach((photo) => {
          if (photo.name !== "badge" && (!photo || !photo.photo || !photo.vatId)) {
            bool = false;
          }
        });
      })
    }
    return bool;
  }

  public setNoPhotos(bool: boolean): void {
    this.noPhotos = bool;
  }

  public getNoPhotos(): boolean {
    return this.noPhotos;
  }

  public storePhotos(transceiverPhotos: Photo[], vatPhotos: Photo[][]): void {
    this.photos = { transceiverPhotos, vatPhotos };
  }

  public getPhotos(): { transceiverPhotos: Photo[], vatPhotos: Photo[][] } {
    return this.photos;
  }

  public clearPhotos(): void {
    this.photos = null;
  }

  public submitPhotos(): void {
    //would be great if this actually checked if they had uploaded
    this.photos.transceiverPhotos.forEach((photo) => {
      this.sendPhoto(photo);
    });
    this.photos.vatPhotos.forEach((vatPhotos) => {
      vatPhotos.forEach((photo) => {
        this.sendPhoto(photo);
      });
    });
  }

  public sendPhoto(photo: Photo): void {
    //this is a mess pls fix if you can
    this.getSignature().subscribe((signatureData) => {
      fetch(photo.photo).then(res => res.blob()).then(blob => {
        let file = new File([blob], "test.jpeg", { type: "image/jpeg" });
        this.sendToS3(signatureData, file).subscribe((awsResponse) => {
          let location = null;
          xml2js.Parser().parseString(awsResponse, function (err, result) {
            location = result.PostResponse.Location[0];
          });
          this.informApi(location, photo.vatId).subscribe((response) => {
            if (response) {
              console.log("success");
            }
          });
        });
      });
    });
  }

  public getSignature(): Observable<{ postEndpoint: string, signature: Signature }> {
    return this.httpClient.post<{ postEndpoint: string, signature: any }>(this.baseUrl + "vats/sign/signature", {});
  }

  public sendToS3(data: { postEndpoint: string, signature: Signature }, file: File): Observable<string> {
    let formData = new FormData();
    formData.append("Content-Type", data.signature['Content-Type']);
    formData.append("acl", data.signature.acl);
    formData.append("success_action_status", data.signature.success_action_status);
    formData.append("policy", data.signature.policy);
    formData.append("X-amz-credential", data.signature['X-amz-credential']);
    formData.append("X-amz-algorithm", data.signature['X-amz-algorithm']);
    formData.append("X-amz-date", data.signature['X-amz-date']);
    formData.append("X-amz-signature", data.signature['X-amz-signature']);
    formData.append("key", data.signature.key);
    formData.append("File", file);
    return this.httpClient.post<string>("https:" + data.postEndpoint, formData, { responseType: 'text' as 'json' });
  }

  public informApi(location: string, vatId: number): Observable<{ data: string }> {
    let formData = new FormData();
    formData.append("s3ObjectLocation", location);
    formData.append("vatId", vatId.toString());
    return this.httpClient.post<{ data: string }>(this.baseUrl + "vats/s3/awsUpload", formData);
  }
}
