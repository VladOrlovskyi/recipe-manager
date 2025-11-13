import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [MatCardModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

constructor(
  private authService: AuthService,
  public router: Router,

){}


ngOnInit(): void {
  
}



  signIn(){
    this.authService.loginUser({
    username: 'emilys',
    password: 'emilyspass',
    expiresInMins: 30
    }).subscribe({
      next: (res) => {
        console.log({res});
        this.authService.authenticateUser(res.accessToken).subscribe({
          next:(authRes)=>{
            console.log({authRes});
            this.router.navigate(['/recipes'])
          }
        })
        
      }
      
    })
  }

}
