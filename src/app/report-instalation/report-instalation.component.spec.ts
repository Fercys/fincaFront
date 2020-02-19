import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInstalationComponent } from './report-instalation.component';

describe('ReportInstalationComponent', () => {
  let component: ReportInstalationComponent;
  let fixture: ComponentFixture<ReportInstalationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportInstalationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInstalationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
