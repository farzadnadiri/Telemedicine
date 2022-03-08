import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  @Output() user;

  constructor(public authService: AuthService) {
    this.user = authService.currentUser;
  }

  ngOnInit(): void {
  }

}
