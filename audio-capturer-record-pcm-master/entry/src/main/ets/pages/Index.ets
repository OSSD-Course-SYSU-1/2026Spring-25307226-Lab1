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

import { abilityAccessCtrl, common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { fileIo as fs } from '@kit.CoreFileKit';
import { RecordFileInfo } from '../model/RecordFileInfo';
import { Constants } from '../common/Constants';
import { checkPermission, requestPermissions } from '../utils/PermissionUtil';
import { Logger } from '../utils/Logger';
import { RecordDialog } from '../components/RecordDialog';
import { toDateStr, toTimeStr } from '../utils/StringUtil';
import { AudioRendererController } from '../controller/AudioRendererController';

const TAG: string = 'Index';

@Entry
@Component
struct Index {
  @State isPlay: boolean = false;
  @State isRecord: boolean = false;
  @State recordFiles: RecordFileInfo[] = [];
  @StorageLink('CurrentTime') currentTime: number = 0;
  private context: Context = this.getUIContext().getHostContext()!;
  private audioRendererController?: AudioRendererController;
  private timeout: number = -1;

  aboutToAppear(): void {
    checkPermission(Constants.MICROPHONE_PERMISSION)
      .then((status: abilityAccessCtrl.GrantStatus) => {
        if (status === abilityAccessCtrl.GrantStatus.PERMISSION_DENIED) {
          requestPermissions(this.context as common.UIAbilityContext, [Constants.MICROPHONE_PERMISSION]);
        }
      })
      .catch((err: BusinessError) => {
        Logger.error(TAG, `Check permission failed, ${JSON.stringify(err)}`);
      });
    this.loadAudioFiles();
  }

  aboutToDisappear(): void {
    this.playerRelease();
  }
  
  onPageHide(): void {
    if (this.isPlay) {
      this.audioRendererController?.pauseRenderer();
      this.isPlay = false;
    }
  }

  async loadAudioFiles() {
    try {
      let dataPath: string = this.context.filesDir;
      let fileNames: string[] = fs.listFileSync(dataPath);
      let len: number = fileNames.length;
      let recordFiles: RecordFileInfo[] = [];
      for (let i = 0; i < len; i++) {
        let path: string = dataPath + `/${fileNames[i]}`;
        let stat: fs.Stat = fs.statSync(path);
        let mtime: number = stat.mtime;
        let size: number = stat.size;
        recordFiles.push({ name: fileNames[i], modifiedTime: mtime, size: size });
      }
      recordFiles.sort((a, b) => b.modifiedTime - a.modifiedTime);
      this.recordFiles = recordFiles;
      if (len > 0 && !this.audioRendererController) {
        let path: string = this.getUIContext().getHostContext()!.filesDir + `/example.pcm`;
        this.audioRendererController = new AudioRendererController();
        this.audioRendererController.initRenderer(path);
      }
    } catch (error) {
      Logger.error(TAG, `loadAudioFiles error. message:${(error as BusinessError).message}`);
    }
  }

  async playerRelease(): Promise<void> {
    this.isPlay = false;
    AppStorage.setOrCreate('CurrentTime', 0);
    this.audioRendererController?.stopRenderer().then(() => {
      this.audioRendererController = undefined;
    });
  }

  debounce(fn: Function, wait: number = 300) {
    if (this.timeout !== -1) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(fn.bind(this), wait);
  }

  @Builder
  recordDialogBuilder() {
    RecordDialog({ isRecord: this.isRecord })
  }

  @Builder
  listCard(info: RecordFileInfo) {
    Column() {
      Row() {
        Column({ space: 8 }) {
          Text(info.name)
            .maxLines(1)
            .fontSize(18)
            .fontWeight(600)
            .fontColor('rgb(25, 25, 25)')
            .textOverflow({ overflow: TextOverflow.Ellipsis })
          Text(toDateStr(info.modifiedTime))
            .maxLines(1)
            .fontSize(12.5)
            .fontWeight(400)
            .fontColor('rgba(0, 0, 0, 0.6)')
        }
        .height('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Start)

        Row({ space: 16 }) {
          Text(toTimeStr(info.size))
            .maxLines(1)
            .fontSize(18)
            .fontWeight(600)
            .fontColor('rgba(9, 3, 3, 0.9)')

          Button() {
            Image(this.isPlay ? $r('app.media.pause') : $r('app.media.play'))
              .onClick(() => {
                this.debounce(() => {
                  if (this.isPlay) {
                    this.audioRendererController?.pauseRenderer();
                    this.isPlay = false;
                  } else {
                    this.audioRendererController?.startRenderer();
                    this.isPlay = true;
                  }
                }, 100);
              })
          }
          .width(28)
          .aspectRatio(1)
          .backgroundColor(Color.Transparent)
        }
        .height('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.End)
        .alignItems(VerticalAlign.Center)
      }
      .height('50%')

      Column() {
        Progress({ value: this.currentTime, total: info.size, type: ProgressType.Linear })
          .color('#0A59F7')
          .width('100%')
        Row() {
          Text(toTimeStr(this.currentTime))
            .maxLines(1)
            .fontSize(12.5)
            .fontWeight(400)
            .fontColor('rgba(0, 0, 0, 0.6)')

          Text(toTimeStr(info.size))
            .maxLines(1)
            .fontSize(12.5)
            .fontWeight(400)
            .fontColor('rgba(0, 0, 0, 0.6)')
        }
        .padding({ top: 8 })
        .width('100%')
        .justifyContent(FlexAlign.SpaceBetween)
      }
      .padding({ top: 16 })
      .width('100%')
      .height('50%')
    }
    .width('100%')
    .height('100%')
    .borderRadius(14)
    .backgroundColor(Color.White)
    .padding(16)
  }

  @Builder
  deleteCard(index: number) {
    Row() {
      Button({ type: ButtonType.Circle }) {
        Image($r('app.media.trash'))
          .padding(5)
          .fillColor(Color.White)
      }
      .width(35)
      .aspectRatio(1)
      .backgroundColor(Color.Red)
      .onClick(() => {
        this.playerRelease().then(() => {
          let context: Context = this.getUIContext().getHostContext()!;
          let path: string = context.filesDir + `/${this.recordFiles[index].name}`;
          try {
            fs.unlinkSync(path);
          } catch (error) {
            Logger.error(TAG, `Unlink record file failed, path: ${path}, ${(error as BusinessError).message}`);
            return;
          }
          this.recordFiles.splice(index, 1);
        });
      })
    }
    .padding(10)
    .height('100%')
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Flex({ direction: FlexDirection.Column }) {
        Text($r('app.string.record_audio_base_on_audiocapturer'))
          .width('100%')
          .fontSize(30)
          .fontWeight(700)
          .lineHeight(40)
          .margin({ top: 64 })
          .padding({
            left: 16,
            right: 16
          })
          .textAlign(TextAlign.Start)

        List({ space: 8 }) {
          ForEach(
            this.recordFiles,
            (info: RecordFileInfo, index: number) => {
              ListItem() {
                this.listCard(info)
              }
              .height(120)
              .width('100%')
              .borderRadius(14)
              .swipeAction({
                end: {
                  builder: () => {
                    this.deleteCard(index)
                  }
                }
              })
            },
            (info: RecordFileInfo) => JSON.stringify(info)
          )
        }
        .width('100%')
        .height('100%')
        .layoutWeight(1)
        .contentEndOffset(10)
        .contentStartOffset(10)
        .padding({
          top: 16,
          left: 16,
          right: 16
        })
      }
      .width('100%')
      .height('100%')

      Button({ type: ButtonType.Circle }) {
        Circle()
          .width(20)
          .aspectRatio(1)
          .fill(Color.White)
      }
      .width(56)
      .aspectRatio(1)
      .backgroundColor('#0A59F7')
      .margin({ bottom: 32 })
      .onClick(() => {
        this.playerRelease();
        this.isRecord = true;
      })
      .bindSheet($$this.isRecord, this.recordDialogBuilder(), {
        detents: [SheetSize.MEDIUM],
        blurStyle: BlurStyle.Thick,
        showClose: false,
        dragBar: false,
        shouldDismiss: (() => {
          this.isRecord = true;
        }),
        backgroundColor: Color.White,
        title: { title: 'Record' },
        onDisappear: (() => {
          this.loadAudioFiles();
        })
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_color'))
  }
}