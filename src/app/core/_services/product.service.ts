import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Job } from '../_models/job';
import { Product } from '../_models/product';
import { Site } from '../_models/site';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';
  public products: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public page: number = 1;
  public filter: string = null;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllProducts(): void {
    if (this.filter) {
      this.page = 1;
    }
    this.httpClient.get<{ data: Product[] }>(this.baseUrl + "products", { params: { "filter[type]": "milk", include: "vats,transceivers,transceivers.sensors", perPage: "30", page: this.page.toString() } }).subscribe((prods) => {
      if (this.filter) {
        this.filter = null;
        this.products.next(prods.data);
      }
      else {
        this.products.next(this.products.value.concat(prods.data));
      }
      this.page++;
    });
  }

  public getFilteredProducts(filter: string): void {
    if (!this.filter || this.filter !== filter) {
      this.page = 1;
    }
    this.httpClient.get<{ data: Product[] }>(this.baseUrl + "products", { params: { "filter[type]": "milk", "filter[name]": filter, include: "vats,transceivers,transceivers.sensors", perPage: "30", page: this.page.toString() } }).subscribe((data) => {
      if (!this.filter || this.filter !== filter) {
        this.filter = filter;
        if (data.data.length) {
          this.products.next(data.data);
        }
        else {
          if (this.page === 1) {
            this.products.next([null]);
          }
        }
      }
      else {
        this.products.next(this.products.value.concat(data.data));
      }
      this.page++;
    });
  }

  public loadMore(): void {
    if (this.filter) {
      this.getFilteredProducts(this.filter);
    }
    else {
      this.getAllProducts();
    }
  }

  public assignSensorsToProduct(productId: number, data: any): Observable<{ data: Product }> {
    return this.httpClient.post<{ data: Product }>(this.baseUrl + "products/" + productId + "/assignSensors", { data });
  }

  public getJobsOnProduct(productId: number): Observable<{ data: Job[] }> {
    return this.httpClient.get<{ data: Job[] }>(this.baseUrl + "products/" + productId + "/jobs", {});
  }

  public getJobsOnSite(siteId: number): Observable<Site> {
    return this.httpClient.get<Site>(this.baseUrl + "sites/" + siteId, { params: { include: "simprojobs" } });
  }
}
