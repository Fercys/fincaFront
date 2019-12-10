import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmsComponent } from './farms.component';

describe('FarmsComponent', () => {
  let component: FarmsComponent;
  let fixture: ComponentFixture<FarmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
