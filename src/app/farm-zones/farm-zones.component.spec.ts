import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmZonesComponent } from './farm-zones.component';

describe('FarmZonesComponent', () => {
  let component: FarmZonesComponent;
  let fixture: ComponentFixture<FarmZonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmZonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
