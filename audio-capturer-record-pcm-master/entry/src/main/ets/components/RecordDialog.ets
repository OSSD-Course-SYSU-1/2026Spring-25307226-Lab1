/*
 * Copyright (c) 2026 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Logger } from '../utils/Logger';
import { secToTimeStr } from '../utils/StringUtil';
import { BusinessError } from '@kit.BasicServicesKit';
import { startContinuousTask, stopContinuousTask } from '../utils/BackgroundTaskUtil';
import { AudioCapturerController } from '../controller/AudioCapturerController';

@Component
export struct RecordDialog {
  @State timeStr: string = '00:00:00';
  @State isStop: boolean = false;
  @Link isRecord: boolean;
  private recorderController: AudioCapturerController = new AudioCapturerController(this.getUIContext().getHostContext()!);
  private seconds: number = 0;
  private timer: number = 0;

  aboutToAppear() {
    try {
      this.recorderController.initCapturer().then(() => {
        this.recorderController.startCapturer();
      });
      this.getRecordTime();
    } catch (error) {
      Logger.error('TAG', `getDefaultDisplaySync error. message:${(error as BusinessError).message}`);
    }
    startContinuousTask(this.getUIContext().getHostContext());
  }

  getRecordTime(): void {
    this.timer = setInterval(() => {
      if (!this.isStop) {
        this.seconds += 1;
        this.timeStr = secToTimeStr(this.seconds);
      }
    }, 1000);
  }

  build() {
    Column() {
      Column() {
        Row() {
          Text(this.timeStr)
            .fontSize(24)
            .fontWeight(600)
            .fontColor('rgba(0, 0, 0, 0.9)')
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
      }
      .margin({
        left: 16,
        right: 16
      })
      .height('60%')
      .borderRadius(20)
      .backgroundColor($r('app.color.background_color'))
      .justifyContent(FlexAlign.Center)

      Row() {
        Button({ type: ButtonType.Circle }) {
          Rect({ radius: 4 })
            .width(20)
            .aspectRatio(1)
            .fill(Color.White)
        }
        .width(55)
        .margin({ right: 18 })
        .aspectRatio(1)
        .backgroundColor(Color.Red)
        .onClick(() => {
          this.isRecord = false;
          this.recorderController.stopCapturer().then(() => {
            this.recorderController.releaseCapturer();
          })
          clearInterval(this.timer);
          stopContinuousTask(this.getUIContext().getHostContext());
        })
      }
      .width('100%')
      .margin({ top: 24 })
      .justifyContent(FlexAlign.Center)
    }
    .width('100%')
    .margin({ top: 22 })
    .height('100%')
    .backgroundColor('rgb(255, 255, 255)')
    .borderRadius({
      topLeft: 45,
      topRight: 45
    })
  }
}