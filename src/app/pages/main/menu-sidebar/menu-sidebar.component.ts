import { ChatService } from './../../../services/chat.service';
import { Util } from 'src/app/utils/util';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { CreditService } from 'src/app/services/credit.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('mainSidebar', { static: false }) mainSidebar;
  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>();
  @Output() user;
  constructor(
    public authService: AuthService,
    public service: ChatService,
    private socketService: SocketService,
    public creditService: CreditService,
    public util: Util
  ) {}

  async ngOnInit() {
    if (
      this.authService.currentUser.role === 1 ||
      this.authService.currentUser.role === 2
    ) {
      await this.service.loadChatStatus();
      await this.creditService.loadCredit();
    }
  }

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
  }
}
