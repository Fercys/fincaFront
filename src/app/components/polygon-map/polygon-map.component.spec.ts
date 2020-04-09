import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonMapComponent } from './polygon-map.component';

describe('PolygonMapComponent', () => {
  let component: PolygonMapComponent;
  let fixture: ComponentFixture<PolygonMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
