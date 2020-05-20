import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilAnalysisIosComponent } from './soil-analysis-ios.component';

describe('SoilAnalysisIosComponent', () => {
  let component: SoilAnalysisIosComponent;
  let fixture: ComponentFixture<SoilAnalysisIosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoilAnalysisIosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoilAnalysisIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
