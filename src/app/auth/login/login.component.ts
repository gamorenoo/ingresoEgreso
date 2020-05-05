import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  loginUsuario(){
    if ( this.loginForm.invalid ) { return; }
    this.Loading("open");
    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password )
      .then( credenciales => {
        console.log( credenciales );
        this.Loading("close");
        this.router.navigate(['/']);
      })
      .catch( err => {
        //this.Loading("close");
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
