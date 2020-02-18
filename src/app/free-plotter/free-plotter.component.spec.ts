import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreePlotterComponent } from './free-plotter.component';

describe('FreePlotterComponent', () => {
  let component: FreePlotterComponent;
  let fixture: ComponentFixture<FreePlotterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreePlotterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreePlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
