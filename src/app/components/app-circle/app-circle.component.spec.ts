import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCircleComponent } from './app-circle.component';

describe('AppCircleComponent', () => {
  let component: AppCircleComponent;
  let fixture: ComponentFixture<AppCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
