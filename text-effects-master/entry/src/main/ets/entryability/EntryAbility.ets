/*
* Copyright (C) 2024 Huawei Device Co., Ltd.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import continuationManager from '@ohos.continuation.continuationManager';
import FlowManager from '../manager/FlowManager';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
    this.restoreContinuationState(want, launchParam);
    this.registerContinuation();
  }

  onDestroy(): void {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
    this.unregisterContinuation();
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    // Main window is created, set main page for this ability
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
    this.activateContinuation();

    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'testTag', 'Succeeded in loading the content.');
    });
  }

  onWindowStageDestroy(): void {
    // Main window is destroyed, release UI related resources
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    // Ability has brought to foreground
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
  }

  onBackground(): void {
    // Ability has back to background
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
  }

  onContinue(wantParam: Record<string, Object>): AbilityConstant.OnContinueResult {
    FlowManager.writeToWantParam(wantParam);
    FlowManager.setStatus('Free flow payload has been prepared. Select a device to continue.');
    return AbilityConstant.OnContinueResult.AGREE;
  }

  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    this.restoreContinuationState(want, launchParam);
  }

  private restoreContinuationState(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    const restored: boolean = FlowManager.restoreFromWantParameters(want.parameters);
    if (restored || launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
      FlowManager.setStatus('Free flow session resumed on this device.');
    }
  }

  private registerContinuation(): void {
    FlowManager.setContinuationStarter(async () => {
      const token: number = FlowManager.getContinuationToken();
      if (token < 0) {
        FlowManager.setStatus('Free flow is still registering. Try again in a moment.');
        return;
      }

      try {
        await continuationManager.startContinuationDeviceManager(
          token,
          FlowManager.getContinuationOptions(this.context.abilityInfo.bundleName)
        );
        FlowManager.setStatus('Device chooser opened. Continue on the selected device.');
      } catch (_) {
        FlowManager.setStatus('Unable to open device chooser on the current device.');
      }
    });

    continuationManager.registerContinuation(
      FlowManager.getContinuationOptions(this.context.abilityInfo.bundleName)
    ).then((token: number) => {
      FlowManager.setContinuationToken(token);
      continuationManager.on('deviceSelected', token, (devices) => {
        const deviceName: string = devices.length > 0 ? devices[0].name : 'target device';
        FlowManager.setStatus(`Selected ${deviceName}. Confirm continuation on that device.`);
      });
      FlowManager.setStatus('Free flow is registered. You can continue to another device now.');
    }).catch(() => {
      FlowManager.setStatus('Free flow registration failed on the current device.');
    });
  }

  private activateContinuation(): void {
    this.context.setMissionContinueState(AbilityConstant.ContinueState.ACTIVE).then(() => {
      FlowManager.setStatus('Free flow is active for the current mission.');
    }).catch(() => {
      FlowManager.setStatus('Free flow activation failed on the current device.');
    });
  }

  private unregisterContinuation(): void {
    const token: number = FlowManager.getContinuationToken();
    if (token < 0) {
      return;
    }

    continuationManager.off('deviceSelected', token);
    continuationManager.unregisterContinuation(token).catch(() => {
      hilog.error(0x0000, 'testTag', 'Failed to unregister continuation token.');
    });
    FlowManager.setContinuationToken(-1);
    FlowManager.clearContinuationStarter();
  }
}
