import { Gender } from "./app-constants";
import { Qualification } from "./qualification";

export interface Employee {
    employeeId?:number;
    employeeName?:string;
    gender?:Gender
    joiningDate?:Date|string;
    salary?:number;
    picture?:string;
    isaCurrentEmployee?:boolean;
    qualifications?:Qualification[];
}
