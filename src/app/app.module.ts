import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgDockerizeModule, NG_DOCKERIZE_OPTIONS } from '@lime.it/ng-dockerize';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgDockerizeModule
  ],
  providers: [
    {provide:NG_DOCKERIZE_OPTIONS, useValue:{environment:environment, debug:{production:false, environment:"test"}}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
