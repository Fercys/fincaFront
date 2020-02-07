import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { FarmsComponent } from '../../farms/farms.component';
import { FarmMapComponent } from '../../farm-map/farm-map.component';
import { NgxLoadingModule } from 'ngx-loading';
import {MatDialogModule} from '@angular/material/dialog';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
import { ClientComponent } from 'app/client/client.component';
import { FarmClientComponent } from 'app/farm-client/farm-client.component';
import { SafePipePipe } from 'app/pipe/safe-pipe.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FarmMapPolygonComponent } from 'app/farm-map-polygon/farm-map-polygon.component';
import { DialogMessage } from 'app/farm-map/farm-map.component'
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
    MatDialogModule,
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
    ClientComponent,
    FarmClientComponent,
    SafePipePipe,
    FarmMapPolygonComponent,
    DialogMessage
  ],
  entryComponents:[
    DialogMessage
  ]
})

export class AdminLayoutModule {}
