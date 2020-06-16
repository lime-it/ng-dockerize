import { Component } from '@angular/core';
import { EnvironmentService } from '@lime.it/ng-dockerize';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor(public env:EnvironmentService) {
    
  }
}
