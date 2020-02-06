import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductComponent, DialogOverviewExampleDialog, DialogEdit } from './product/product.component';

// Material import
import { MatCardModule, MatButtonModule, MatGridListModule, MatCheckboxModule, MatDialogModule, MatInputModule, MatTooltipModule } from '@angular/material';

// Form reactive
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    DialogOverviewExampleDialog,
    DialogEdit
  ],
  entryComponents: [
    DialogOverviewExampleDialog,
    DialogEdit
  ],
  imports: [
    // invidual module
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,

    // form
    FormsModule,
    ReactiveFormsModule,

    // system module ...
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
