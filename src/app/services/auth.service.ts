import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authAction from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore,
               private store: Store<AppState> ) { }

  initAuthListener(){
    this.auth.authState.subscribe( fbUser => {

      if( fbUser ){
        this.userSubscription = this.firestore.doc(`${ fbUser.uid }/usuario`).valueChanges()
        .subscribe( (fireStoreUser: any) => {
          const user = Usuario.fromFirebase( fireStoreUser );
          this.store.dispatch( authAction.setUser( { user } ) );
        });
      }else{
        this.userSubscription.unsubscribe();
        this.store.dispatch( authAction.unSetUser() );
      }
    });
  }

  crearUsuario( nombre: string, email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password)
    .then( ({ user }) => {
      
      const newUser = new Usuario( user.uid, nombre, user.email );

      return this.firestore.doc(`${ user.uid }/usuario`).set({ ...newUser });

    });
  }

  loginUsuario( email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }

}
