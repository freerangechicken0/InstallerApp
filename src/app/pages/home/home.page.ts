import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Product } from 'src/app/core/_models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public selectedProduct: Product = null;

  constructor(
    private router: Router,
    private menuController: MenuController,
  ) { }

  ionViewWillEnter() {
    this.menuController.enable(true);
  }

  ngOnInit() {
  }

  goToMilk(product: Product) {
    let navExtras: NavigationExtras = {
      state: {
        product: product
      }
    };
    // switch (product.type) {
        //   case 'milk': {
        //     this.router.navigate(['/assign'], navExtras);
        //     break;
        //   }
        // }
    this.router.navigate(['/assign'], navExtras);
  }

}
