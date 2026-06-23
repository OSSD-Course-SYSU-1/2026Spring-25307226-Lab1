if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    inputText?: string;
    selectedEffect?: number;
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
        this.__inputText = new ObservedPropertySimplePU('这是一段文字示例', this, "inputText");
        this.__selectedEffect = new ObservedPropertySimplePU(0, this, "selectedEffect");
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
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedEffect.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputText.aboutToBeDeleted();
        this.__selectedEffect.aboutToBeDeleted();
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
    sectionTitle(title: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(Constants.FULL_PERCENT);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize({ "id": 16777240, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Text.fontColor({ "id": 16777234, "type": 10001, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Text.fontWeight(Constants.FONT_WEIGHT_500);
        }, Text);
        Text.pop();
        Row.pop();
    }
    effectButton(title: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(title);
            Button.fontSize(14);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(this.selectedEffect === index ? '#623AA2' : '#E9ECEF');
            Button.fontColor(this.selectedEffect === index ? Color.White : '#333333');
            Button.borderRadius(18);
            Button.height(36);
            Button.padding({ left: 14, right: 14 });
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
                                let componentCall = new TextGradientView(this, { message: this.inputText }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 67, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.inputText
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.inputText
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
                                let componentCall = new TextScrollingView(this, { message: this.inputText }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 69, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.inputText
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.inputText
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
                                let componentCall = new TextReflectionView(this, { message: this.inputText }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 71, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.inputText
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.inputText
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
                                let componentCall = new TextMarqueeView(this, { message: this.inputText }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 73, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: this.inputText
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: this.inputText
                                });
                            }
                        }, { name: "TextMarqueeView" });
                    }
                });
            }
        }, If);
        If.pop();
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
            Column.create();
            Column.width(Constants.FULL_PERCENT);
            Column.height(Constants.FULL_PERCENT);
            Column.padding({
                left: { "id": 16777235, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" },
                right: { "id": 16777235, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" },
                top: 20
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 第一行：文字特效选择
            Column.create();
            // 第一行：文字特效选择
            Column.borderRadius({ "id": 16777237, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            // 第一行：文字特效选择
            Column.backgroundColor(Color.White);
            // 第一行：文字特效选择
            Column.padding({ "id": 16777238, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            // 第一行：文字特效选择
            Column.width(Constants.FULL_PERCENT);
            // 第一行：文字特效选择
            Column.margin({ bottom: 16 });
        }, Column);
        this.sectionTitle.bind(this)('第一行：文字特效选择');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width(Constants.FULL_PERCENT);
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.effectButton.bind(this)('渐变', 0);
        this.effectButton.bind(this)('滚动', 1);
        this.effectButton.bind(this)('倒影', 2);
        this.effectButton.bind(this)('跑马灯', 3);
        Row.pop();
        // 第一行：文字特效选择
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 第二行：用户输入需要进行文字特效处理的文本
            Column.create();
            // 第二行：用户输入需要进行文字特效处理的文本
            Column.borderRadius({ "id": 16777237, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            // 第二行：用户输入需要进行文字特效处理的文本
            Column.backgroundColor(Color.White);
            // 第二行：用户输入需要进行文字特效处理的文本
            Column.padding({ "id": 16777238, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            // 第二行：用户输入需要进行文字特效处理的文本
            Column.width(Constants.FULL_PERCENT);
            // 第二行：用户输入需要进行文字特效处理的文本
            Column.margin({ bottom: 16 });
        }, Column);
        this.sectionTitle.bind(this)('第二行：输入需要处理的文本');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入文字内容', text: this.inputText });
            TextInput.width(Constants.FULL_PERCENT);
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.backgroundColor('#F8F9FA');
            TextInput.borderRadius(12);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
        }, TextInput);
        // 第二行：用户输入需要进行文字特效处理的文本
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 第三行：展示处理后的文字特效结果
            Column.create();
            // 第三行：展示处理后的文字特效结果
            Column.borderRadius({ "id": 16777237, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            // 第三行：展示处理后的文字特效结果
            Column.backgroundColor(Color.White);
            // 第三行：展示处理后的文字特效结果
            Column.padding({ "id": 16777238, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            // 第三行：展示处理后的文字特效结果
            Column.width(Constants.FULL_PERCENT);
            // 第三行：展示处理后的文字特效结果
            Column.margin({ bottom: 16 });
        }, Column);
        this.sectionTitle.bind(this)('第三行：文字特效处理结果');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(Constants.FULL_PERCENT);
            Row.height(96);
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
            Row.backgroundColor('#F8F9FA');
            Row.borderRadius(12);
            Row.padding(12);
        }, Row);
        this.effectPreview.bind(this)();
        Row.pop();
        // 第三行：展示处理后的文字特效结果
        Column.pop();
        Column.pop();
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
