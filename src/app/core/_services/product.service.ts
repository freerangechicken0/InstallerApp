import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://api.uat.milk.levno.com/api/';

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllProducts(): Observable<{data: Product[]}> {
    return this.httpClient.get<{data: Product[]}>(this.baseUrl + "products", {params: {include: "vats,vats.transceiver", perPage: "1000000"}});
  }

  public assignSensorsToProduct(productId: number, data: any): Observable<{data: Product}> {
    return this.httpClient.post<{data: Product}>(this.baseUrl + "products/" + productId + "/assignSensors", {data});
  }
}
