import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais } from '../interface/pais';
import { PaisSmall } from '../interface/paisSmall';


@Injectable({
  providedIn: 'root'
})
export class PaisServiceService {
  private  baseUrl:string= 'https://restcountries.com/v3.1';
  paises:PaisSmall[]=[];
  private _regiones:string[] =['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(){
    return [...this._regiones];
  }
  constructor(private http:HttpClient) {


  }
  getPaisesxRegion(region:string):Observable<PaisSmall[]>{
    return this.http.get<PaisSmall[]>(this.baseUrl+ '/region/'+region+'?fields=cca3,name');
  }

  getPaisesxCodigo(codigo:string):Observable<Pais[] | null> {
    console.log('Codigo:'+codigo);
    if(!codigo){
      return of(null)
    }
    const ruta:string = this.baseUrl+ '/alpha/'+codigo;
    console.log('ruta:'+ruta);
    return this.http.get<Pais[]>(ruta);
  }

  getPaisesxCodigosSmall(codigo:string):Observable<PaisSmall> {
    const url= this.baseUrl+'/alpha/'+codigo+'?fields=cca3,name';
    return this.http.get<PaisSmall>(url);
  }
  getPaisesxCodigos(borders:string[]):Observable<PaisSmall[]> {
    console.log("entre a validacion borders");
    if(!borders){
      console.log("entre a validacion borders");
      return of([])
    }
    const peticiones: Observable<PaisSmall>[] =[];
    borders.forEach(  codigo => {
      const peticion=this.getPaisesxCodigosSmall(codigo);
      peticiones.push(peticion);
    })
    
    return  combineLatest(peticiones);

  }

  
}
