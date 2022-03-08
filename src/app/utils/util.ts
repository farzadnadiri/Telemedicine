import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { FormGroup } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);
@Injectable({
  providedIn: 'root',
})
export class Util {
  constructor(private configService: ConfigService) {}

  public getUploadUrl(filename) {
    return this.configService.getUploadRoute() + filename;
  }
  public getAvatarThumbnail(filename) {
    return `${this.configService.getUploadRoute()}thumb-${filename}`;
  }

  public matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ notEquivalent: true });
        return {
          mismatchedPasswords: true,
        };
      }
    };
  }

  public timeInMins(value) {
    if (!value) {
      return 0;
    }
    return value.hour * 60 + value.minute;
  }

  public timeToString(time: NgbTimeStruct | null): string | null {
    return time != null ? `${pad(time.hour)}:${pad(time.minute)}` : null;
  }
  public playAlarm() {
    const audio = new Audio();
    audio.src = '../../../assets/sounds/alarm.mp3';
    audio.load();
    audio.play();
  }

  public playMessage() {
    const audio = new Audio();
    audio.src = '../../../assets/sounds/message.mp3';
    audio.load();
    audio.play();
  }

  public getDayNameFromIndex(input) {
    switch (input) {
      case 0:
        return 'شنبه';
      case 1:
        return 'یکشنبه';
      case 2:
        return 'دوشنبه';
      case 3:
        return 'سه شنبه';
      case 4:
        return 'چهارشنبه';
      case 5:
        return 'پنج شنبه';
      case 6:
        return 'جمعه';
    }
  }
}
