import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-login-page',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatError,
    MatInput,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['emilys', [Validators.required]],
      password: ['emilyspass', [Validators.required]],
      expiresInMins: 30,
    });
  }

  ngOnInit(): void {}

  signIn() {
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (res) => {
        this.authService.authenticateUser(res.accessToken).subscribe({
          next: (authRes) => {
            this.authService.saveToken(res.accessToken);
            this.router.navigate(['/recipes']);
          },
        });
      },
    });
  }
}
