if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TextScrollingView_Params {
    message?: ResourceStr;
    value?: number;
}
import Constants from "@bundle:com.example.texteffects/entry/ets/constants/Constants";
export default class TextScrollingView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new SynchedPropertyObjectOneWayPU(params.message, this, "message");
        this.__value = new ObservedPropertySimplePU(0, this, "value");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TextScrollingView_Params) {
        if (params.message === undefined) {
            this.__message.set('');
        }
        if (params.value !== undefined) {
            this.value = params.value;
        }
    }
    updateStateVars(params: TextScrollingView_Params) {
        this.__message.reset(params.message);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: SynchedPropertySimpleOneWayPU<ResourceStr>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: ResourceStr) {
        this.__message.set(newValue);
    }
    private __value: ObservedPropertySimplePU<number>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: number) {
        this.__value.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.linearGradient({
                direction: GradientDirection.Right,
                colors: [[Color.Red, 0.0], [Color.Red, this.value], [Color.Black, this.value], [Color.Black, 1.0]]
            });
            Row.blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN);
            Row.backgroundImageSize({
                width: 0,
                height: 0
            });
            Row.onAppear(() => {
                this.getUIContext().animateTo({
                    duration: Constants.TEXT_SCROLL_DURATION,
                    finishCallbackType: FinishCallbackType.LOGICALLY,
                    curve: Curve.Linear,
                    iterations: -1,
                    onFinish: () => {
                        this.value = 0;
                    }
                }, () => {
                    this.value = 1;
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize({ "id": 16777236, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Text.fontColor(Color.Black);
            Text.fontWeight(FontWeight.Bold);
            Text.blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
