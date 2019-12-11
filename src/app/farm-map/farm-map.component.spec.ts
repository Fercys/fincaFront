import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmMapComponent } from './farm-map.component';

describe('FarmMapComponent', () => {
  let component: FarmMapComponent;
  let fixture: ComponentFixture<FarmMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
