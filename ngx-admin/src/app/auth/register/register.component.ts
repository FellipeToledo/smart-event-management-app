import { Component, OnInit } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends NbRegisterComponent {
}
