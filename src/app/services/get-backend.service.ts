import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../interfaces/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetBackendService {

  constructor(private http: HttpClient) { }


  getRegistros():Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/registros')

  }

  getIngresos():Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/ingresos')

  }

  getGraf1():Observable<any> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/graf1')

  }
}
