import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import * as ui from 'src/app/shered/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;
  
  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState>  ) {  }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if ( this.registroForm.invalid ) { return; }
    
    //this.Loading("open");
    
    this.store.dispatch( ui.isLoading() );
    
    const { nombre, correo, password} = this.registroForm.value;
    this.authService.crearUsuario( nombre, correo, password )
      .then( credenciales => {
        console.log( credenciales );
        //this.Loading("close");
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
  }

  Loading(mode: string){
    if(mode === "open"){
      Swal.fire({
        title: 'Procesando!',
        html: 'Espere por favor.',
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });
    }else {
      Swal.close();
    }
  }

}
