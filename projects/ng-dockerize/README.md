@lime.it/ng-dockerize
=============
[![Version](https://img.shields.io/npm/v/@lime.it/ng-dockerize.svg)](https://npmjs.org/package/@lime.it/ng-dockerize)
[![CircleCI](https://circleci.com/gh/lime-it/ng-dockerize/tree/master.svg?style=shield)](https://circleci.com/gh/lime-it/ng-dockerize/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@lime.it/ng-dockerize.svg)](https://npmjs.org/package/@lime.it/ng-dockerize)
[![License](https://img.shields.io/npm/l/@lime.it/ng-dockerize.svg)](https://github.com/lime-it/ng-dockerize/blob/master/package.json)

Utility library with schematics to easy set up an angular app for a container deployment with a dynamic environment variables configuration.

The library automatically set up the configuration files to create an nginx based docker image for your angular app with dynamic runtime, multi environments, configuration.
It also provides a service to access the merged compile-time and runtime-configuration and an APP_INITIALIZER to ensure it to be loaded before application start.

# How to install and use

Install through npm:

    npm install @lime.it/ng-dockerize

And then use the **init** schematic:

    ng g @lime.it/ng-dockerize:init
    
Otherwise simply add with angular-cli

    ng add @lime.it/ng-dockerize

You will find in your angular workspace two new files:
* Dockerfile: configured to build an nginx based image with contents from the *./dist/{your_app}* folder
* nginx.conf.template: configured to set up an alias for *assets/environment.json* based on the value of the environment value *APP_ENVIRONMENT*

Moreover, your app main NgModule will import the *NgDockerizeModule*.

The *NgDockerizeModule* provides a service (*EnvironmentService*) which enables to access the dynamic configuration, and an *APP_INITIALIZER* to ensure the configuration
to be loaded before the application starts.

In order to complete the setup, you must provide a value for the token *NG_DOCKERIZE_OPTIONS*, setting the current compile-time environment and optionally a debug environment.

# Example setup

**app.module.ts**

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
        // { provide:NG_DOCKERIZE_OPTIONS, useValue: { environment:environment } } // for production
        { provide:NG_DOCKERIZE_OPTIONS, useValue: { environment: environment, debug: { production: false, environment: "test" } } }
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }

**app.component.ts**

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

**app.component.html**

    Environment: <strong>{{env.environment?.environment}}</strong>


**docker commands**

    docker build -t my-dockerized-app
    docker run -d -e APP_ENVIRONMENT=staging -p 80:80 my-dockerized-app