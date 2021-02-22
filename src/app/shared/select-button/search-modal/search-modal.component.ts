import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';
import { Product } from 'src/app/core/_models/product';
import { Transceiver } from '../../../core/_models/transceiver';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit {
  @Input() modal: Components.IonModal;
  @Input() type: string;
  @Input() objects: Transceiver[] | Product[];
  public filteredTransceivers: Transceiver[];
  public filteredProducts: Product[];
  public filteredObjects: Transceiver[] | Product[];
  public loadedObjects: Transceiver[] | Product[];
  public length: number = 20;

  constructor() { }

  ngOnInit() {
    this.filteredObjects = this.objects;
    this.loadedObjects = this.filteredObjects.slice(0, this.length);
  }

  onClose() {
    this.modal.dismiss();
  }

  public doInfinite(event) {
    this.length += 20;
    this.loadedObjects = this.filteredObjects.slice(0, this.length);
    event.target.complete();
  }

  public async filter(event) {
    const searchTerm = event.srcElement.value;

    switch(this.type) {
      case "Transceiver": {
        this.filteredTransceivers = this.objects;
        if (searchTerm) {
          this.filteredTransceivers = this.filteredTransceivers.filter(currentObject => {
            if (currentObject.serialNumber && searchTerm) {
              return (currentObject.serialNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
            }
          })
        }
        this.filteredObjects = this.filteredTransceivers;
        break;
      }
      case "Product": {
        this.filteredProducts = this.objects;
        if (searchTerm) {
          this.filteredProducts = this.filteredProducts.filter(currentObject => {
            if (currentObject.name && searchTerm) {
              if (currentObject.supplierNumber) {
                return (currentObject.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || currentObject.supplierNumber.indexOf(searchTerm) > -1);
              }
            }
          })
        }
        this.filteredObjects = this.filteredProducts;
        break;
      }
    }
    this.loadedObjects = this.filteredObjects.slice(0, this.length);
  }

  public selectObject(object: Transceiver | Product) {
    this.modal.dismiss(object);
  }
}
