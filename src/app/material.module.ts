import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';

import{
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
} from '@angular/material';

@NgModule({
    imports:[
        MatButtonModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatInputModule,
        MatCardModule,
        MatGridListModule,
        MatTableModule,
        MatIconModule,
        MatSortModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
    ],
    exports:[
        MatButtonModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatInputModule,
        MatCardModule,
        MatGridListModule,
        MatTableModule,
        MatIconModule,
        MatSortModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
    ]
})
export class MaterialModule {

}