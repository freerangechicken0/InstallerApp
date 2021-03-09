import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Components } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/_models/product';
import { ProductService } from 'src/app/core/_services/product.service';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';
import { Transceiver } from '../../../core/_models/transceiver';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit {
  @ViewChild('search') searchBar;

  @Input() modal: Components.IonModal;
  @Input() type: string;
  public objects: Transceiver[] | Product[];

  public prodSub: Subscription;
  public tranSub: Subscription;

  constructor(
    private transceiverService: TransceiverService,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.searchBar.nativeElement.querySelector('input')) {
        this.searchBar.nativeElement.querySelector('input').focus();
      }
    }, 750);
    switch (this.type) {
      case "Product": {
        this.prodSub = this.productService.products.subscribe((prods) => {
          this.objects = prods;
        });
        if (!this.objects || !this.objects.length || (this.objects.length === 1 && this.objects[0] === null)) {
          this.productService.getAllProducts();
        }
        break;
      }
      case "Transceiver": {
        this.tranSub = this.transceiverService.transceivers.subscribe((trans) => {
          this.objects = trans;
        });
        if (!this.objects || !this.objects.length || (this.objects.length === 1 && this.objects[0] === null)) {
          this.transceiverService.getAllTransceivers();
        }
        break;
      }
    }
  }

  public onClose(): void {
    this.modal.dismiss();
  }

  ngOnDestroy() {
    this.prodSub?.unsubscribe();
    this.tranSub?.unsubscribe();
  }

  public doInfinite(event): void {
    switch (this.type) {
      case "Product": {
        this.productService.loadMore();
        break;
      }
      case "Transceiver": {
        this.transceiverService.loadMore();
        break;
      }
    }
    event?.target.complete();
  }

  public filter(event): void {
    const searchTerm = event.srcElement.value;
    switch (this.type) {
      case "Product": {
        if (searchTerm) {
          this.productService.getFilteredProducts(searchTerm);
        }
        else {
          this.productService.getAllProducts();
        }
        break;
      }
      case "Transceiver": {
        if (searchTerm) {
          this.transceiverService.getFilteredTransceivers(searchTerm);
        }
        else {
          this.transceiverService.getAllTransceivers();
        }
        break;
      }
    }
  }

  public selectObject(object: Transceiver | Product): void {
    this.modal.dismiss(object);
  }
}
