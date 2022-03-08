import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-notifications-dropdown-menu',
  templateUrl: './notifications-dropdown-menu.component.html',
  styleUrls: ['./notifications-dropdown-menu.component.scss'],
})
export class NotificationsDropdownMenuComponent implements OnInit {
  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private service: NotificationService,
    private socketService: SocketService) {
    moment.locale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s پیش',
        s: 'چند ثانیه',
        ss: '%s چند ثانیه',
        m: 'یک دقیقه',
        mm: '%d دقیقه',
        h: 'یک ساعت',
        hh: '%d ساعت',
        d: 'یک روز',
        dd: '%d روز',
        M: 'یک ماه',
        MM: '%d ماه',
        y: 'یک سال',
        yy: '%d سال'
      }
    });

  }
  @ViewChild('dropdownMenu', { static: false }) dropdownMenu;
  items: any[];
  unseen = 0;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.hideDropdownMenu();
    }
  }

  ngOnInit() {
    this.socketService.onNotificationReceivedSubject.subscribe(notification => { this.onNotificationReceived(notification); });
    this.service.status().subscribe((result: any) => {
      this.items = result.list;
      this.unseen = result.count;
    });
  }
  onNotificationReceived(notification: any) {
    if (notification){
      this.unseen = this.unseen + 1;
      this.items.unshift(notification);
      if (this.items.length > 5){
        this.items.pop();
      }
    }
  }

  toggleDropdownMenu() {
    if (this.dropdownMenu.nativeElement.classList.contains('show')) {
      this.hideDropdownMenu();
    } else {
      this.showDropdownMenu();
    }
  }

  showDropdownMenu() {
    this.renderer.addClass(this.dropdownMenu.nativeElement, 'show');
  }

  hideDropdownMenu() {
    this.renderer.removeClass(this.dropdownMenu.nativeElement, 'show');
  }

  dateString(date) {
    return moment(date).fromNow();
  }

  gotoNotificationsPage(){
    this.unseen = 0;
    if (this.dropdownMenu.nativeElement.classList.contains('show')) {
      this.hideDropdownMenu();
    }
    this.router.navigate(['/notifications']);
  }

}
