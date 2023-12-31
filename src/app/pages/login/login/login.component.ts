import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthenticationHttpService, Signin} from '../../../service/authenticationHttp.service';
import {ActivatedRoute, Router} from '@angular/router';
import jwtDecode from 'jwt-decode';
import {AuthTokenService} from '../../../service/authToken.service';


@Component({
  selector: 'login-cmp',
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent {
  password: string;
  showPassword: boolean;

  constructor(private authService:AuthenticationHttpService, private router: Router, private route: ActivatedRoute,
              private authTokenService: AuthTokenService) {
    this.showPassword = undefined;
  }

  login(form: NgForm) {
    let login: Signin = {
      email: form.value.email,
      senha: form.value.senha,
    } as Signin;
    this.authService.signin(login).subscribe(
      {
        next: auth => {
          localStorage.setItem('jwtToken', auth.token);
          console.log("token: " + auth.token);

          // Decodifica o token JWT
          const decodedToken: any = jwtDecode(auth.token);

          // Acessa a informação do papel (role) do usuário
          const userRole = decodedToken.role;

          // Redireciona para a página do perfil correspondente
          this.redirectToPerfil();
        },

        error: err => {
          console.log(err);
        }
      }
    );
  }

  public redirectToPerfil(){
    if(this.authTokenService.isUserAdmin()){
      this.router.navigate(['/tutor-listar']);
    } else{
      this.router.navigate(['/tutor', this.authTokenService.getUserId()]);
    }
  }
}
