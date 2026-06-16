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
import FlowManager from '../manager/FlowManager';
import TextEffectFlowState from '../model/TextEffectFlowState';
import TextGradientView from '../view/TextGradientView';
import TextMarqueeView from '../view/TextMarqueeView';
import TextReflectionView from '../view/TextReflectionView';
import TextScrollingView from '../view/TextScrollingView';

@Entry
@Component
struct Index {
  @State inputText: string = FlowManager.getState().inputText;
  @State selectedEffect: number = FlowManager.getState().selectedEffect;
  @State containerWidth: number = 0;
  @State flowStatus: string = FlowManager.getStatus();

  private flowListener = (state: TextEffectFlowState, status: string): void => {
    this.inputText = state.inputText;
    this.selectedEffect = state.selectedEffect;
    this.flowStatus = status;
  };

  aboutToAppear(): void {
    FlowManager.subscribe(this.flowListener);
  }

  aboutToDisappear(): void {
    FlowManager.unsubscribe(this.flowListener);
  }

  private isDesktopLayout(): boolean {
    return this.containerWidth >= Constants.DESKTOP_BREAKPOINT;
  }

  private isTabletLayout(): boolean {
    return this.containerWidth >= Constants.TABLET_BREAKPOINT &&
      this.containerWidth < Constants.DESKTOP_BREAKPOINT;
  }

  private getSectionSpacing(): number {
    return this.isDesktopLayout() ? 20 : 16;
  }

  private getPagePadding(): number {
    if (this.isDesktopLayout()) {
      return 32;
    }
    if (this.isTabletLayout()) {
      return 24;
    }
    return 16;
  }

  private getCardPadding(): number {
    if (this.isDesktopLayout()) {
      return 24;
    }
    if (this.isTabletLayout()) {
      return 20;
    }
    return 14;
  }

  private getTitleFontSize(): number {
    if (this.isDesktopLayout()) {
      return 22;
    }
    if (this.isTabletLayout()) {
      return 20;
    }
    return 18;
  }

  private getContentFontSize(): number {
    if (this.isDesktopLayout()) {
      return 48;
    }
    if (this.isTabletLayout()) {
      return 38;
    }
    return 30;
  }

  private getPreviewHeight(): number {
    if (this.isDesktopLayout()) {
      return 320;
    }
    if (this.isTabletLayout()) {
      return 220;
    }
    return 160;
  }

  private getReflectionHeight(): number {
    if (this.isDesktopLayout()) {
      return 128;
    }
    if (this.isTabletLayout()) {
      return 100;
    }
    return 74;
  }

  private getInputHeight(): number {
    if (this.isDesktopLayout()) {
      return 60;
    }
    if (this.isTabletLayout()) {
      return 54;
    }
    return 48;
  }

  private getButtonHeight(): number {
    return this.isDesktopLayout() ? 44 : 40;
  }

  private getButtonFontSize(): number {
    return this.isDesktopLayout() ? 16 : 14;
  }

  private getPreviewPadding(): number {
    return this.isDesktopLayout() ? 24 : 16;
  }

  private getScrollDuration(): number {
    if (this.isDesktopLayout()) {
      return 7000;
    }
    if (this.isTabletLayout()) {
      return 6000;
    }
    return Constants.TEXT_SCROLL_DURATION;
  }

  private getMarqueeTextWidth(): string {
    if (this.isDesktopLayout()) {
      return '72%';
    }
    if (this.isTabletLayout()) {
      return '82%';
    }
    return Constants.MARQUEE_TEXT_WIDTH;
  }

  private getContentMaxWidth(): number {
    return this.isDesktopLayout() ? Constants.DESKTOP_MAX_WIDTH : Constants.TABLET_MAX_WIDTH;
  }

  private getPreviewText(): string {
    return this.inputText.length > 0 ? this.inputText : 'Type text to preview.';
  }

  @Builder
  sectionTitle(title: string, subtitle: string) {
    Column({ space: 4 }) {
      Text(title)
        .fontSize(this.getTitleFontSize())
        .fontColor($r('app.color.title_font_color'))
        .fontWeight(FontWeight.Medium)

      Text(subtitle)
        .fontSize(14)
        .fontColor('#5F6B7A')
        .lineHeight(20)
    }
    .width(Constants.FULL_PERCENT)
    .alignItems(HorizontalAlign.Start)
  }

  @Builder
  effectButton(title: string, index: number) {
    Button(title)
      .layoutWeight(1)
      .height(this.getButtonHeight())
      .fontSize(this.getButtonFontSize())
      .fontWeight(FontWeight.Medium)
      .type(ButtonType.Capsule)
      .backgroundColor(this.selectedEffect === index ? '#234AD9' : '#E8EDF8')
      .fontColor(this.selectedEffect === index ? Color.White : '#233142')
      .onClick(() => {
        this.selectedEffect = index;
        FlowManager.updateSelectedEffect(index);
      })
  }

  @Builder
  effectPreview() {
    if (this.selectedEffect === 0) {
      TextGradientView({
        message: this.getPreviewText(),
        fontSize: this.getContentFontSize()
      })
    } else if (this.selectedEffect === 1) {
      TextScrollingView({
        message: this.getPreviewText(),
        fontSize: this.getContentFontSize(),
        duration: this.getScrollDuration()
      })
    } else if (this.selectedEffect === 2) {
      TextReflectionView({
        message: this.getPreviewText(),
        fontSize: this.getContentFontSize(),
        reflectionHeight: this.getReflectionHeight()
      })
    } else {
      TextMarqueeView({
        message: this.getPreviewText(),
        fontSize: this.getContentFontSize(),
        textWidth: this.getMarqueeTextWidth()
      })
    }
  }

  @Builder
  selectorCard() {
    Column({ space: 16 }) {
      this.sectionTitle('Choose an effect', 'The same text can switch across four visual styles.')

      Column({ space: 10 }) {
        Row({ space: 10 }) {
          this.effectButton('Gradient', 0)
          this.effectButton('Highlight', 1)
        }
        .width(Constants.FULL_PERCENT)

        Row({ space: 10 }) {
          this.effectButton('Reflection', 2)
          this.effectButton('Marquee', 3)
        }
        .width(Constants.FULL_PERCENT)
      }
      .width(Constants.FULL_PERCENT)
    }
    .width(Constants.FULL_PERCENT)
    .padding(this.getCardPadding())
    .borderRadius($r('app.float.row_border_radius'))
    .backgroundColor(Color.White)
  }

  @Builder
  inputCard() {
    Column({ space: 16 }) {
      this.sectionTitle('Input text', 'Type any content and the preview will update immediately.')

      TextInput({ placeholder: 'Type text to preview.', text: this.inputText })
        .width(Constants.FULL_PERCENT)
        .height(this.getInputHeight())
        .fontSize(this.getButtonFontSize() + 1)
        .backgroundColor('#F5F7FB')
        .borderRadius(14)
        .padding({ left: 14, right: 14 })
        .onChange((value: string) => {
          this.inputText = value;
          FlowManager.updateInputText(value);
        })
    }
    .width(Constants.FULL_PERCENT)
    .padding(this.getCardPadding())
    .borderRadius($r('app.float.row_border_radius'))
    .backgroundColor(Color.White)
  }

  @Builder
  freeFlowCard() {
    Column({ space: 16 }) {
      this.sectionTitle('Free flow', 'Continue the current text effect session on another HarmonyOS device.')

      Text(this.flowStatus)
        .width(Constants.FULL_PERCENT)
        .fontSize(14)
        .fontColor('#4A5563')
        .lineHeight(20)

      Button('Start Free Flow')
        .width(Constants.FULL_PERCENT)
        .height(this.getButtonHeight() + 2)
        .fontSize(this.getButtonFontSize())
        .fontWeight(FontWeight.Medium)
        .type(ButtonType.Capsule)
        .backgroundColor('#122B7A')
        .fontColor(Color.White)
        .onClick(() => {
          FlowManager.requestContinuation();
        })
    }
    .width(Constants.FULL_PERCENT)
    .padding(this.getCardPadding())
    .borderRadius($r('app.float.row_border_radius'))
    .backgroundColor(Color.White)
  }

  @Builder
  previewCard() {
    Column({ space: 16 }) {
      this.sectionTitle('Live preview', 'The preview area grows with the screen size for tablets and desktop windows.')

      Column() {
        this.effectPreview()
      }
      .width(Constants.FULL_PERCENT)
      .height(this.getPreviewHeight())
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .padding(this.getPreviewPadding())
      .borderRadius(18)
      .backgroundColor('#F4F6FA')
    }
    .width(Constants.FULL_PERCENT)
    .padding(this.getCardPadding())
    .borderRadius($r('app.float.row_border_radius'))
    .backgroundColor(Color.White)
  }

  build() {
    Navigation() {
      Scroll() {
        Column() {
          if (this.isDesktopLayout()) {
            Row({ space: this.getSectionSpacing() }) {
              Column({ space: this.getSectionSpacing() }) {
                this.selectorCard()
                this.inputCard()
                this.freeFlowCard()
              }
              .layoutWeight(4)
              .alignItems(HorizontalAlign.Start)

              Column() {
                this.previewCard()
              }
              .layoutWeight(6)
            }
            .width(Constants.FULL_PERCENT)
            .alignItems(VerticalAlign.Top)
          } else {
            Column({ space: this.getSectionSpacing() }) {
              this.selectorCard()
              this.inputCard()
              this.freeFlowCard()
              this.previewCard()
            }
            .width(Constants.FULL_PERCENT)
          }
        }
        .width(Constants.FULL_PERCENT)
        .constraintSize({ maxWidth: this.getContentMaxWidth() })
        .alignItems(HorizontalAlign.Center)
        .padding({
          left: this.getPagePadding(),
          right: this.getPagePadding(),
          top: this.getPagePadding(),
          bottom: this.getPagePadding()
        })
        .onAreaChange((_, value) => {
          this.containerWidth = Number(value.width);
        })
      }
      .scrollBar(BarState.Auto)
      .width(Constants.FULL_PERCENT)
      .height(Constants.FULL_PERCENT)
    }
    .height(Constants.FULL_PERCENT)
    .width(Constants.FULL_PERCENT)
    .title($r('app.string.title'))
    .backgroundColor($r('app.color.page_background_color'))
    .mode(NavigationMode.Stack)
  }
}
