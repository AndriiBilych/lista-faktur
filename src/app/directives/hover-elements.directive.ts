import {AfterViewInit, Directive, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {InvoiceModel} from "../Models/invoice.model";
import { v4 as uid} from "uuid";

@Directive({
  selector: '[invoicesHoverTools]'
})
export class HoverElementsDirective implements AfterViewInit {

  @Input() invoices: InvoiceModel[];
  @Output() duplicateAction = new EventEmitter<InvoiceModel>();
  @Output() editAction = new EventEmitter<InvoiceModel>();
  @Output() removeAction = new EventEmitter<InvoiceModel>();

  constructor(
    private el: ElementRef,
  ) {
    this.invoices = [];
  }

  ngAfterViewInit() {
    setInterval(() => {
      const elems = this.el.nativeElement.querySelectorAll('.hover-container');
      if (this.invoices.length !== elems.length) {
        const rows = this.el.nativeElement.querySelectorAll('.mat-row');
        rows.forEach((el: any) => {
          if (!el.querySelector('.hover-container')) {
            const container = document.createElement('div');
            container.setAttribute('class', 'hover-container');
            const uniqueId = uid();
            container.setAttribute('uid', uniqueId);
            container.appendChild(this.createDuplicateButton(uniqueId));
            container.appendChild(this.createEditButton(uniqueId));
            container.appendChild(this.createRemoveButton(uniqueId));
            el.appendChild(container);
          }
        });
      }
    }, 750);
  }

  createDuplicateButton(uniqueId: string): HTMLElement {
    const button = document.createElement('button');
    button.setAttribute('class', 'duplicate-hover-button');
    button.setAttribute('title', 'Duplicate this row');
    button.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clone" class="svg-inline--fa fa-clone fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 0c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48H176c-26.51 0-48-21.49-48-48V48c0-26.51 21.49-48 48-48h288M176 416c-44.112 0-80-35.888-80-80V128H48c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h288c26.51 0 48-21.49 48-48v-48H176z"></path></svg>';

    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const containers = Array.from(this.el.nativeElement.querySelectorAll('.hover-container'));
      const index = containers.findIndex((item: any) => item.getAttribute('uid') === uniqueId);
      const newInvoice = Object.assign({}, this.invoices[index]);

      this.duplicateAction.emit(newInvoice);
    });

    return button;
  }

  createEditButton(uid: string): HTMLElement {
    const button = document.createElement('button');
    button.setAttribute('class', 'edit-hover-button');
    button.setAttribute('title', 'Edit this row');
    button.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>';

    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const containers = Array.from(this.el.nativeElement.querySelectorAll('.hover-container'));
      const index = containers.findIndex((item: any) => item.getAttribute('uid') === uid);

      this.editAction.emit(this.invoices[index]);
    });

    return button;
  }

  createRemoveButton(uid: string): HTMLElement {
    const button = document.createElement('button');
    button.setAttribute('class', 'remove-hover-button');
    button.setAttribute('title', 'Remove this row');
    button.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>';

    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const containers = Array.from(this.el.nativeElement.querySelectorAll('.hover-container'));
      const index = containers.findIndex((item: any) => item.getAttribute('uid') === uid);

      this.removeAction.emit(this.invoices[index]);
    });

    return button;
  }

  findNewId(): number {
    for (let i = 0; i < this.invoices.length; i++) {
      if (this.invoices.findIndex(item => item.id === i) < 0) {
        return i;
      }
    }

    return this.invoices.length;
  }
}
