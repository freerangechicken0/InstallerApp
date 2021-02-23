import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  public async createToast(message: string, color: string = "") {
    const toast = await this.toastController.create({
      message,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ],
      duration: 5000,
      color,
      cssClass: "toast"
    });
    return await toast.present();
  }

  public errorToast(message: string): void {
    this.createToast(message, 'danger');
  }

  public successToast(message: string): void {
    this.createToast(message, 'success');
  }
}
