# text-effects-master-upgraded-multidevice-freeflow

This directory keeps the free-flow version of the project.
The previous projects are preserved, and this folder contains the new code that adds a continuation framework on top of the multi-device layout version.

## What changed

This version keeps the original 4 text effects and adds a first-pass HarmonyOS free-flow implementation:

- multi-device UI support remains in place
- the main `EntryAbility` is marked as `continuable`
- the app requests `ohos.permission.DISTRIBUTED_DATASYNC`
- the current text content and selected effect can be packed into continuation data
- the landing device can restore that state when the continuation starts
- the page now provides a `Start Free Flow` action and a live status area

## Key files

- [AppScope/app.json5](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/AppScope/app.json5:1)
  Adds `reqPermissions` for `ohos.permission.DISTRIBUTED_DATASYNC`.

- [entry/src/main/module.json5](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/module.json5:1)
  Adds `continuable: true` to `EntryAbility`.

- [entry/src/main/ets/entryability/EntryAbility.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/entryability/EntryAbility.ets:1)
  Registers continuation, activates mission continuation, writes continuation payload in `onContinue`, and restores state from continuation input.

- [entry/src/main/ets/manager/FlowManager.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/manager/FlowManager.ets:1)
  Centralizes free-flow state, status text, continuation token management, payload serialization, and UI subscriptions.

- [entry/src/main/ets/model/TextEffectFlowState.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/model/TextEffectFlowState.ets:1)
  Defines the minimal business state that is transferred across devices.

- [entry/src/main/ets/pages/Index.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/pages/Index.ets:1)
  Syncs with `FlowManager`, keeps the responsive layout, and adds the free-flow control card.

## Current free-flow scope

The continuation payload currently contains:

- `inputText`
- `selectedEffect`

It intentionally does not migrate device-local values such as:

- current window width
- current responsive layout branch

Those values are recalculated on the destination device.

## Runtime flow

1. The app starts and registers with `continuationManager`.
2. The mission continuation state is set to active.
3. The page shows a `Start Free Flow` button.
4. When continuation starts, `onContinue()` writes the text and selected effect into `wantParam`.
5. When the target device launches with continuation data, the app restores the state and refreshes the UI.

## Notes

This is a framework-level implementation, not a fully verified production flow yet.
Actual continuation behavior still depends on your local HarmonyOS environment, permissions, distributed device availability, and DevEco Studio / SDK version.

## Suggested verification

Test at least these points:

1. The project builds in DevEco Studio.
2. The app starts on both source and target HarmonyOS devices.
3. The `Start Free Flow` button opens the device-selection flow.
4. After continuation, the target device restores the same text content.
5. After continuation, the target device restores the same selected text effect.

## Related docs in this folder

- [MULTI_DEVICE_GUIDE.md](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/MULTI_DEVICE_GUIDE.md)
- [FREE_FLOW_WORK_GUIDE.md](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/FREE_FLOW_WORK_GUIDE.md)

## Folder relationship

- original project:
  `C:\Users\31293\Desktop\workplace\text-effects-master-upgraded`
- multi-device version:
  `C:\Users\31293\Desktop\workplace\text-effects-master-upgraded-multidevice`
- free-flow version:
  `C:\Users\31293\Desktop\workplace\text-effects-master-upgraded-multidevice-freeflow`
