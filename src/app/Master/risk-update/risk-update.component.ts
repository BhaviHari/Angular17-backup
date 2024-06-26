import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
import {ShareService} from '../share.service'

@Component({
  selector: 'app-risk-update',
  templateUrl: './risk-update.component.html',
  styleUrls: ['./risk-update.component.scss']
})
export class RiskUpdateComponent implements OnInit {
  riskEdit:FormGroup;
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService,
    private shareservice:ShareService) { }

  ngOnInit(): void {
    this.riskEdit=this.fb.group({
     
      'name':['',Validators.required]
    });
    let data:any=this.shareservice.riskValue.value;
    console.log('eeeeeeeeeeee==',data);
    this.riskEdit.patchValue({'name':data.name,});
  }

  submitform(){
    if(this.riskEdit.get('name').value.toString().trim()=='' || this.riskEdit.get('name').value==undefined || this.riskEdit.get('name').value=='' || this.riskEdit.get('name').value==null){
      this.Notification.showError('Please Enter The Risk Name');
      return false;
    }
    let iddata:any=this.shareservice.riskValue.value;
    let data:any={
      'id':iddata.id,
      "name":this.riskEdit.get('name').value.toString().trim(),
      // 'code':this.createdesignation.get('code').value
    };
    this.masterservice.getRiskcreate(data).subscribe(result=>{
      console.table("result", result)
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
      }else {
        this.Notification.showSuccess("updated Successfully!...")
        this.onSubmit.emit();
      }
    })
  };
  clickcancel(){
    this.onCancel.emit();
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
      return false;
    }
    return true;
  }

}
