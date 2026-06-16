if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TextRefectionView_Params {
    message?: ResourceStr;
}
import Constants from "@bundle:com.example.texteffects/entry/ets/constants/Constants";
export default class TextRefectionView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new SynchedPropertyObjectOneWayPU(params.message, this, "message");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TextRefectionView_Params) {
        if (params.message === undefined) {
            this.__message.set('');
        }
    }
    updateStateVars(params: TextRefectionView_Params) {
        this.__message.reset(params.message);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.linearGradient({
                direction: GradientDirection.Bottom,
                colors: [[Color.Transparent, 0], [Color.Transparent, 0.50],
                    [Color.Red, 0.50], [{ "id": 16777233, "type": 10001, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" }, 1]]
            });
            Stack.height({ "id": 16777239, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Stack.alignContent(Alignment.Top);
            Stack.blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize({ "id": 16777236, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Text.fontColor(Color.Red);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize({ "id": 16777236, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
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
