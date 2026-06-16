if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TextMarqueeView_Params {
    message?: ResourceStr;
    fontSize?: number;
    textWidth?: string;
}
import Constants from "@bundle:com.example.texteffects/entry/ets/constants/Constants";
export default class TextMarqueeView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new SynchedPropertyObjectOneWayPU(params.message, this, "message");
        this.__fontSize = new SynchedPropertySimpleOneWayPU(params.fontSize, this, "fontSize");
        this.__textWidth = new SynchedPropertySimpleOneWayPU(params.textWidth, this, "textWidth");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TextMarqueeView_Params) {
        if (params.message === undefined) {
            this.__message.set('');
        }
        if (params.fontSize === undefined) {
            this.__fontSize.set(30);
        }
        if (params.textWidth === undefined) {
            this.__textWidth.set(Constants.MARQUEE_TEXT_WIDTH);
        }
    }
    updateStateVars(params: TextMarqueeView_Params) {
        this.__message.reset(params.message);
        this.__fontSize.reset(params.fontSize);
        this.__textWidth.reset(params.textWidth);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__fontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__textWidth.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__fontSize.aboutToBeDeleted();
        this.__textWidth.aboutToBeDeleted();
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
    private __textWidth: SynchedPropertySimpleOneWayPU<string>;
    get textWidth() {
        return this.__textWidth.get();
    }
    set textWidth(newValue: string) {
        this.__textWidth.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(Constants.FULL_PERCENT);
            Row.linearGradient({
                angle: Constants.ANGLE_DEGREE_HORIZONTAL,
                colors: [[Color.Transparent, 0], [Color.Black, 0.2],
                    [Color.Black, 0.8], [Color.Transparent, 1]]
            });
            Row.blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.blendMode(BlendMode.SRC_IN, BlendApplyType.OFFSCREEN);
            Column.backgroundColor(Color.Transparent);
            Column.width(Constants.FULL_PERCENT);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.width(this.textWidth);
            Text.fontColor(Color.Black);
            Text.fontSize(this.fontSize);
            Text.fontWeight(FontWeight.Bold);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.MARQUEE });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
