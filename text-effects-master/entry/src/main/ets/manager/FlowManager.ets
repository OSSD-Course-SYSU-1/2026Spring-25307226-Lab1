import continuationManager from '@ohos.continuation.continuationManager';
import TextEffectFlowState from '../model/TextEffectFlowState';

const FLOW_PAYLOAD_KEY: string = 'textEffects.flowPayload';
const FLOW_SOURCE_KEY: string = 'textEffects.flowSource';

type FlowListener = (state: TextEffectFlowState, status: string) => void;
type ContinuationStarter = () => Promise<void>;

class FlowPayload {
  inputText: string = '';
  selectedEffect: number = 0;

  constructor(inputText: string, selectedEffect: number) {
    this.inputText = inputText;
    this.selectedEffect = selectedEffect;
  }
}

export default class FlowManager {
  private static state: TextEffectFlowState = new TextEffectFlowState();
  private static status: string = 'Free flow is ready. Choose a target device to continue.';
  private static listeners: FlowListener[] = [];
  private static starter?: ContinuationStarter;
  private static continuationToken: number = -1;

  static getState(): TextEffectFlowState {
    return new TextEffectFlowState(FlowManager.state.inputText, FlowManager.state.selectedEffect);
  }

  static getStatus(): string {
    return FlowManager.status;
  }

  static getContinuationToken(): number {
    return FlowManager.continuationToken;
  }

  static setContinuationToken(token: number): void {
    FlowManager.continuationToken = token;
  }

  static setContinuationStarter(starter: ContinuationStarter): void {
    FlowManager.starter = starter;
  }

  static clearContinuationStarter(): void {
    FlowManager.starter = undefined;
  }

  static subscribe(listener: FlowListener): void {
    FlowManager.listeners.push(listener);
    listener(FlowManager.getState(), FlowManager.status);
  }

  static unsubscribe(listener: FlowListener): void {
    FlowManager.listeners = FlowManager.listeners.filter((item: FlowListener) => item !== listener);
  }

  static updateInputText(value: string): void {
    FlowManager.state.inputText = value;
    FlowManager.notify();
  }

  static updateSelectedEffect(value: number): void {
    FlowManager.state.selectedEffect = value;
    FlowManager.notify();
  }

  static setStatus(message: string): void {
    FlowManager.status = message;
    FlowManager.notify();
  }

  static async requestContinuation(): Promise<void> {
    if (!FlowManager.starter) {
      FlowManager.setStatus('Free flow is unavailable in the current context.');
      return;
    }

    await FlowManager.starter();
  }

  static writeToWantParam(wantParam: Record<string, Object>): void {
    const payload: FlowPayload = new FlowPayload(
      FlowManager.state.inputText,
      FlowManager.state.selectedEffect
    );

    wantParam[FLOW_PAYLOAD_KEY] = JSON.stringify(payload) as Object;
    wantParam[FLOW_SOURCE_KEY] = 'TextEffectsFreeFlow' as Object;
  }

  static restoreFromWantParameters(parameters?: Record<string, Object>): boolean {
    if (!parameters) {
      return false;
    }

    const payload: Object | undefined = parameters[FLOW_PAYLOAD_KEY];
    if (typeof payload !== 'string') {
      return false;
    }

    return FlowManager.restoreFromPayload(payload);
  }

  static restoreFromPayload(payload: string): boolean {
    try {
      const parsed: FlowPayload = JSON.parse(payload) as FlowPayload;
      const inputText: string = parsed.inputText;
      const selectedEffect: number = parsed.selectedEffect;

      if (typeof inputText !== 'string' || typeof selectedEffect !== 'number') {
        return false;
      }

      FlowManager.state = new TextEffectFlowState(inputText, selectedEffect);
      FlowManager.setStatus('State restored from free flow continuation.');
      return true;
    } catch (_) {
      FlowManager.setStatus('Failed to restore free flow state.');
      return false;
    }
  }

  static getContinuationOptions(bundleName: string): continuationManager.ContinuationExtraParams {
    return {
      deviceType: ['phone', 'tablet', 'default'],
      targetBundle: bundleName,
      description: 'Continue text effect editing on another HarmonyOS device.'
    };
  }

  private static notify(): void {
    const state: TextEffectFlowState = FlowManager.getState();
    FlowManager.listeners.forEach((listener: FlowListener) => {
      listener(state, FlowManager.status);
    });
  }
}
