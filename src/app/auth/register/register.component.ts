import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;
  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router  ) {  }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  crearUsuario(){
    if ( this.registroForm.invalid ) { return; }
    this.Loading("open");
    const { nombre, correo, password} = this.registroForm.value;
    this.authService.crearUsuario( nombre, correo, password )
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
