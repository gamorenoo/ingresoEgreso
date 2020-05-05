import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import * as ui from 'src/app/shered/ui.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState> ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
                          .subscribe( ui => { 
                            this.cargando = ui.isLoading;
                          })
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  loginUsuario(){
    if ( this.loginForm.invalid ) { return; }
    
    this.store.dispatch( ui.isLoading() );

    //this.Loading("open");

    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password )
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
