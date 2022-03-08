import { SocketService } from './../../services/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RtcService } from 'src/app/services/rtc.service';
import { ChatService } from 'src/app/services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { CallService } from 'src/app/services/call.service';
import { Util } from 'src/app/utils/util';
import { interval, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit, OnDestroy {
  constructor(
    private rtcService: RtcService,
    private socketService: SocketService,
    private chatService: ChatService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: CallService,
    public util: Util
  ) {}

  @ViewChild('remoteVideo') remoteVideo: any;
  @ViewChild('selfVideo') selfVideo: any;
  private conversationId: string;
  private otherSidePeer: string;
  private otherSideId: string;
  private type: string;
  public user: string;
  public image: string;
  public status: string;
  private time: number = 0;
  public display;
  private interval;
  public micIsMute = false;
  public videoIsOff = false;

  ngOnDestroy(): void {
    this.pauseTimer();
    this.rtcService.closeAll();
    this.sendCloseToServer(this.otherSidePeer, this.otherSideId);
  }

  endCall() {
    this.rtcService.closeAll();
    this.sendCloseToServer(this.otherSidePeer, this.otherSideId);
    setTimeout(() => {
      this.router.navigateByUrl('/chat');
      window.location.href = '/chat';
    }, 1000);
  }

  micMuteUnmute(){
    if (this.micIsMute){
      this.rtcService.unMuteReceivedCallStream();
      this.rtcService.unMuteSentCallStream();
      this.micIsMute = false;
    }
    else{
      this.rtcService.muteReceivedCallStream();
      this.rtcService.muteSentCallStream();
      this.micIsMute = true;
    }
  }

  videoOnOff(){
    if (this.videoIsOff){
      this.rtcService.unHideReceivedCallStream();
      this.rtcService.unHideSentCallStream();
      this.videoIsOff = false;
    }
    else{
      this.rtcService.hideReceivedCallStream();
      this.rtcService.hideSentCallStream();
      this.videoIsOff = true;
    }
  }

  sendCloseToServer(peer, id) {
    this.service.postClosed({ peer, id }).subscribe(
      (response) => {},
      (error) => {
        console.log(close);
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  ngOnInit() {
    this.socketService.onCallRejectedSubject.subscribe((data) => {
      this.rtcService.callRejected();
      this.status = 'تماس رد شد';
      setTimeout(() => {
        this.router.navigateByUrl('/chat');
        window.location.href = '/chat';
        this.status = undefined;
      }, 1000);
    });

    this.socketService.onCallClosedSubject.subscribe((data) => {
      this.rtcService.closeAll();
      this.status = undefined;
      setTimeout(() => {
        this.router.navigateByUrl('/chat');
        window.location.href = '/chat';
      }, 1000);
      
    });

    this.rtcService.remoteStreamSubject.subscribe((stream) => {
      this.remoteVideo.nativeElement.srcObject = stream;
      this.status = undefined;
      this.startTimer();
    });

    this.rtcService.selfStreamSubject.subscribe((stream) => {
      this.selfVideo.nativeElement.srcObject = stream;
    });

    this.rtcService.callClosedSubject.subscribe(() => {
      this.status = undefined;
      setTimeout(() => {
        this.router.navigateByUrl('/chat');
        window.location.href = '/chat';
      }, 1000);
    });

    this.activatedRoute.params.subscribe((params) => {
      this.conversationId = params.id;
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.type = params.type;
      this.user = params.user;
      this.image = params.image;
    });

    if (this.type !== 'answer') {
      this.status = 'درحال برقراری تماس ...';
      this.chatService.getOthersideId(this.conversationId).subscribe(
        (response: any) => {
          this.otherSidePeer = response.peer;
          this.otherSideId = response._id;
          console.log(this.otherSidePeer);

          let callType;
          if (this.type === 'video') {
            callType = { audio: true, video: true };
          } else if (this.type === 'audio') {
            callType = { audio: true, video: false };
          }

          this.rtcService.startCall(
            this.otherSidePeer,
            this.conversationId,
            this.otherSideId,
            callType
          );
        },
        (error) => {
          this.status = undefined;
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    } else if (this.type === 'answer') {
      this.status = undefined;
      this.activatedRoute.queryParams.subscribe((params) => {
        this.otherSideId = params.id;
        this.otherSidePeer = params.peer;
      });
      this.rtcService.answerCall();
    }
  }

  startTimer() {
    console.log('=====>');

    if (this.interval) { return; }
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform(this.time);
    }, 1000);
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60);
  }
  pauseTimer() {
    clearInterval(this.interval);
  }
}
