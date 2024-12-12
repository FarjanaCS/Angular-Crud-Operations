import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { NotifyService } from '../../../services/notify.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Qualification } from '../../../models/qualification';
import { Gender } from '../../../models/app-constants';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css'
})
export class EmployeeCreateComponent implements OnInit{
  employee:Employee = {};
  typeOptions:{label:string, value:number}[] =[];
  picture:File = null!;
  employeeForm:FormGroup = new FormGroup({
    employeeName: new FormControl('', Validators.required),
    gender: new FormControl(undefined, Validators.required),
    joiningDate: new FormControl(undefined, Validators.required),
    salary:new FormControl(undefined, Validators.required),
    isaCurrentEmployee:new FormControl(undefined),
    picture: new FormControl('', Validators.required),
    qualifications: new FormArray([])
  });
  constructor(
    private employeeSrv: EmployeeService,
    private notfySrv:NotifyService,
    private datePipe:DatePipe
  ){}
  get f(){
    return this.employeeForm.controls;
  }
  get qualifications(){
    return this.employeeForm.controls['qualifications'] as FormArray;
  }
  addQualification(){
    this.qualifications.push(new FormGroup({
        passingYear: new FormControl('', Validators.required),
        degree: new FormControl('', Validators.required)
    })
  );
  }
  removeQualification(index:number){
    this.qualifications.removeAt(index);
  }
  save(){
    if(this.employeeForm.invalid) return;
    Object.assign(this.employee, this.employeeForm.value);
    const reader = new FileReader();
    reader.onload = (e:any)=>{
      this.employeeSrv.uploadImage(this.picture)
      .subscribe({
        next: r=>{
          this.employee.picture = r.newFileName;
          this.insert();
        },
        error: err=>{
          this.notfySrv.message("Failed to upload picture", "DISMISS");
        }
      })
    }
    reader.readAsArrayBuffer(this.picture)
    this.employee.joiningDate = <string>this.datePipe.transform(this.employee.joiningDate, "yyyy-MM-dd")
    
   
  }
  insert(){
    this.employeeSrv.save(this.employee)
    .subscribe({
      next: r=>{
        this.notfySrv.message("Data Saved", "DISMISS");
        this.employee={};
        this.employeeForm.reset();
        this.employeeForm.markAsPristine();
        this.employeeForm.markAsUntouched();
      },
      error: err=>{
        this.notfySrv.message("Failed to save", "DISMISS");
      }
    })
  }
  pictureChanged(event:any){
    
    if(event.target.files.length){
      this.picture = event.target.files[0];
      this.employeeForm.patchValue({
        picture: this.picture.name
      })
    }
  }
  ngOnInit(): void {
    this.addQualification();
    Object.keys(Gender).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(Gender[v]) });
    });
    console.log(this.typeOptions)
  }
}
