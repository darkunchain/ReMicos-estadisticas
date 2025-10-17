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
    //return this.http.get<Cliente[]>('http://localhost:3000/api/registros')
    return this.http.get<Cliente[]>('/api/registros')

  }

  getLocal(): Observable<any> {
    //return this.http.get<any>('http://localhost:3000/api/registros')
    return this.http.get<any>('/api/registros')

  }

  getIngresos(): Observable<Cliente[]> {
    //return this.http.get<Cliente[]>('http://localhost:3000/api/ingresos')
    return this.http.get<Cliente[]>('/api/ingresos')

  }

  getGraf1(): Observable<any> {
    //return this.http.get<Cliente[]>('http://localhost:3000/api/graf1')
    return this.http.get<Cliente[]>('/api/graf1')
  }

  postGraf2(dato:any): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    //return this.http.post<any>('http://localhost:3000/api/graf2',
    return this.http.post<any>('/api/graf2',
    {anio: dato[0], mes: dato[1]}, options)
  }

  postGrafAnual(year: number): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    //return this.http.post<any>('http://localhost:3000/api/grafAnual', { year: year }, options);
    return this.http.post<any>('/api/grafAnual', { year: year }, options);
  }


  postGrafMes(month: number): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    //return this.http.post<any>('http://localhost:3000/api/grafMes', { month: month }, options);
    return this.http.post<any>('/api/grafMes', { month: month }, options);
  }

  postGrafSeg(dato:any): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    //return this.http.post<any>('http://localhost:3000/api/grafseg',
    return this.http.post<any>('/api/grafseg',
    {anio: dato[0], mes: dato[1]}, options)
  }

  postGrafSegAnual(year: number): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    //return this.http.post<any>('http://localhost:3000/api/grafSegAnual', { year: year }, options);
    return this.http.post<any>('/api/grafSegAnual', { year: year }, options);
  }

  postGrafSegMes(month: number): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    //return this.http.post<any>('http://localhost:3000/api/grafSegMes', { month: month }, options);
    return this.http.post<any>('/api/grafSegMes', { month: month }, options);
  }
}

