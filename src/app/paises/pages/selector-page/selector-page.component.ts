import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  switchMap, tap} from "rxjs/operators";

import { PaisServiceService } from '../../services/pais-service.service';
import { PaisSmall } from '../../interface/paisSmall';
import { Pais } from '../../interface/pais';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup= this.fb.group({
    region:['', Validators.required],
    pais:     ['', Validators.required],
    frontera: ['', Validators.required]
  });
  
  //Llenar selectores
  regiones:string[]=[];
  paises:PaisSmall[]=[];
  // fronteras:string[]=[];
  fronteras:PaisSmall[]=[];
  
  
  //UI
  cargando:boolean=false;
  constructor(private fb:FormBuilder,
              private paisService:PaisServiceService ) { }

  ngOnInit(): void {
    this.regiones=this.paisService.regiones;


    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
        this.miFormulario.get('pais')?.reset();
        this.cargando=true;
       // this.paises=[];
      }),
      switchMap(region => this.paisService.getPaisesxRegion(region))
    )
    .subscribe(paises =>{
      this.paises=paises;
      this.cargando=false;
    })

    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( (_) => {
        this.fronteras=[];
        this.miFormulario.get('frontera')?.reset();
        this.cargando=true;
       // this.paises=[];
      }),
      switchMap(codigo =>this.paisService.getPaisesxCodigo(codigo) )
    )
    .subscribe( pais => {
    
      if(pais){
        this.fronteras=pais[0].borders;

      }
      this.cargando=false;
    })
      
    

  }

}
