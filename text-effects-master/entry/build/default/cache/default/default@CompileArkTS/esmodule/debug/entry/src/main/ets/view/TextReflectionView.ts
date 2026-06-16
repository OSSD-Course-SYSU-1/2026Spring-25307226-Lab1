if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TextReflectionView_Params {
    message?: ResourceStr;
    fontSize?: number;
    reflectionHeight?: number;
}
import Constants from "@bundle:com.example.texteffects/entry/ets/constants/Constants";
export default class TextReflectionView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new SynchedPropertyObjectOneWayPU(params.message, this, "message");
        this.__fontSize = new SynchedPropertySimpleOneWayPU(params.fontSize, this, "fontSize");
        this.__reflectionHeight = new SynchedPropertySimpleOneWayPU(params.reflectionHeight, this, "reflectionHeight");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TextReflectionView_Params) {
        if (params.message === undefined) {
            this.__message.set('');
        }
        if (params.fontSize === undefined) {
            this.__fontSize.set(30);
        }
        if (params.reflectionHeight === undefined) {
            this.__reflectionHeight.set(74);
        }
    }
    updateStateVars(params: TextReflectionView_Params) {
        this.__message.reset(params.message);
        this.__fontSize.reset(params.fontSize);
        this.__reflectionHeight.reset(params.reflectionHeight);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__fontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__reflectionHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__fontSize.aboutToBeDeleted();
        this.__reflectionHeight.aboutToBeDeleted();
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
    private __reflectionHeight: SynchedPropertySimpleOneWayPU<number>;
    get reflectionHeight() {
        return this.__reflectionHeight.get();
    }
    set reflectionHeight(newValue: number) {
        this.__reflectionHeight.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.linearGradient({
                direction: GradientDirection.Bottom,
                colors: [[Color.Transparent, 0], [Color.Transparent, 0.50],
                    [Color.Red, 0.50], [{ "id": 16777233, "type": 10001, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" }, 1]]
            });
            Stack.height(this.reflectionHeight);
            Stack.alignContent(Alignment.Top);
            Stack.blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize(this.fontSize);
            Text.fontColor(Color.Red);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize(this.fontSize);
            Text.fontColor(Color.Red);
            Text.fontWeight(FontWeight.Bold);
            Text.rotate({
                x: 1,
                y: 0,
                z: 0,
                angle: Constants.ANGLE_DEGREE,
                centerX: Constants.FIFTY_PERCENT,
                centerY: Constants.FULL_PERCENT
            });
            Text.blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN);
        }, Text);
        Text.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
