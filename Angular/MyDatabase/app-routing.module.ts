import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/common/home/home.component';
import { EmployeeViewComponent } from './components/employee/employee-view/employee-view.component';
import { EmployeeCreateComponent } from './components/employee/employee-create/employee-create.component';
import { EmployeeEditComponent } from './components/employee/employee-edit/employee-edit.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'home', component:HomeComponent},
  {path:'employees', component:EmployeeViewComponent},
  {path:'employee-add', component:EmployeeCreateComponent},
  {path:'employee-edit/:id', component:EmployeeEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
