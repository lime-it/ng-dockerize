import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NgDockerizeOptions {
  environment:EnvironmentLike;
  debug:EnvironmentLike;
}

export const NG_DOCKERIZE_OPTIONS = new InjectionToken<NgDockerizeOptions>("lime.it/ng-dockerize/options")

export interface EnvironmentLike {
  production:boolean;
  environment:string;
  [key:string]: any
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private readonly _environment$:BehaviorSubject<EnvironmentLike>;

  public readonly environment$:Observable<EnvironmentLike>;

  constructor(private readonly http:HttpClient, @Inject(NG_DOCKERIZE_OPTIONS) private options:NgDockerizeOptions) {
    this._environment$  = new BehaviorSubject<EnvironmentLike>({...this.options.environment});
    this.environment$ = this._environment$.asObservable();
  }

  private _initialized:boolean = false;

  private _operation:Promise<void> = null;

  public async initialize():Promise<void>{
    
    if(!this._operation){
      const op = !this.options.debug ? this.http.get<Partial<EnvironmentLike>>("assets/environment.json").toPromise() : Promise.resolve(this.options.debug);
      this._operation = op.then(env=>{
    
        this._environment$.next(this.mergeDeep({...this._environment$.getValue()}, env));
  
        this._initialized = true;
      });
    }
    
    await this._operation;
  }

  public get environment():EnvironmentLike {
    if(this._initialized)
      return this._environment$.getValue();
    else
      return null;
  }

  private isObject(item:any) {
    return (!!item && typeof item === 'object' && !Array.isArray(item));
  }

  private mergeDeep(target:any, ...sources:any[]) {
    if (!sources.length) 
      return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) 
            Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }
}