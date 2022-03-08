import { Router } from '@angular/router';
import { ChatService } from './chat.service';
import { Util } from 'src/app/utils/util';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import socketIo from 'socket.io-client';
import { io } from 'socket.io-client';
import { ConfigService } from './config.service';
// tslint:disable-next-line: import-blacklist
import { Subject } from 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: any;
  serverUrl: string;
  token: string;

  public onMessageReceivedSubject: Subject<any> = new Subject();
  public onMessageSeenSubject: Subject<any> = new Subject();
  public onNotificationReceivedSubject: Subject<any> = new Subject();
  public onCallRejectedSubject: Subject<any> = new Subject();
  public onCallClosedSubject: Subject<any> = new Subject();

  constructor(
    private config: ConfigService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private chatService: ChatService,
    private util: Util
  ) {
    this.serverUrl = config.get('ServerUrl');
    this.token = auth.token;
  }

  setupSocketConnection() {
    const token = this.token;
    this.socket = io(this.serverUrl, { query: { token } });
    this.socket.emit('join');

    this.socket.on('newMessage', async (message) => {
      this.onMessageReceivedSubject.next(message);

      if (!this.router.url.includes('chat')) {
        this.chatService.loadChatStatus();
        this.util.playMessage();
      }
    });

    this.socket.on('messageSeen', (conversationId) => {
      this.onMessageSeenSubject.next(conversationId);
    });

    this.socket.on('newNotification', (notification) => {
      this.toastr.info(notification.body, 'اطلاعیه');
      this.util.playAlarm();
      this.onNotificationReceivedSubject.next(notification);
    });

    this.socket.on('callRejected', (data) => {
      console.log('on rejected');
      this.onCallRejectedSubject.next(data);
    });

    this.socket.on('callClosed', (data) => {
      console.log('on closed');
      this.onCallClosedSubject.next(data);
    });
  }
}
