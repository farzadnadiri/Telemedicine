import { Util } from './../../utils/util';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RtcService } from 'src/app/services/rtc.service';
import { SocketService } from 'src/app/services/socket.service';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public sidebarMenuOpened = true;
  public callerUser;
  @ViewChild('contentWrapper', { static: false }) contentWrapper;
  @ViewChild('callModal', { static: false }) private callModal;
  constructor(
    private renderer: Renderer2,
    public titleService: Title,
    private socketService: SocketService,
    private rtcService: RtcService,
    private modalService: NgbModal,
    public util: Util,
    private router: Router
  ) {

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) { 
        
        if (window.innerWidth < 992){
          this.closeMenuSidebar();
          window.scroll(0, 0);
        }
        
      }
    });

  }

  ngOnInit() {
    if (window.innerWidth < window.innerHeight){
      this.closeMenuSidebar();
    }
    this.socketService.setupSocketConnection();
    this.socketService.onCallClosedSubject.subscribe((data) => {
      this.rtcService.closeAll();
      this.modalService.dismissAll();
    });

    this.rtcService.rtcSetup();
    this.renderer.removeClass(document.querySelector('app-root'), 'login-page');
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'register-page'
    );

    this.rtcService.callSubject.subscribe((callerUser) => {
      this.onCallReceived(callerUser);
    });
  }

  onCallReceived(callerUser) {
    this.open(this.callModal, callerUser);
  }

  mainSidebarHeight(height) {
    // this.renderer.setStyle(
    //   this.contentWrapper.nativeElement,
    //   'min-height',
    //   height - 114 + 'px'
    // );
  }

  open(content, item) {
    this.callerUser = item;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  closeMenuSidebar() {
    console.log('sidebarMenuCollapsed', this.sidebarMenuOpened);
    if (this.sidebarMenuOpened) {
      this.renderer.removeClass(
        document.querySelector('app-root'),
        'sidebar-open'
      );
      this.renderer.addClass(
        document.querySelector('app-root'),
        'sidebar-collapse'
      );
      this.sidebarMenuOpened = false;
    }
  }
  
  openMenuSidebar() {
    window.scroll(0, 0);
    console.log('sidebarMenuCollapsed', this.sidebarMenuOpened);
    if (!this.sidebarMenuOpened) {
      this.renderer.removeClass(
        document.querySelector('app-root'),
        'sidebar-collapse'
      );
      this.renderer.addClass(
        document.querySelector('app-root'),
        'sidebar-open'
      );
      this.sidebarMenuOpened = true;
    } 
  }

  toggleMenuSidebar() {
    console.log('sidebarMenuCollapsed', this.sidebarMenuOpened);
    if (this.sidebarMenuOpened) {
      this.renderer.removeClass(
        document.querySelector('app-root'),
        'sidebar-open'
      );
      this.renderer.addClass(
        document.querySelector('app-root'),
        'sidebar-collapse'
      );
      this.sidebarMenuOpened = false;
    } else {
      window.scroll(0, 0);
      this.renderer.removeClass(
        document.querySelector('app-root'),
        'sidebar-collapse'
      );
      this.renderer.addClass(
        document.querySelector('app-root'),
        'sidebar-open'
      );
      this.sidebarMenuOpened = true;
    }
  }

  reject() {
    this.modalService.dismissAll();
    this.rtcService.rejectCall();
  }

  answer() {
    this.modalService.dismissAll();
    this.router.navigateByUrl(
      `call/${this.callerUser.conversationId}?type=answer&id=${this.callerUser.id}&user=${this.callerUser.name}&image=${this.callerUser.image}&peer=${this.callerUser.peer}`
    );
  }
  
}
