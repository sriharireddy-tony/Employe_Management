import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOVValuesComponent } from './lov-values.component';

describe('LOVValuesComponent', () => {
  let component: LOVValuesComponent;
  let fixture: ComponentFixture<LOVValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LOVValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LOVValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
