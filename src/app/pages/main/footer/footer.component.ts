import { Component, OnInit } from '@angular/core';
import { version } from './../../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public appVersion = version;
  public isMobile = false;
  constructor() {}

  ngOnInit() {
    if (window.innerWidth < window.innerHeight){
      this.isMobile = true;
    }
  }
}
