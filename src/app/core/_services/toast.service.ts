import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  public async createToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ],
      duration: 5000
    });
    toast.present();
  }
}
