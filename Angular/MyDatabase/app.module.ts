import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavBarComponent } from './components/common/nav-bar/nav-bar.component';

import { HomeComponent } from './components/common/home/home.component';
import { QualificationDialogComponent } from './components/common/qualification-dialog/qualification-dialog.component';
import { ConfirmDeleteComponent } from './components/common/confirm-delete/confirm-delete.component';
import { MatImportModule } from './modules/mat-import/mat-import.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeService } from './services/employee.service';
import { NotifyService } from './services/notify.service';
import { EmployeeViewComponent } from './components/employee/employee-view/employee-view.component';
import { EmployeeCreateComponent } from './components/employee/employee-create/employee-create.component';
import { EmployeeEditComponent } from './components/employee/employee-edit/employee-edit.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    QualificationDialogComponent,
    ConfirmDeleteComponent,
    EmployeeViewComponent,
    EmployeeCreateComponent,
    EmployeeEditComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatImportModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ],
  providers: [
    provideAnimationsAsync(),
    HttpClient,
    DatePipe,
    EmployeeService,
    NotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
