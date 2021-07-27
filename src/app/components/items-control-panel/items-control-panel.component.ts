import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemModel} from "../../Models/item.model";

@Component({
  selector: 'app-items-control-panel',
  templateUrl: './items-control-panel.component.html',
  styleUrls: ['./items-control-panel.component.scss']
})
export class ItemsControlPanelComponent implements OnInit {
  // TODO: [research] This duplication needs to be solved with generics or correct emitting of multiple data types
  @Input() items: ItemModel[];
  @Input() selectedItems: ItemModel[];

  @Output() newItems = new EventEmitter<ItemModel[]>();
  @Output() newSelectedItems = new EventEmitter<ItemModel[]>();
  @Output() openModalAction = new EventEmitter();
  isModalOpened: boolean = false;

  constructor() {
    this.items = [];
    this.selectedItems = [];
  }

  ngOnInit(): void {}

  removeData() {
    if (this.selectedItems.length === this.items.length) {
      this.newItems.emit([]);
      this.newSelectedItems.emit([]);
    }
    else {
      for (const select of this.selectedItems) {
        const index = this.items.findIndex(inv => inv.uid === select.uid)
        this.items.splice(index, 1);
      }
      this.newItems.emit(this.items);
      this.newSelectedItems.emit([]);
    }
  }

  findNewId(): number {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.findIndex(item => item.id === i) < 0) {
        return i;
      }
    }

    return this.items.length;
  }
}
