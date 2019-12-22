import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmClientComponent } from './farm-client.component';

describe('FarmClientComponent', () => {
  let component: FarmClientComponent;
  let fixture: ComponentFixture<FarmClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
