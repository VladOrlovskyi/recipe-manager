import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-recipes-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './recipes-navbar.component.html',
  styleUrl: './recipes-navbar.component.scss',
})
export class RecipesNavbarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onLogout() {
    this.authService.logout();
  }
}
