import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../../../models/employee';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeService } from '../../../services/employee.service';
import { NotifyService } from '../../../services/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { Gender } from '../../../models/app-constants';
import { QualificationDialogComponent } from '../../common/qualification-dialog/qualification-dialog.component';
import { ConfirmDeleteComponent } from '../../common/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.css'
})
export class EmployeeViewComponent implements OnInit {
  imgPath = 'http://localhost:5129/Pictures';
  employees:Employee[] =[];
  dataSource:MatTableDataSource<Employee> = new MatTableDataSource(this.employees);
  columns=[ 'picture','employeeName', 'gender', 'joiningDate', 'salary', 'isaCurrentEmployee','qualifications', 'actions'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    private employeeSrv:EmployeeService,
    private notifySrv:NotifyService,
    private matDialog:MatDialog
  ){}
  getGender(v:number){
    return Gender[v];
  }
  showQualification(id:number){
    this.matDialog.open(QualificationDialogComponent, {
      data:{id:id}
    })
  }
  deleteEmployee(data:Employee){
    this.matDialog.open(ConfirmDeleteComponent, {
      "width":"350px"

    }).afterClosed()
    .subscribe({
      next: result=>{
        if(result) {
          this.employeeSrv.delete(<number>data.employeeId)
          .subscribe({
            next: r=>{
              this.dataSource.data = this.dataSource.data.filter(x=> x.employeeId != data.employeeId);
            }
          })
        }
      }
    })
  }
  ngOnInit(): void {
    this.employeeSrv.getAll()
    .subscribe({
      next: r=>{
        this.employees=r;
        console.log(this.employees)
        this.dataSource.data = this.employees;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this.notifySrv.message("Failed to load Employee", "DISMISS");
        console.log(err.message | err);
      }
    })
  }
}
