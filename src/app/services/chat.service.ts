import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public pageSize: number;
  private apiName: string;
  public chatUnseenCount: number;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.pageSize = 2 * +this.config.get('PageSize');
    this.apiName = 'CHAT';
  }

  sendMessage(message) {
    return this.http
      .post(this.config.getApi(this.apiName), JSON.stringify(message))
      .map((response) => response)
      .catch(this.handleError);
  }

  loadConversations() {
    return this.http
      .get(this.config.getApi(this.apiName) + '/conversations')
      .map((response) => response)
      .catch(this.handleError);
  }

  loadChatStatus() {
    this.http
      .get(this.config.getApi(this.apiName) + '/status')
      .map((response) => response)
      .catch(this.handleError)
      .subscribe((result: any) => {
        this.chatUnseenCount = result.count;
      });
  }

  seenMessage(messageId) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/seenMessage', {
        params: new HttpParams().set('messageId', messageId),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getConversation(userId) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/conversation', {
        params: new HttpParams().set('userId', userId),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getOthersideId(conversationId) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/othersideId', {
        params: new HttpParams().set('conversationId', conversationId),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  loadMessages(page: number, conversationId: string) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/messages', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('conversationId', conversationId),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throwError(error);

    // if (error.status === 400)
    //   return Observable.throw(new BadInput(error.json()));
    // if (error.status === 404)
    //   return Observable.throw(new NotFoundError());
    // return Observable.throw(new AppError(error));
  }
}
