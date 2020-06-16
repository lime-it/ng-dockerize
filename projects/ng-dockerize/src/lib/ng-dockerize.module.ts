import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EnvironmentService } from './environment.service';

export function initApp(env:EnvironmentService) {
  const result = () => env.initialize();
  return result;
}

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initApp, multi: true, deps: [EnvironmentService] },
  ]
})
export class NgDockerizeModule { }
