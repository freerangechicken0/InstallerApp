import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../_models/product';
import { PRODUCTS } from './data'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public products: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public page: number = 1;
  public filter: string = null;

  constructor() { }

  public getAllProducts(): void {
    // if (this.filter) {
    //   this.page = 1;
    // }
    // this.httpClient.get<{ data: Product[] }>(this.baseUrl + "products", { params: { "filter[type]": "milk", include: "vats,transceivers,transceivers.sensors", perPage: "30", page: this.page.toString() } }).subscribe((prods) => {
    //   if (this.filter) {
    //     this.filter = null;
    //     this.products.next(prods.data);
    //   }
    //   else {
    //     this.products.next(this.products.value.concat(prods.data));
    //   }
    //   this.page++;
    // });
    this.products.next(PRODUCTS);
  }

  public getFilteredProducts(filter: string): void {
    // if (!this.filter || this.filter !== filter) {
    //   this.page = 1;
    // }
    // this.httpClient.get<{ data: Product[] }>(this.baseUrl + "products", { params: { "filter[type]": "milk", "filter[name]": filter, include: "vats,transceivers,transceivers.sensors", perPage: "30", page: this.page.toString() } }).subscribe((data) => {
    //   if (!this.filter || this.filter !== filter) {
    //     this.filter = filter;
    //     if (data.data.length) {
    //       this.products.next(data.data);
    //     }
    //     else {
    //       if (this.page === 1) {
    //         this.products.next([null]);
    //       }
    //     }
    //   }
    //   else {
    //     this.products.next(this.products.value.concat(data.data));
    //   }
    //   this.page++;
    // });
    const arr = PRODUCTS.filter((product) => (product.name.includes(filter)));
    this.products.next(arr.length ? arr : [null]);
  }

  public loadMore(): void {
    if (this.filter) {
      this.getFilteredProducts(this.filter);
    }
    else {
      this.getAllProducts();
    }
  }
}
