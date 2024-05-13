import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../global/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalService } from '../global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  activeTab='Awaited';
  taskForm!:FormGroup;
  display = "none";
  tasksList:any[]=[];
  selectedTask: any;
  isEdit=false;
constructor(private _router:Router,private _acRoute:ActivatedRoute,private _fb:FormBuilder,public _gs:GlobalService,private toastr:ToastrService){
  this.taskForm = this._fb.group({
    'taskId':new FormControl('',Validators.required),
    'title':new FormControl('',Validators.required),
    'description':new FormControl('',Validators.required),
    'status':new FormControl('',Validators.required)
  })
}

ngOnInit(): void {
  this._acRoute.queryParams.subscribe((pra:any)=>{
    this.activeTab=pra.at;
  })
  if(!this.activeTab){
    if(this._gs.userRole==='DEVELOPER'){
      this.activeTab='Todo';
      this.onTab(this.activeTab);
    }else{
      this.activeTab='Awaited'
      this.onTab(this.activeTab);
    }
  }
  if(localStorage.getItem('tasksList')){
    this.getTasksList();
  }
}

getTasksList(){
  const tasks=JSON.parse(localStorage.getItem('tasksList')|| '[]')
  if(tasks?.length){
    this.tasksList = tasks.filter((task:any)=>{
      return task.status===this.activeTab;
    })
  }
}

  onTab(tab:string){
    this.activeTab=tab;
    this.updateUrl({at:this.activeTab});
    this.getTasksList();
  }

  updateUrl(queryParams:any){
    this._router.navigate(
      [],
     {
      relativeTo:this._acRoute,
      queryParams:queryParams,
      queryParamsHandling:'merge'
     }
    )
  }
  openModal() {
    this.isEdit=false;
    this._gs.userRole==='MANAGER'?this.taskForm.get('status')?.setValue('Awaited'):''
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }

  onAddTask(){
    this.tasksList = JSON.parse(localStorage.getItem('tasksList') || '[]');
      if (this.tasksList?.length) {
        const task = this.tasksList.find(task=> task.taskId===this.taskForm?.value?.taskId);
        if(task){
          this.toastr.error(`Task already added with ${task.taskId}`);
          return
        }
    }else{
      this.tasksList=[]
    }
    this.tasksList.push(this.taskForm.value);
    localStorage.setItem('tasksList',JSON.stringify(this.tasksList));
    this.toastr.success('Task Added Successfully');
    this.resetForm();
  }

  resetForm(){
    this.taskForm.reset({
      status:''
    })
    this.onCloseHandled();
  }
  openEditModal(task:any){
    this.isEdit=true;
    this.selectedTask=task;
    this.taskForm.patchValue(task);
    this.display='block';
  }
  onUpdateTask(){
    this.tasksList = JSON.parse(localStorage.getItem('tasksList') || '[]');
    if(this.tasksList?.length){
      const di = this.tasksList.findIndex(task=> task.taskId===this.selectedTask?.taskId)
      if (di !== -1) {
        this.tasksList[di] = this.taskForm.value;
        localStorage.setItem('tasksList', JSON.stringify(this.tasksList));
        this.toastr.success('Task Updated Successfully')
        this.resetForm();
        this.getTasksList();
    } else {
        this.toastr.error('Task not found in the tasks list.')
        this.resetForm();
    }
    }
  }
  onDelete(id:number){
    this.tasksList = JSON.parse(localStorage.getItem('tasksList') || '[]');
    if(this.tasksList?.length){
      const di = this.tasksList.findIndex(task=> task.taskId===id)
      if (di !== -1) {
        this.tasksList.splice(di,1)
        localStorage.setItem('tasksList', JSON.stringify(this.tasksList));
        this.toastr.success('Task Deleted Successfully');
        this.resetForm();
        this.getTasksList();
    } else {
        this.toastr.error('Task not found in the tasks list.')
        this.resetForm();
    }
    }
  }
}
