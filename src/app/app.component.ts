import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})


export class AppComponent {
  constructor(titleService: Title, router: Router) {
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join('-').replace(',','');
    
        titleService.setTitle(title);
      }
    });
  }
  public barLabel: string = "Password strength:";  

  // collect that title data properties from all child routes
  // there might be a better way but this worked for me
  getTitle(state, parent) {
    let data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
}
