import { CallService } from './call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from './auth.service';
import Peer from 'peerjs';
import { ToastrService } from 'ngx-toastr';
import { Subject, timer } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RtcService {
  // http://localhost/rtcserver/peerjs/id

  public callSubject: Subject<any> = new Subject();
  public remoteStreamSubject: Subject<any> = new Subject();
  public selfStreamSubject: Subject<any> = new Subject();
  public callClosedSubject: Subject<any> = new Subject();

  public peer: Peer;
  private receivedCall: any;
  public receivedCallStream: any;
  private sentCall: any;
  public sentCallStream: any;
  private timeoutObj: any;
  private callingUser: any;
  private audioBusy = new Audio();
  private audioCalling = new Audio();
  private audioRinging = new Audio();

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private service: CallService,
    private router: Router,
    
  ) {
    this.audioBusy.src = '../../../assets/sounds/busy.mp3';
    this.audioBusy.load();
    this.audioBusy.loop = true;

    this.audioCalling.src = '../../../assets/sounds/calling.mp3';
    this.audioCalling.load();
    this.audioCalling.loop = true;

    this.audioRinging.src = '../../../assets/sounds/ring.mp3';
    this.audioRinging.load();
    this.audioRinging.loop = true;
  }

  rtcSetup() {
    const options = {
      host: 'telemedicin.ir', //'telemedicin.ir',
      port: 8443, // todo change it on https to 443
      path: '/rtcServer',
      iceServers: [
        { urls: 'stun:telemedicin.ir' },
        { urls: 'turn:telemedicin.ir:3478', username: 'test', credential: 'test123' }
      ],
    };

    // this.peer = new Peer('peer' + this.auth.currentUser._id, options);
    this.peer = new Peer(options);
    this.peer.on('open', (id) => {
      //console.log('My peer ID is: ' + id);
      this.auth.peer(id).subscribe(
        (response) => {
          //console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    });

    this.peer.on('call', (call) => {
      this.receivedCall = call;

      console.log(this.receivedCall);
      
      this.audioRinging.play();
      this.timeoutObj = setTimeout(() => {
        this.closeAll();
      }, 60000);

      this.callingUser = {
        id: call.metadata._id,
        name: call.metadata.name,
        image: call.metadata.image,
        peer: call.peer,
        conversationId: call.metadata.conversationId
      };
      this.callSubject.next(this.callingUser);
    });
    this.peer.on('error', (err) => {
      this.callNotAnswered();
      this.router.navigateByUrl('/chat');
      return this.toastr.warning('مخاطب در دسترس نمی باشد، لطفا بعدا تلاش نمایید', '');
    });
  }

  async startCall(remotePeerId: any, conversationId: any, remoteUserId: any, type: any) {
    navigator.mediaDevices
      .getUserMedia(type)
      .then((stream) => {
        this.sentCallStream = stream;
        this.selfStreamSubject.next(this.sentCallStream);

        this.sentCall = this.peer.call(remotePeerId, this.sentCallStream, {
          metadata: {
            _id: this.auth.currentUser._id,
            conversationId,
            name: this.auth.currentUser.name,
            image: this.auth.currentUser.image,
            type,
          },
        });

        console.log(this.sentCall);
        this.service.postMissedCall(conversationId, this.sentCall.connectionId, this.auth.currentUser._id);
        this.sentCall.on('stream', (remoteStream) => {
          this.callAnswered();
          this.remoteStreamSubject.next(remoteStream);
        });
      })
      .catch((err) => {
        this.callNotAnswered();
        this.toastr.error(err, 'خطا');
      });
    this.audioCalling.play();
    this.timeoutObj = setTimeout(() => {
      this.callNotAnswered();
    }, 70000);
  }

  callNotAnswered() {
    clearTimeout(this.timeoutObj);
    this.audioCalling.pause();
    this.audioCalling.currentTime = 0;
    this.closeSentCallStream();
  }

  callAnswered() {
    clearTimeout(this.timeoutObj);
    this.audioCalling.pause();
    this.audioCalling.currentTime = 0;
    this.audioRinging.pause();
    this.audioRinging.currentTime = 0;
  }

  callRejected() {
    clearTimeout(this.timeoutObj);
    this.audioRinging.pause();
    this.audioRinging.currentTime = 0;
    this.audioCalling.pause();
    this.audioCalling.currentTime = 0;
    this.audioBusy.play();

    setTimeout(() => {
      this.closeAll();
      this.callClosedSubject.next();
    }, 3000);
  }

  rejectCall() {
    this.audioRinging.pause();
    this.audioRinging.currentTime = 0;

    this.service.postRejected(this.callingUser).subscribe(
      (response) => {},
      (error) => {
        console.log(close);
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  answerCall() {
    console.log(this.receivedCall.metadata.type);
    navigator.mediaDevices
      .getUserMedia(this.receivedCall.metadata.type)
      .then((stream) => {
        this.receivedCallStream = stream;
        this.selfStreamSubject.next(this.receivedCallStream);
     
        this.receivedCall.answer(this.receivedCallStream);
        this.receivedCall.on('stream', (remoteStream) => {
          this.callAnswered();
          this.service.postAnswered(this.receivedCall.connectionId).subscribe(
            (response) => {},
            (error) => {}
          );
          this.remoteStreamSubject.next(remoteStream);
        });
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
        this.closeAll();
      });
  }


  muteSentCallStream() {
    try {
      this.sentCallStream.getAudioTracks()[0].enabled = false;
    } catch {}
  }
  
  muteReceivedCallStream() {
    try {
      this.receivedCallStream.getAudioTracks()[0].enabled = false;
    } catch {}
  }
  unMuteSentCallStream() {
    try {
      this.sentCallStream.getAudioTracks()[0].enabled = true;
    } catch {}
  }
  
  unMuteReceivedCallStream() {
    try {
      this.receivedCallStream.getAudioTracks()[0].enabled = true;
    } catch {}
  }

  hideSentCallStream() {
    try {
      this.sentCallStream.getVideoTracks()[0].enabled = false;
    } catch {}
  }
  
  hideReceivedCallStream() {
    try {
      this.receivedCallStream.getVideoTracks()[0].enabled = false;
    } catch {}
  }
  unHideSentCallStream() {
    try {
      this.sentCallStream.getVideoTracks()[0].enabled = true;
    } catch {}
  }
  
  unHideReceivedCallStream() {
    try {
      this.receivedCallStream.getVideoTracks()[0].enabled = true;
    } catch {}
  }


  closeReceivedCallStream() {
    try {
      this.receivedCall.close();
      this.receivedCallStream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch {}
  }
  closeSentCallStream() {
    try {
      this.sentCall.close();
      this.sentCallStream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch {}
  }

  closeAll() {
    this.audioCalling.pause();
    this.audioCalling.currentTime = 0;
    this.audioRinging.pause();
    this.audioRinging.currentTime = 0;
    this.audioBusy.pause();
    this.audioBusy.currentTime = 0;

    this.closeSentCallStream();
    this.closeReceivedCallStream();
  }
}
