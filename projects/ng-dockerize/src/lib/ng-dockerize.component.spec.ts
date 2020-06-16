import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDockerizeComponent } from './ng-dockerize.component';

describe('NgDockerizeComponent', () => {
  let component: NgDockerizeComponent;
  let fixture: ComponentFixture<NgDockerizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgDockerizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgDockerizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
