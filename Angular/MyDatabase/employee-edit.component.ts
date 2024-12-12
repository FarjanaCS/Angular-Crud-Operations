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
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {
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
    private activatedRoute:ActivatedRoute,
    private datePipe:DatePipe
  ){}
  
  get f(){
    return this.employeeForm.controls;
  }
  get qualifications(){
    return this.employeeForm.controls['qualifications'] as FormArray;
  }
  addQualification(qualification?:Qualification){
    this.qualifications.push(new FormGroup({
        passingYear: new FormControl(qualification?.passingYear ?? '', Validators.required),
        degree: new FormControl(qualification?.degree ?? '', Validators.required)
    })
  );
  }
  removeQualification(index:number){
    this.qualifications.removeAt(index);
  }
  save(){
    if(this.employeeForm.invalid) return;
    let data:Employee = {};
    Object.assign(data, this.employeeForm.value);
    data.employeeId=this.employee.employeeId;
    if(data.picture == ''){
      data.picture = this.employee.picture;
    }

    console.log(data);
    this.employeeSrv.update(data)
    .subscribe({
      next:r=>{
        this.notfySrv.message("Data Saved", "DISMISS");
      },
      error: err=>{
        this.notfySrv.message("Failed to Update", "DISMISS");
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
    Object.keys(Gender).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(Gender[v]) });
    });
    let id:number = this.activatedRoute.snapshot.params['id'];
    this.employeeSrv.getById(id)
    .subscribe({
      next: r=>{
        this.employee= r;
        this.employeeForm.patchValue(this.employee)
        this.employee.qualifications?.forEach(s=>{
          this.addQualification(s);
        });
      },
      error: err=>{
        this.notfySrv.message("Failed to save", "DISMISS");
      }
    })
  }
}
