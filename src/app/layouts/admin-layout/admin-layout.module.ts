import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartsModule } from 'ng2-charts';

import { NgxLoadingModule } from 'ngx-loading';

import { SafePipePipe } from 'app/pipe/safe-pipe.pipe';
import { ClientComponent } from 'app/client/client.component';
import { DialogMessage } from 'app/farm-map/farm-map.component';
import { FarmClientComponent } from 'app/farm-client/farm-client.component';
import { FarmMapPolygonComponent } from 'app/farm-map-polygon/farm-map-polygon.component';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { FarmMapComponent } from '../../farm-map/farm-map.component';
import { FarmsComponent } from '../../farms/farms.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ReportInstalationComponent } from '../../report-instalation/report-instalation.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { FreePlotterComponent } from 'app/free-plotter/free-plotter.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgbModule,
    NgxLoadingModule.forRoot({}),
    ChartsModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    FarmsComponent,
    FarmMapComponent,
    FreePlotterComponent,
    ClientComponent,
    FarmClientComponent,
    SafePipePipe,
    FarmMapPolygonComponent,
    DialogMessage,
    ReportInstalationComponent
  ],
  entryComponents:[
    DialogMessage
  ]
})

export class AdminLayoutModule {}
