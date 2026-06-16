if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TextScrollingView_Params {
    message?: ResourceStr;
    fontSize?: number;
    duration?: number;
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
        this.__fontSize = new SynchedPropertySimpleOneWayPU(params.fontSize, this, "fontSize");
        this.__duration = new SynchedPropertySimpleOneWayPU(params.duration, this, "duration");
        this.__value = new ObservedPropertySimplePU(0, this, "value");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TextScrollingView_Params) {
        if (params.message === undefined) {
            this.__message.set('');
        }
        if (params.fontSize === undefined) {
            this.__fontSize.set(30);
        }
        if (params.duration === undefined) {
            this.__duration.set(Constants.TEXT_SCROLL_DURATION);
        }
        if (params.value !== undefined) {
            this.value = params.value;
        }
    }
    updateStateVars(params: TextScrollingView_Params) {
        this.__message.reset(params.message);
        this.__fontSize.reset(params.fontSize);
        this.__duration.reset(params.duration);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__fontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__duration.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__fontSize.aboutToBeDeleted();
        this.__duration.aboutToBeDeleted();
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
    private __fontSize: SynchedPropertySimpleOneWayPU<number>;
    get fontSize() {
        return this.__fontSize.get();
    }
    set fontSize(newValue: number) {
        this.__fontSize.set(newValue);
    }
    private __duration: SynchedPropertySimpleOneWayPU<number>;
    get duration() {
        return this.__duration.get();
    }
    set duration(newValue: number) {
        this.__duration.set(newValue);
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
                    duration: this.duration,
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
            Text.fontSize(this.fontSize);
            Text.fontColor(Color.Black);
            Text.fontWeight(FontWeight.Bold);
            Text.maxLines(1);
            Text.blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
