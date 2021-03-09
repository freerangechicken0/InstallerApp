import { Injectable } from '@angular/core';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: { transceiverPhotos: Photo[], vatPhotos: Photo[][] } = null;
  public noPhotos: boolean = false;

  constructor() { }

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
}
