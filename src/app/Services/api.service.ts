import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  URI: string = "http://192.168.2.185:8081";
  httpClient: any;

  constructor(private http: HttpClient, private auth: AuthService) { }

  // headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getAccessToken()}`);

  getProjects() {
    return this.http.get(`${this.URI}/project/all`);
  }
  postProjects(data: any) {
    return this.http.post(`${this.URI}/project/add`, data);
  }
  updateProjects(data: any, id: number) {
    return this.http.put(`${this.URI}/project/update`, data);
  }
  deleteProjects(id: number) {
    return this.http.delete(`${this.URI}/project/delete/${id}`);
  }

  getEmployees() {
    return this.http.get(`${this.URI}/employee/all`);
  }
  postEmployees(data: any) {
    return this.http.post(`${this.URI}/employee/add`, data);
  }
  updateEmployees(data: any, id: number) {
    return this.http.put(`${this.URI}/employee/update`, data);
  }
  deleteEmployees(id: number) {
    return this.http.delete(`${this.URI}/employee/delete/${id}`);
  }

  getLOV() {
    return this.http.get(`${this.URI}/masterdata/all`);
  }
  postLOV(data: any) {
    return this.http.post(`${this.URI}/masterdata/add`, data);
  }
  updateLOV(data: any) {
    return this.http.put(`${this.URI}/masterdata/update`, data);
  }
  deleteLOV(id: number) {
    return this.http.delete(`${this.URI}/masterdata/delete/${id}`);
  }

  getLOVTypes() {
    return this.http.get(`${this.URI}/masterdata/gettypes`);
  }
  getLOVByType(type: string) {
    return this.http.get(`${this.URI}/masterdata/getbytype/${type}`);
  }


  getEmpByRM(data: any) {
    return this.http.get(`${this.URI}/employee/getemployeesbyrm?reportingmanager=${data}`,);
  }
  getProjectsForJobcard() {
    return this.http.get(`${this.URI}/project/getdistinctprojects`);
  }
  postProjAllo(data: any) {
    return this.http.post(`${this.URI}/jobcard/add`, data);
  }
  getProjAllo(empId: any) {
    return this.http.get(`${this.URI}/jobcard/findbyempid?empId=${empId}`);
  }
  deleteProjAllo(id: number) {
    return this.http.delete(`${this.URI}/jobcard/delete/${id}`);
  }
  updateProjAllo(data: any) {
    return this.http.put(`${this.URI}/jobcard/update`, data);
  }
  getTasksByProj(id: any) {
    return this.http.get(`${this.URI}/task/tasks?Project_id=${id}`);
  }

  postTask(data: any) {
    return this.http.post(`${this.URI}/task/add`, data);
  }
  getTask(id:number) {
    return this.http.get(`${this.URI}/task/all?Project_id=${id}`);
  }
  updateTask(data: any) {
    return this.http.put(`${this.URI}/task/update`, data);
  }
  deleteTask(id: number) {
    return this.http.delete(`${this.URI}/task/delete/${id}`);
  }

  getDetails(userName:string) {
    return this.http.get(`${this.URI}/employee/getemployeesbyempname?empname=${userName}`);
  }
  postTimesheet(data: any) {
    return this.http.post(`${this.URI}/timesheet/add`, data);
  }
  getTimesheet(obj:any) {
    return this.http.get(`${this.URI}/timesheet/all?name=${obj.name}&financialyear=${obj.financialyear}&month=${obj.month}`);
  }
  updateTimesheet(data: any) {
    return this.http.put(`${this.URI}/timesheet/update`, data);
  }
  deleteTimesheet(id: number) {
    return this.http.delete(`${this.URI}/timesheet/delete/${id}`);
  }

}
