import {AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';

import { DialogAddEditComponent } from '../dialogs/dialog-add-edit/dialog-add-edit.component';
import { DialogDeleteComponent } from '../dialogs/dialog-delete/dialog-delete.component';

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['FirstName', 'LastName', 'Email', "Actions"];
  dataSource = new MatTableDataSource<User>();

  constructor(
    private _userService:UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.showUsers();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogAddUser() {
    this.dialog.open(DialogAddEditComponent, {
      disableClose: true,
      width: "350px"
    }).afterClosed().subscribe(result => {
      if(result == "created") {
        this.showUsers();
      }
    });
  }

  openDialogEditUser(dataUser: User) {
    this.dialog.open(DialogAddEditComponent, {
      disableClose: true,
      width: "350px",
      data: dataUser
    }).afterClosed().subscribe(result => {
      if(result == "updated") {
        this.showUsers();
      }
    });
  }

  openDialogDeleteUser(dataUser: User) {
    this.dialog.open(DialogDeleteComponent, {
      disableClose: true,
      data: dataUser
    }).afterClosed().subscribe(result => {
      if(result == "deleted") {
        this._userService.delete(dataUser.id).subscribe({
          next: (data) => {
            this.showAlert("Usuario eliminado", "OK");
            this.showUsers();
          },
          error: (e) => { console.log(e); }
        })
      }
    });
  }

  showAlert(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  showUsers() {
    this._userService.getList().subscribe({
      next: (data) => {
        console.log(data);
        this.dataSource.data = data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }
}
