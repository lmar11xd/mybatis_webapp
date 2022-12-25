import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11Label: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class DialogAddEditComponent implements OnInit {
  formUser: FormGroup;
  titleAction:string = "Agregar";
  buttonAction:string = "Guardar";

  constructor(
    private dialogReference: MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public dataUser: User
  ){
    this.formUser = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    if(this.dataUser) {
      this.formUser.patchValue({
        firstName: this.dataUser.firstName,
        lastName: this.dataUser.lastName,
        email: this.dataUser.email,
        password: this.dataUser.password
      });
      this.titleAction = "Editar";
      this.buttonAction = "Actualizar";
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  addEditUser() {
    console.log(this.formUser.value);
    const model: User = {
      id: 0,
      firstName: this.formUser.value.firstName,
      lastName: this.formUser.value.lastName,
      email: this.formUser.value.email,
      password: this.formUser.value.password
    }

    if(this.dataUser == null) {
      this._userService.add(model).subscribe({
        next: (data) => {
          this.openSnackBar("Usuario creado", "OK");
          this.dialogReference.close("created");
        },
        error: (e) => {
          this.openSnackBar("No se pudo guardar", "Error");
        }
      })
    } else {
      this._userService.update(this.dataUser.id, model).subscribe({
        next: (data) => {
          this.openSnackBar("Usuario actualizado correctamente", "OK");
          this.dialogReference.close("updated");
        },
        error: (e) => {
          this.openSnackBar("No se pudo actualizar", "Error");
        }
      })
    }

  }
}
