import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-org-header',
  templateUrl: './org-header.component.html',
  styleUrls: ['./org-header.component.scss'],
})
export class OrgHeaderComponent implements OnInit {
  @Input() title: string = "";

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToAssign() {
    this.router.navigate(['/assign']);
  }

}
