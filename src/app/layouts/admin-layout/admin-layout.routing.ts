import { Routes } from '@angular/router';

import { ClientComponent } from 'app/client/client.component';
import { FarmClientComponent } from 'app/farm-client/farm-client.component';
import { FarmMapPolygonComponent } from 'app/farm-map-polygon/farm-map-polygon.component';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UsersComponent } from '../../users/users.component';
import { UserFormComponent } from '../../user-form/user-form.component';
import { WeatherMonitoringComponent } from '../../weather-monitoring/weather-monitoring.component';
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
import { FreePlotterComponent } from 'app/free-plotter/free-plotter.component';
import { ConfigurationComponent } from '../../configuration/configuration.component';

import { SoilAnalysisComponent } from 'app/soil-analysis/soil-analysis.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',             component: DashboardComponent },
    { path: 'users',                 component: UsersComponent },
    { path: 'user-form',             component: UserFormComponent },    
    { path: 'user-form/:id',         component: UserFormComponent },
    { path: 'weather-monitoring',    component: WeatherMonitoringComponent },
    { path: 'user-profile',          component: UserProfileComponent },
    { path: 'report-instalacion',    component: ReportInstalationComponent },
    { path: 'configuration',         component: ConfigurationComponent },
    { path: 'table-list',            component: TableListComponent },
    { path: 'typography',            component: TypographyComponent },
    { path: 'icons',                 component: IconsComponent },
    { path: 'maps',                  component: MapsComponent },
    { path: 'notifications',         component: NotificationsComponent },
    { path: 'upgrade',               component: UpgradeComponent },
    { path: 'farms',                 component: FarmsComponent, pathMatch:  'full' },
    { path: 'farmmap/:id',           component: FarmMapComponent, pathMatch:  'full' },
    { path: 'client',                component: ClientComponent, pathMatch:  'full' },
    { path: 'client-farm/:id',       component: FarmClientComponent, pathMatch:  'full' },
    { path: 'farmpolygon/:id/:farm', component: FarmMapPolygonComponent, pathMatch:  'full' },
    { path: 'free-plotter',          component: FreePlotterComponent, pathMatch:  'full' },
    { path: 'soil-analysis',         component: SoilAnalysisComponent, pathMatch:  'full' },    
];
