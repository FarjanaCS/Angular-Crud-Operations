import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Qualification } from '../../../models/qualification';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { NotifyService } from '../../../services/notify.service';
import { QualificationDataModel } from '../../../models/qualification-data-model';

@Component({
  selector: 'app-qualification-dialog',
  templateUrl: './qualification-dialog.component.html',
  styleUrl: './qualification-dialog.component.css'
})
export class QualificationDialogComponent implements OnInit{
  qualifications:Qualification[] =[];
  dataSource:MatTableDataSource<Qualification> = new MatTableDataSource(this.qualifications);
  columns=[ 'degree','passingYear'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:QualificationDataModel,
    private employeSrv :EmployeeService,
    private notifySrv:NotifyService
  ){}
  ngOnInit(): void {
    this.employeSrv.getQualifications(<number>this.data.id)
    .subscribe({
      next: r=>{
        console.log(r)
        this.qualifications = r;
        this.dataSource.data = this.qualifications;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this.notifySrv.message("Falied to load Employee", "DISMISS");
        console.log(err.message | err);
      }
    })
  }
}
