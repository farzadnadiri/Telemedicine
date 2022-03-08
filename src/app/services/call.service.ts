import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private api: string;
  constructor(private http: HttpClient, private config: ConfigService, private chatService: ChatService) {
    this.api = 'CALL';
  }

  postClosed(data) {
    return this.http
      .post(this.config.getApi(this.api) + '/closed', JSON.stringify(data))
      .map((response) => response)
      .catch(this.handleError);
  }

  postRejected(data) {
    return this.http
      .post(this.config.getApi(this.api) + '/rejected', JSON.stringify(data))
      .map((response) => response)
      .catch(this.handleError);
  }

  postMissedCall(conversationId, connectionId, caller) {
  
    const message = {
      conversationId,
      body: 'تماس از دست رفته',
      type: 3,
      connectionId,
      caller
    };
    
    this.chatService.sendMessage(message).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  postAnswered(connectionId) {
    const data = {
      connectionId,
      action: 'answer'
    };

    return this.http
      .post(this.config.getApi(this.api) + '/answered', JSON.stringify(data))
      .map((response) => response)
      .catch(this.handleError);
  }


  getCanCall(conversationId) {
    return this.http
      .get(this.config.getApi(this.api) + '/canCall', {
        params: new HttpParams().set('conversationId', conversationId),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throwError(error);
  }
}
