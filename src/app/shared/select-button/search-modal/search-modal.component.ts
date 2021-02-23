import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Components } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Job } from 'src/app/core/_models/job';
import { Product } from 'src/app/core/_models/product';
import { MixpanelService } from 'src/app/core/_services/mixpanel.service';
import { ProductService } from 'src/app/core/_services/product.service';
import { ToastService } from 'src/app/core/_services/toast.service';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';
import { Transceiver } from '../../../core/_models/transceiver';
import { JobSelectComponent } from './job-select/job-select.component';

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
  public jobSub: Subscription;

  constructor(
    private transceiverService: TransceiverService,
    private productService: ProductService,
    private mixpanelService: MixpanelService,
    private popoverController: PopoverController,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.mixpanelService.trackEvent("Opened " + this.type + " search");
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
    this.jobSub?.unsubscribe();
  }

  public doInfinite(event): void {
    this.mixpanelService.trackEvent("Loaded more results");
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
    this.mixpanelService.trackEvent("Searched for '" + searchTerm + "' on " + this.type + " search")
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
    if (this.type === "Product") {
      this.selectedProduct(object);
    }
    else {
      this.modal.dismiss(object);
    }
  }

  public selectedProduct(product: Product): void {
    this.productService.getJobsOnProduct(product.id).subscribe((data) => {
      if (data.data?.length) {
        this.openJobPopoverLogic(product, data.data);
      }
      else {
        this.productService.getJobsOnSite(product.siteId).subscribe((site) => {
          if (site?.simprojobs?.length) {
            this.openJobPopoverLogic(product, site.simprojobs);
          }
          else {
            this.toastService.errorToast("No jobs on this product");
          }
        });
      }
    });
  }

  public openJobPopoverLogic(product: Product, jobs: Job[]): void {
    if (jobs.length === 1) {
      this.applyJob(product, jobs[0]);
      this.modal.dismiss(product);
    }
    else {
      this.openJobPopover(product, jobs);
    }
  }

  public async openJobPopover(product: Product, jobs: Job[]): Promise<void> {
    const popover = await this.popoverController.create({
      component: JobSelectComponent,
      componentProps: {
        jobs: jobs.sort((a, b) => this.compareDates(new Date(a.updatedAt), new Date(b.updatedAt)))
      },
      mode: 'md'
    });

    popover.onDidDismiss().then((data) => {
      if (data?.data) {
        this.applyJob(product, data.data);
        this.modal.dismiss(product);
      }
    });
    return await popover.present();
  }

  public compareDates(a: Date, b: Date): number {
    if (a > b) {
      return -1;
    }
    if (a < b) {
      return 1;
    }
    return 0;
  }

  public applyJob(product: Product, job: Job): void {
    product.job = job;
  }
}
