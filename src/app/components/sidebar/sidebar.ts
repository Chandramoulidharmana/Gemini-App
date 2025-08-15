import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenerateResult } from '../../generate-result';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {

  @Input() isSideBarOpened: boolean = false;
  @Input() history: any[][] = [];

  @Output() closeSidebar = new EventEmitter<void>();
  @Output() createNewChat = new EventEmitter<void>();
  @Output() openChat = new EventEmitter<any>();

  constructor(private _generateS: GenerateResult) {}

  chooseChat(item: any, index: number): void {
    this._generateS.chatIndex = index;
    this.openChat.emit(item);
  }

  getHighlighted(index: number): boolean {
    return index === this._generateS.chatIndex;
  }

  getSidebarBottomStyle(): { [key: string]: string } {
    const width = window.innerWidth < 992 ? 90 : 30;
    return { width: `calc(${width}% - 2rem)` };
  }
}
