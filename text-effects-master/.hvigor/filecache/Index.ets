/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
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

import Constants from '../constants/Constants';
import TextGradientView from '../view/TextGradientView';
import TextMarqueeView from '../view/TextMarqueeView';
import TextReflectionView from '../view/TextReflectionView';
import TextScrollingView from '../view/TextScrollingView';

@Entry
@Component
struct Index {
  @State inputText: string = '这是一段文字示例';
  @State selectedEffect: number = 0;

  @Styles
  cardStyle() {
    .borderRadius($r('app.float.row_border_radius'))
    .backgroundColor(Color.White)
    .padding($r('app.float.row_padding'))
    .width(Constants.FULL_PERCENT)
    .margin({ bottom: 16 })
  }

  @Builder
  sectionTitle(title: string) {
    Row() {
      Text(title)
        .fontSize($r('app.float.title_font_size'))
        .fontColor($r('app.color.title_font_color'))
        .fontWeight(Constants.FONT_WEIGHT_500)
    }
    .width(Constants.FULL_PERCENT)
    .margin({ bottom: 8 })
  }

  @Builder
  effectButton(title: string, index: number) {
    Button(title)
      .fontSize(14)
      .fontWeight(FontWeight.Medium)
      .backgroundColor(this.selectedEffect === index ? '#623AA2' : '#E9ECEF')
      .fontColor(this.selectedEffect === index ? Color.White : '#333333')
      .borderRadius(18)
      .height(36)
      .padding({ left: 14, right: 14 })
      .onClick(() => {
        this.selectedEffect = index;
      })
  }

  @Builder
  effectPreview() {
    if (this.selectedEffect === 0) {
      TextGradientView({ message: this.inputText })
    } else if (this.selectedEffect === 1) {
      TextScrollingView({ message: this.inputText })
    } else if (this.selectedEffect === 2) {
      TextReflectionView({ message: this.inputText })
    } else {
      TextMarqueeView({ message: this.inputText })
    }
  }

  build() {
    Navigation() {
      Column() {
        // 第一行：文字特效选择
        Column() {
          this.sectionTitle('第一行：文字特效选择')
          Row({ space: 8 }) {
            this.effectButton('渐变', 0)
            this.effectButton('滚动', 1)
            this.effectButton('倒影', 2)
            this.effectButton('跑马灯', 3)
          }
          .width(Constants.FULL_PERCENT)
          .justifyContent(FlexAlign.Start)
        }
        .cardStyle()

        // 第二行：用户输入需要进行文字特效处理的文本
        Column() {
          this.sectionTitle('第二行：输入需要处理的文本')
          TextInput({ placeholder: '请输入文字内容', text: this.inputText })
            .width(Constants.FULL_PERCENT)
            .height(48)
            .fontSize(16)
            .backgroundColor('#F8F9FA')
            .borderRadius(12)
            .padding({ left: 12, right: 12 })
            .onChange((value: string) => {
              this.inputText = value;
            })
        }
        .cardStyle()

        // 第三行：展示处理后的文字特效结果
        Column() {
          this.sectionTitle('第三行：文字特效处理结果')
          Row() {
            this.effectPreview()
          }
          .width(Constants.FULL_PERCENT)
          .minHeight(96)
          .justifyContent(FlexAlign.Center)
          .alignItems(VerticalAlign.Center)
          .backgroundColor('#F8F9FA')
          .borderRadius(12)
          .padding(12)
        }
        .cardStyle()
      }
      .width(Constants.FULL_PERCENT)
      .height(Constants.FULL_PERCENT)
      .padding({
        left: $r('app.float.area_padding_left'),
        right: $r('app.float.area_padding_left'),
        top: 20
      })
    }
    .height(Constants.FULL_PERCENT)
    .width(Constants.FULL_PERCENT)
    .title($r('app.string.title'))
    .backgroundColor($r('app.color.page_background_color'))
    .mode(NavigationMode.Stack)
  }
}
