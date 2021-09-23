/*
 * Automatically generated by Magic
 */

import { throwError } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http-service';
import { DialogComponent, DialogData } from '@app/base/dialog.component';

/**
 * Modal dialog for editing your existing Attachments entity types, and/or
 * creating new entity types of type Attachments.
 */
@Component({
  templateUrl: './edit.babelmail_attachments_attachments.component.html',
})
export class EditBabelmail_attachments_attachmentsComponent extends DialogComponent {
  /**
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<EditBabelmail_attachments_attachmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    protected snackBar: MatSnackBar,
    public service: HttpService
  ) {
    super(snackBar);
    this.primaryKeys = ['id'];
    this.createColumns = ['filename', 'path', 'email_id'];
    this.updateColumns = [];
  }

  /**
   * Returns a reference to ths DialogData that was dependency injected
   * into component during creation.
   */
  protected getData() {
    return this.data;
  }

  /**
   * Returns a reference to the create method, to create new entities.
   */
  protected getCreateMethod() {
    return this.service.babelmail_attachments_attachments.create(
      this.data.entity
    );
  }

  /**
   * Closes dialog.
   *
   * @param data Entity that was created or updated
   */
  public close(data: any) {
    if (data) {
      this.dialogRef.close(data);
    } else {
      this.dialogRef.close();
    }
  }
}
