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

  constructor(private http: HttpClient) { }

  datosPost(datos: any) {
    this.datoPost = datos;
    let retorno = this.postGraf2()
    console.log('retorno: ', retorno)
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

  postGraf2(): void {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');
    let options = { headers: httpHeaders };
    console.log('this.datoPost:',this.datoPost)
    this.http.post<any>('http://app.remicos.com.co:8081/api/graf2',
    {anio: this.datoPost[0], mes: this.datoPost[1]}, options).subscribe(data => {
        console.log('retorno de datos:', data);

      });
  }
}
