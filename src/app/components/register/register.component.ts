import { Component, inject } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 registerForm: FormGroup;
   errorMessage: string | null = null;
 
   constructor(
     private fb: FormBuilder,
     private authService: AuthService,
     private router: Router
   ) {
     this.registerForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(8)]]
     });
   }
 
   onRegister() {
     const credentials = this.registerForm.value;
     this.authService.register(credentials).subscribe({
       next: () => {
         this.router.navigate(['/login']);
       },
       error: (error) => {
    
        if (error.error.errors && error.error.errors.length > 0) {
            this.errorMessage = error.error.errors[0].description
          } else {
            alert("Error Code:"+error.error.code +"msg:" +error.error.message);
          }
       }
     });
   }

}
