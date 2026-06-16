if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TextGradientView_Params {
    message?: ResourceStr;
}
export default class TextGradientView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new SynchedPropertyObjectOneWayPU(params.message, this, "message");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TextGradientView_Params) {
        if (params.message === undefined) {
            this.__message.set('');
        }
    }
    updateStateVars(params: TextGradientView_Params) {
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
            Row.create();
            Row.linearGradient({
                direction: GradientDirection.Right,
                colors: [[{ "id": 16777230, "type": 10001, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" }, 0.0], [{ "id": 16777229, "type": 10001, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" }, 1]]
            });
            Row.blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.fontSize({ "id": 16777236, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
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
