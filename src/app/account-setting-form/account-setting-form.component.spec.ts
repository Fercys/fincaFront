import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingFormComponent } from './account-setting-form.component';

describe('AccountSettingFormComponent', () => {
  let component: AccountSettingFormComponent;
  let fixture: ComponentFixture<AccountSettingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
