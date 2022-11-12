import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaikkiComponent } from './kaikki.component';

describe('KaikkiComponent', () => {
  let component: KaikkiComponent;
  let fixture: ComponentFixture<KaikkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaikkiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaikkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
