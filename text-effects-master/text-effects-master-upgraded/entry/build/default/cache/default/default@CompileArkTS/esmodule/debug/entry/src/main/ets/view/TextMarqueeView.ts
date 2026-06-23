if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TextGradientView_Params {
    message?: ResourceStr;
}
import Constants from "@bundle:com.example.texteffects/entry/ets/constants/Constants";
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
            Text.width({ "id": 16777221, "type": 10003, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Text.fontColor(Color.Black);
            Text.fontSize({ "id": 16777236, "type": 10002, params: [], "bundleName": "com.example.texteffects", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
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
