import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HavaintoComponent } from './havainto.component';

describe('HavaintoComponent', () => {
  let component: HavaintoComponent;
  let fixture: ComponentFixture<HavaintoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HavaintoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HavaintoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
