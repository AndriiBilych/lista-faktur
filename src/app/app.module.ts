import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { HoverElementsDirective } from './directives/hover-elements.directive';
import {MatIconModule} from "@angular/material/icon";
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { HeaderComponent } from './components/header/header.component';
import { InputFormComponent } from './components/input-form/input-form.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { TableComponent } from './components/table/table.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ShortenerPipe } from './pipes/shortener.pipe';
import { ItemsTableComponent } from './components/items-table/items-table.component';
import { ItemsControlPanelComponent } from './components/items-control-panel/items-control-panel.component';
import { ItemsHoverToolsDirective } from './directives/items-hover-tools.directive';
import { ItemsInputFormComponent } from './components/items-input-form/items-input-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HoverElementsDirective,
    ControlPanelComponent,
    HeaderComponent,
    InputFormComponent,
    ConfirmationModalComponent,
    TableComponent,
    ShortenerPipe,
    ItemsTableComponent,
    ItemsControlPanelComponent,
    ItemsHoverToolsDirective,
    ItemsInputFormComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
