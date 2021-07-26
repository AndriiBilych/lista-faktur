import {Component, HostListener, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit{

  @Input() text: string = '';
  @Output() closeAction = new EventEmitter();
  @Output() response = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  @HostListener('document:click', ['$event.target'])
  clicked(target: HTMLElement) {
    if (target.classList.contains('modal-container')) {
      this.closeAction.emit();
    }
  }
}
