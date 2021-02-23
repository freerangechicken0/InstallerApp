import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { Transceiver } from '../../core/_models/transceiver';
import { Product } from 'src/app/core/_models/product';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-select-button',
  templateUrl: './select-button.component.html',
  styleUrls: ['./select-button.component.scss'],
})
export class SelectButtonComponent implements OnInit {
  @Input() type: string;
  @Input() selectedObject: Transceiver | Product;
  @Input() info: boolean;
  @Output() objectSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() { }

  public async openObjectSearch() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        type: this.type
      },
      mode: 'md'
    });

    modal.onDidDismiss()
      .then((data) => {
        if (data?.data) {
          this.selectedObject = data.data;
          this.objectSelected.emit(this.selectedObject);
        }
      });

    return await modal.present();
  }

  public async openInfoModal() {
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      componentProps: {
        type: this.type,
        transceiver: this.selectedObject
      },
      mode: 'md'
    });

    return await modal.present();
  }

}
