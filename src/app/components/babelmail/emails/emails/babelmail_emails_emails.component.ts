/*
 * Automatically generated by Magic
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridComponent } from '@app/base/grid.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { EditBabelmail_emails_emailsComponent } from './modals/edit.babelmail_emails_emails.component';
import { HttpService } from 'src/app/services/http-service';
import { AuthService } from 'src/app/services/auth-service';
import { environment } from '@env/environment';

/**
 * "Datagrid" component for displaying instance of Emails
 * entities from your HTTP REST backend.
 */
@Component({
  selector: 'app-babelmail_emails_emails',
  templateUrl: './babelmail_emails_emails.component.html',
  styleUrls: ['./babelmail_emails_emails.component.scss'],
})
export class Babelmail_emails_emailsComponent
  extends GridComponent
  implements OnInit
{
  /**
   * Which columns we should display. Reorder to prioritize columns differently.
   * Notice! 'delete-instance' should always come last.
   */
  public displayedColumns: string[] = [
    'state',
    'from_name',
    'from_email',
    'subject',
    'to_name',
    'to_email',
    'language',
    'state',
    'direction',
    'id',
    'content',
    'created',
    'sent',
    'delete-instance',
  ];

  // Need to view paginator as a child to update page index of it.
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /**
   * How to filter emails.
   */
  public filterType: string = 'no-filter';

  // Form control declarations to bind up with reactive form elements.
  public to_name: FormControl;
  public from_name: FormControl;
  public to_email: FormControl;
  public from_email: FormControl;
  public subject: FormControl;
  public language: FormControl;
  public state: FormControl;
  public direction: FormControl;
  public id: FormControl;
  public content: FormControl;
  public created: FormControl;
  public sent: FormControl;

  /**
   * Creates an instance of your CRUD component.
   *
   * @param httpService Needed to be able to invoke backend during CRUD operations
   * @param authService Needed to check if user has access to invoking CRUD operation
   * @param snackBar Needed to display errror and feedback
   * @param dialog Needed to show modal dialog as user edits or creates new entities
   */
  constructor(
    public httpService: HttpService,
    public authService: AuthService,
    protected snackBar: MatSnackBar,
    protected dialog: MatDialog
  ) {
    super(authService, snackBar, dialog);
    this.filter.order = 'created';
    this.filter.direction = 'desc';
  }

  /**
   * Overridde abstract method necessary to return the URL endpoint
   * for CRUD methods to base class.
   */
  public url() {
    return 'magic/modules/babelmail/emails/emails';
  }

  /**
   * Invoked when grid needs icon to display for email.
   *
   * @param state State of email
   */
  public getStateIcon(state: string) {
    switch (state) {
      case 'draft':
        return 'drafts';

      case 'sent':
        return 'email';

      case 'failed':
        return 'warning';
    }
  }

  /**
   * Invoked when filter is changed.
   */
  public filterChanged() {
    // Figuring out how to filter emails.
    switch (this.filterType) {
      case 'sent':
        this.filter['state.eq'] = 'sent';
        break;

      case 'draft':
        this.filter['state.eq'] = 'draft';
        break;

      case 'received':
        this.filter['state.eq'] = 'received';
        break;

      default:
        delete this.filter['state.eq'];
        break;
    }

    // Retrieving items, now filtered.
    this.getData(true);
  }

  /**
   * Invoked when user is toggling details for viewing email's details.
   *
   * @param entity Entity we're toggling
   */
  public toggleDetails(entity: any): void {
    const indexOf = this.viewDetails.indexOf(entity);
    if (indexOf === -1) {
      // Showing details for specified entity.
      this.viewDetails.push(entity);

      this.getAttachments(entity);
    } else {
      // Hiding details for specified entity.
      this.viewDetails.splice(indexOf, 1);
    }
  }

  /**
   * Invoked when an attachment is to be downloaded.
   *
   * @param attachment Attachment to download
   */
  public downloadAttachment(attachment: any) {
    // Downloading file to client.
    window.location.href =
      environment.apiUrl +
      'magic/modules/babelmail/files/download-file?file=' +
      encodeURIComponent(attachment.path) +
      '&filename=' +
      encodeURIComponent(attachment.filename);
  }

  /**
   * Invoked when user wants to send an email.
   *
   * @param entity Email to send
   */
  public sendEmail(entity: any) {
    this.httpService.babelmail_emails_emails
      .update({
        id: entity.id,
        send: true,
      })
      .subscribe(
        (result: any) => {
          this.snackBar.open('Email successfully sent', 'ok', {
            duration: 5000,
          });
          entity.state = 'sent';
        },
        (error: any) => {
          this.showError(error);
        }
      );
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually retrieve items from backend.
   */
  protected read(filter: any) {
    return this.httpService.babelmail_emails_emails.read(filter);
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually retrieve count of items from backend.
   */
  protected count(filter: any) {
    return this.httpService.babelmail_emails_emails.count(filter);
  }

  /**
   * Overridden abstract method from base class, that returns the Observable
   * necessary to actually delete items in backend.
   */
  protected delete(ids: any) {
    return this.httpService.babelmail_emails_emails.delete(ids);
  }

  /**
   * Implementation of abstract base class method, to reset paginator
   * of component.
   */
  protected resetPaginator() {
    this.paginator.pageIndex = 0;
    this.filter.offset = 0;
  }

  /**
   * OnInit implementation. Retrieves initial data (unfiltered),
   * and instantiates our FormControls.
   */
  public ngOnInit() {
    // Retrieves data from our backend, unfiltered, and binds our mat-table accordingly.
    this.getData();

    /*
     * Creating our filtering FormControl instances, which gives us "live filtering"
     * on our columns.
     */
    this.to_name = this.createFormControl('to_name.like');
    this.from_name = this.createFormControl('from_name.like');
    this.to_email = this.createFormControl('to_email.like');
    this.from_email = this.createFormControl('from_email.like');
    this.subject = this.createFormControl('subject.like');
    this.language = this.createFormControl('language.like');
    this.state = this.createFormControl('state.eq');
    this.direction = this.createFormControl('direction.like');
    this.id = this.createFormControl('id.eq');
    this.content = this.createFormControl('content.like');
    this.created = this.createFormControl('created.eq');
    this.sent = this.createFormControl('sent.eq');
  }

  /**
   * Returns CSS class name for a specific table row (tr element).
   * Notice, the CSS class is changed according to whether or not the details
   * window is visible or not.
   *
   * @param entity Entity to retrieve view-details CSS class for
   */
  public getClassForRecord(entity: any): string {
    return super.getClassForRecord(entity) + ' ' + entity.state;
  }

  /**
   * Invoked when user wants to edit an entity
   *
   * This will show a modal dialog, allowing the user to edit his record.
   */
  public editEntity(entity: any) {
    const dialogRef = this.dialog.open(EditBabelmail_emails_emailsComponent, {
      data: this.getEditData(entity),
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.setEditData(res, entity);
        this.getAttachments(entity, true);
      }
    });
  }

  /**
   * Invoked when user wants to create a new entity
   *
   * This will show a modal dialog, allowing the user to supply
   * the initial data for the entity.
   */
  public createEntity() {
    const dialogRef = this.dialog.open(EditBabelmail_emails_emailsComponent, {
      data: {
        isEdit: false,
        entity: {},
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.itemCreated(res);
      }
    });
  }

  private getAttachments(entity: any, force: boolean = false) {
    // Now we need to retrieve attachments for email, but only if we haven't retrieved these previously.
    if (force || !entity.attachments) {
      // Ensuring we don't try to retrieve attachments again before invocation towards backend is done.
      entity.attachments = [];

      // Invoking backend.
      this.httpService.babelmail_attachments_attachments
        .read({
          limit: -1,
          ['email_id.eq']: entity.id,
        })
        .subscribe((result: any[]) => {
          // Assigning model.
          result = result || [];
          for (const idx of result) {
            if (idx.filename.indexOf('.') === -1) {
              // Ensuring file extension becomes correctly applied.
              const extension = idx.path.substr(idx.path.lastIndexOf('.') + 1);
              idx.filename += '.' + extension;
            }
          }
          entity.attachments = result;
        });
    }
  }
}
