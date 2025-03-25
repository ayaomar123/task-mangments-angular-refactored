import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  router = inject(Router);
  
  onLogout(){
    const confirms = confirm('Are You Sure?');
    localStorage.removeItem("AngularUserToken");
    this.router.navigateByUrl('login');
  }
}
