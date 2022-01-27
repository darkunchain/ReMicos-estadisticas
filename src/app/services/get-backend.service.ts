import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../interfaces/cliente';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetBackendService {

  datoPost: any;
  private datosPost$ = new Subject<any>();
  errorMessage: any;
  ingresos : any

  constructor(private http: HttpClient) { }

  /* datosPost(datos: any) {
    this.datoPost = datos;
    let retorno = this.postGraf2().subscribe(resp => {
      return this.ingresos = resp
    })
    console.log('retorno: ', retorno)
    this.datosPost$.next(datos)
  }
 */

  getRegistros(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/registros')

  }

  getLocal(): Observable<any> {
    return this.http.get<any>('http://192.168.20.10:8081/api/registros')

  }

  getIngresos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/ingresos')

  }

  getGraf1(): Observable<any> {
    return this.http.get<Cliente[]>('http://app.remicos.com.co:8081/api/graf1')
  }

  postGraf2(dato:any): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    return this.http.post<any>('http://app.remicos.com.co:8081/api/graf2',
    {anio: dato[0], mes: dato[1]}, options)
  }
}
