import { SocketService } from './../../services/socket.service';
import { IPageData } from './../../interfaces/IPageAble';
import { ChatService } from './../../services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { UploadService } from 'src/app/services/upload.service';
import { Util } from 'src/app/utils/util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import DetectRTC from 'detectrtc';
import { CallService } from 'src/app/services/call.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('confirmModal') confirmModal : any;
  disableScrollDown = false;
  permissionLoading=false;
  permissionLoadingMessage='';
  user: any;
  largimage: string;
  message: string;
  userId: string;
  page: number;
  totalPages: number;
  loadingMessages: boolean;
  collectionSize = 0;
  conversationMessages: any[];
  currentConversation: any;
  conversations: any[];
  closeResult = '';
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: ChatService,
    private callService: CallService,
    private socketService: SocketService,
    private authService: AuthService,
    private router: Router,
    private uploadService: UploadService,
    public util: Util
  ) {
    this.user = authService.currentUser;
  }
  ngOnDestroy(): void {
    this.currentConversation = null;
    this.service.loadChatStatus();
  }

  ngOnInit() {
    this.socketService.onMessageReceivedSubject.subscribe((message) => {
      this.onMessageReceived(message);
    });
    this.socketService.onMessageSeenSubject.subscribe((conversationId) => {
      this.onMessageSeen(conversationId);
    });
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.userId = params.id;
        this.getConversation(this.userId);
      }
    });

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
        yy: '%d سال',
      },
    });
    this.loadConversations();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  setConversation(item) {
    this.currentConversation = item;
    item.unSeenCount = 0;
    this.page = 1;
    this.loadMessages();
    this.disableScrollDown = false;
  }

  getConversation(userId) {
    this.service.getConversation(userId).subscribe(
      (response: any) => {
        if (!response.lastMessage) {
          this.loadConversations();
        }
        this.setConversation(response);
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  sendText() {
    if (!this.message || !this.currentConversation) {
      return;
    }
    const msg = {
      conversationId: this.currentConversation._id,
      body: this.message,
      type: 0,
      resource: '',
    };
    this.sendMessage(msg);
  }

  sendImage(resource) {
    if (!this.currentConversation) {
      return;
    }
    const msg = {
      conversationId: this.currentConversation._id,
      body: 'تصویر',
      type: 1,
      resource,
    };
    this.sendMessage(msg);
  }

  sendFile(resource) {
    if (!this.currentConversation) {
      return;
    }
    const msg = {
      conversationId: this.currentConversation._id,
      body: 'فایل',
      type: 2,
      resource,
    };
    this.sendMessage(msg);
  }

  sendMessage(message) {
    this.service.sendMessage(message).subscribe(
      (response) => {
        this.message = '';
        this.loadConversations();
        this.setConversation(this.currentConversation);
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  dateString(date) {
    return moment(date).fromNow();
  }

  loadConversations() {
    this.service.loadConversations().subscribe(
      (response: []) => {
        this.conversations = response;
        this.service.loadChatStatus();
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  seen(messageId) {
    this.service.seenMessage(messageId).subscribe(
      (response) => {
        return response;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  loadMessages() {
    if (!this.currentConversation) {
      return;
    }
    this.loadingMessages = true;
    this.service
      .loadMessages(this.page, this.currentConversation._id)
      .subscribe(
        (response: IPageData) => {
          this.totalPages = response.totalPages;
          if (this.page === 1) {
            this.conversationMessages = response.data.reverse();
          } else {
            this.conversationMessages = response.data
              .reverse()
              .concat(this.conversationMessages);
          }
          this.loadingMessages = false;
          this.service.loadChatStatus();
        },
        (error) => {
          this.loadingMessages = false;
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  onScroll() {
    this.disableScrollDown = true;
    if (
      !this.currentConversation ||
      this.loadingMessages ||
      this.page === this.totalPages
    ) {
      return;
    }
    this.page = this.page + 1;
    this.loadMessages();
  }

  scrollToBottom() {
    if (this.disableScrollDown) {
      return;
    }
    try {
      const height = this.myScrollContainer.nativeElement.scrollHeight;
      this.myScrollContainer.nativeElement.scrollTop = height;
    } catch (err) {}
  }

  onMessageSeen(conversationId) {
    if (
      this.currentConversation &&
      conversationId === this.currentConversation._id
    ) {
      this.conversationMessages.forEach((element) => {
        element.seen = true;
      });
    }
    this.loadConversations();
  }

  onMessageReceived(message) {
    if (
      this.currentConversation &&
      message.conversation === this.currentConversation._id
    ) {
      this.conversationMessages.push(message);
      this.seen(message._id);
      this.loadConversations();
    } else {
      this.loadConversations();
    }
  }

  imageChange(event) {
    const item = {
      conversation: this.currentConversation._id,
      from: this.user._id,
      body: 'تصویر',
      date: Date.now(),
      type: 1,
      loading: true,
    };
    this.conversationMessages.push(item);
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.uploadService.uploadImage(file).subscribe(
        (response: any) => {
          this.sendImage(response.name);
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    }
  }

  fileChange(event) {
    const item = {
      conversation: this.currentConversation._id,
      from: this.user._id,
      body: 'فایل',
      date: Date.now(),
      type: 2,
      loading: true,
    };
    this.conversationMessages.push(item);
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.uploadService.uploadPdf(file).subscribe(
        (response: any) => {
          this.sendFile(response.name);
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    }
  }
  open(content, largimage) {
    this.largimage = largimage;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }



  checkPermissionsForVideoCall(){
    DetectRTC.load(() => {
      if (DetectRTC.isWebRTCSupported === false) {
        // tslint:disable-next-line: max-line-length
        return this.toastr.error('بستر تماس صوتی و تصویری توسط مرورگر شما پشتیبانی نمی گردد، لطفا از کروم یا فایرفاکس استفاده نمایید', 'خطا');
      }
      if (DetectRTC.hasMicrophone === false) {
        return this.toastr.error('دستگاه شما مجهز به میکروفن نمی باشد', 'خطا');
      }
      if (DetectRTC.hasWebcam === false) {
        return this.toastr.error('دستگاه شما مجهز به وبکم نمی باشد', 'خطا');
      }
      if (DetectRTC.isWebsiteHasMicrophonePermissions === false || DetectRTC.isWebsiteHasWebcamPermissions === false) {
        navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => { track.stop(); });

          const queryParams = {type: 'video', user: this.currentConversation.name, image: this.currentConversation.image};
          this.router.navigate(['/call', this.currentConversation._id], {queryParams});
        })
        .catch((err) => {
         return this.toastr.error('دسترسی به میکروفن و دوربین را اعطا کنید', 'خطا');
        });
      }
      else{
        
        this.permissionLoading=true;
        this.permissionLoadingMessage='در حال بررسی مجوز تماس';
        this.modalService.open(this.confirmModal, { ariaLabelledBy: 'modal-basic-title' });

        this.callService
        .getCanCall(this.currentConversation._id)
        .subscribe(
          (response) => {
        this.permissionLoading=false;
        this.modalService.dismissAll(); 
        const queryParams = {type: 'video', user: this.currentConversation.name, image: this.currentConversation.image};
        this.router.navigate(['/call', this.currentConversation._id], {queryParams});
          },
          (error) => {
            this.permissionLoading=false;
            this.permissionLoadingMessage='برقراری تماس مجاز نیست، لطفا در زمان تعیین شده تماس حاصل نمایید';
          }
        );

      }

    });
  }

  checkPermissionsForAudioCall(){
    DetectRTC.load(() => {
      if (DetectRTC.isWebRTCSupported === false) {
        // tslint:disable-next-line: max-line-length
        return this.toastr.error('بستر تماس صوتی و تصویری توسط مرورگر شما پشتیبانی نمی گردد، لطفا از کروم یا فایرفاکس استفاده نمایید', 'خطا');
      }
      if (DetectRTC.hasMicrophone === false) {
        return this.toastr.error('دستگاه شما مجهز به میکروفن نمی باشد', 'خطا');
      }
      if (DetectRTC.isWebsiteHasMicrophonePermissions === false) {
        navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          stream.getTracks().forEach((track) => { track.stop(); });

          const queryParams = {type: 'audio', user: this.currentConversation.name, image: this.currentConversation.image};
          this.router.navigate(['/call', this.currentConversation._id], {queryParams});
        })
        .catch((err) => {
         return this.toastr.error('دسترسی به میکروفن را اعطا کنید', 'خطا');
        });
      }
      else{

        this.permissionLoading=true;
        this.permissionLoadingMessage='در حال بررسی مجوز تماس';
        this.modalService.open(this.confirmModal, { ariaLabelledBy: 'modal-basic-title' });
        
        this.callService
        .getCanCall(this.currentConversation._id)
        .subscribe(
          (response) => {
        this.permissionLoading=false;
        this.modalService.dismissAll(); 
        const queryParams = {type: 'audio', user: this.currentConversation.name, image: this.currentConversation.image};
        this.router.navigate(['/call', this.currentConversation._id], {queryParams});
          },
          (error) => {
            this.permissionLoading=false;
            this.permissionLoadingMessage='برقراری تماس مجاز نیست، لطفا در زمان تعیین شده تماس حاصل نمایید';
          }
        );
      }

    });
  }

  

}
