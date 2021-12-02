import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../interfaces/cliente';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetBackendService {

  datoPost: any;
  private datosPost$ = new Subject<any>();

  constructor(private http: HttpClient) { }

  datosPost(datos: any) {
    this.datoPost = datos;
    console.log('datosPost: ', this.datoPost)
    this.postGraf2()
    this.datosPost$.next(datos)
  }


  getRegistros(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/registros')

  }

  getIngresos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/ingresos')

  }

  getGraf1(): Observable<any> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/graf1')
  }

  postGraf2(): Observable<any> {
    return this.http.post<any>('http://app.remicos.com.co:8081/api/graf2', this.datoPost)
  }
}
