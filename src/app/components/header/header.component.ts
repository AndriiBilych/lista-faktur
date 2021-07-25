import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showAbout: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event.target'])
  clicked(target: HTMLElement) {
    if (target.classList.contains('modal-container')) {
      this.showAbout = false;
    }
  }
}
