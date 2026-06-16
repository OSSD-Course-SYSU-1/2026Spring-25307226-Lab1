if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    inputText?: string;
    selectedEffect?: number;
    containerWidth?: number;
}
import Constants from "@bundle:com.example.texteffects/entry/ets/constants/Constants";
import TextGradientView from "@bundle:com.example.texteffects/entry/ets/view/TextGradientView";
import TextMarqueeView from "@bundle:com.example.texteffects/entry/ets/view/TextMarqueeView";
import TextReflectionView from "@bundle:com.example.texteffects/entry/ets/view/TextReflectionView";
import TextScrollingView from "@bundle:com.example.texteffects/entry/ets/view/TextScrollingView";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__inputText = new ObservedPropertySimplePU('This is a text example.', this, "inputText");
        this.__selectedEffect = new ObservedPropertySimplePU(0, this, "selectedEffect");
        this.__containerWidth = new ObservedPropertySimplePU(0, this, "containerWidth");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.selectedEffect !== undefined) {
            this.selectedEffect = params.selectedEffect;
        }
        if (params.containerWidth !== undefined) {
            this.containerWidth = params.containerWidth;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedEffect.purgeDependencyOnElmtId(rmElmtId);
        this.__containerWidth.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputText.aboutToBeDeleted();
        this.__selectedEffect.aboutToBeDeleted();
        this.__containerWidth.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    private __selectedEffect: ObservedPropertySimplePU<number>;
    get selectedEffect() {
        return this.__selectedEffect.get();
    }
    set selectedEffect(newValue: number) {
        this.__selectedEffect.set(newValue);
    }
    private __containerWidth: ObservedPropertySimplePU<number>;
    get containerWidth() {
        return this.__containerWidth.get();
    }
    set containerWidth(newValue: number) {
        this.__containerWidth.set(newValue);
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
    sectionTitle(title: string, subtitle: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.width(Constants.FULL_PERCENT);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(this.getTitleFontSize());
            Text.fontColor({ "id": 16777234, "type": 10001, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(subtitle);
            Text.fontSize(14);
            Text.fontColor('#5F6B7A');
            Text.lineHeight(20);
        }, Text);
        Text.pop();
        Column.pop();
    }
    effectButton(title: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(title);
            Button.layoutWeight(1);
            Button.height(this.getButtonHeight());
            Button.fontSize(this.getButtonFontSize());
            Button.fontWeight(FontWeight.Medium);
            Button.type(ButtonType.Capsule);
            Button.backgroundColor(this.selectedEffect === index ? '#234AD9' : '#E8EDF8');
            Button.fontColor(this.selectedEffect === index ? Color.White : '#233142');
            Button.onClick(() => {
                this.selectedEffect = index;
            });
        }, Button);
        Button.pop();
    }
    effectPreview(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedEffect === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new TextGradientView(this, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 187, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.getPreviewText(),
                                        fontSize: this.getContentFontSize()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize()
                                });
                            }
                        }, { name: "TextGradientView" });
                    }
                });
            }
            else if (this.selectedEffect === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new TextScrollingView(this, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize(),
                                    duration: this.getScrollDuration()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 192, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.getPreviewText(),
                                        fontSize: this.getContentFontSize(),
                                        duration: this.getScrollDuration()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize(),
                                    duration: this.getScrollDuration()
                                });
                            }
                        }, { name: "TextScrollingView" });
                    }
                });
            }
            else if (this.selectedEffect === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new TextReflectionView(this, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize(),
                                    reflectionHeight: this.getReflectionHeight()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 198, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.getPreviewText(),
                                        fontSize: this.getContentFontSize(),
                                        reflectionHeight: this.getReflectionHeight()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize(),
                                    reflectionHeight: this.getReflectionHeight()
                                });
                            }
                        }, { name: "TextReflectionView" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new TextMarqueeView(this, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize(),
                                    textWidth: this.getMarqueeTextWidth()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 204, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.getPreviewText(),
                                        fontSize: this.getContentFontSize(),
                                        textWidth: this.getMarqueeTextWidth()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.getPreviewText(),
                                    fontSize: this.getContentFontSize(),
                                    textWidth: this.getMarqueeTextWidth()
                                });
                            }
                        }, { name: "TextMarqueeView" });
                    }
                });
            }
        }, If);
        If.pop();
    }
    selectorCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width(Constants.FULL_PERCENT);
            Column.padding(this.getCardPadding());
            Column.borderRadius({ "id": 16777237, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Column.backgroundColor(Color.White);
        }, Column);
        this.sectionTitle.bind(this)('Choose an effect', 'The same text can switch across four visual styles.');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width(Constants.FULL_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width(Constants.FULL_PERCENT);
        }, Row);
        this.effectButton.bind(this)('Gradient', 0);
        this.effectButton.bind(this)('Highlight', 1);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width(Constants.FULL_PERCENT);
        }, Row);
        this.effectButton.bind(this)('Reflection', 2);
        this.effectButton.bind(this)('Marquee', 3);
        Row.pop();
        Column.pop();
        Column.pop();
    }
    inputCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width(Constants.FULL_PERCENT);
            Column.padding(this.getCardPadding());
            Column.borderRadius({ "id": 16777237, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Column.backgroundColor(Color.White);
        }, Column);
        this.sectionTitle.bind(this)('Input text', 'Type any content and the preview will update immediately.');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: 'Type text to preview.', text: this.inputText });
            TextInput.width(Constants.FULL_PERCENT);
            TextInput.height(this.getInputHeight());
            TextInput.fontSize(this.getButtonFontSize() + 1);
            TextInput.backgroundColor('#F5F7FB');
            TextInput.borderRadius(14);
            TextInput.padding({ left: 14, right: 14 });
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
        }, TextInput);
        Column.pop();
    }
    previewCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width(Constants.FULL_PERCENT);
            Column.padding(this.getCardPadding());
            Column.borderRadius({ "id": 16777237, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Column.backgroundColor(Color.White);
        }, Column);
        this.sectionTitle.bind(this)('Live preview', 'The preview area grows with the screen size for tablets and desktop windows.');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(Constants.FULL_PERCENT);
            Column.height(this.getPreviewHeight());
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(this.getPreviewPadding());
            Column.borderRadius(18);
            Column.backgroundColor('#F4F6FA');
        }, Column);
        this.effectPreview.bind(this)();
        Column.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Navigation.create(new NavPathStack(), { moduleName: "entry", pagePath: "entry/src/main/ets/pages/Index", isUserCreateStack: false });
            Navigation.height(Constants.FULL_PERCENT);
            Navigation.width(Constants.FULL_PERCENT);
            Navigation.title({ "id": 16777228, "type": 10003, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Navigation.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Navigation.mode(NavigationMode.Stack);
        }, Navigation);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Auto);
            Scroll.width(Constants.FULL_PERCENT);
            Scroll.height(Constants.FULL_PERCENT);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(Constants.FULL_PERCENT);
            Column.constraintSize({ maxWidth: this.getContentMaxWidth() });
            Column.alignItems(HorizontalAlign.Center);
            Column.padding({
                left: this.getPagePadding(),
                right: this.getPagePadding(),
                top: this.getPagePadding(),
                bottom: this.getPagePadding()
            });
            Column.onAreaChange((_, value) => {
                this.containerWidth = Number(value.width);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isDesktopLayout()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: this.getSectionSpacing() });
                        Row.width(Constants.FULL_PERCENT);
                        Row.alignItems(VerticalAlign.Top);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: this.getSectionSpacing() });
                        Column.layoutWeight(4);
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.selectorCard.bind(this)();
                    this.inputCard.bind(this)();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(6);
                    }, Column);
                    this.previewCard.bind(this)();
                    Column.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: this.getSectionSpacing() });
                        Column.width(Constants.FULL_PERCENT);
                    }, Column);
                    this.selectorCard.bind(this)();
                    this.inputCard.bind(this)();
                    this.previewCard.bind(this)();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        Navigation.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.texteffects", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
