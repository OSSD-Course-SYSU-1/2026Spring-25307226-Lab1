import continuationManager from '@ohos.continuation.continuationManager';
import TextEffectFlowState from '../model/TextEffectFlowState';

const FLOW_PAYLOAD_KEY: string = 'textEffects.flowPayload';
const FLOW_SOURCE_KEY: string = 'textEffects.flowSource';

type FlowListener = (state: TextEffectFlowState, status: string) => void;
type ContinuationStarter = () => Promise<void>;

export default class FlowManager {
  private static state: TextEffectFlowState = new TextEffectFlowState();
  private static status: string = 'Free flow is ready. Choose a target device to continue.';
  private static listeners: FlowListener[] = [];
  private static starter?: ContinuationStarter;
  private static continuationToken: number = -1;

  static getState(): TextEffectFlowState {
    return new TextEffectFlowState(this.state.inputText, this.state.selectedEffect);
  }

  static getStatus(): string {
    return this.status;
  }

  static getContinuationToken(): number {
    return this.continuationToken;
  }

  static setContinuationToken(token: number): void {
    this.continuationToken = token;
  }

  static setContinuationStarter(starter: ContinuationStarter): void {
    this.starter = starter;
  }

  static clearContinuationStarter(): void {
    this.starter = undefined;
  }

  static subscribe(listener: FlowListener): void {
    this.listeners.push(listener);
    listener(this.getState(), this.status);
  }

  static unsubscribe(listener: FlowListener): void {
    this.listeners = this.listeners.filter((item: FlowListener) => item !== listener);
  }

  static updateInputText(value: string): void {
    this.state.inputText = value;
    this.notify();
  }

  static updateSelectedEffect(value: number): void {
    this.state.selectedEffect = value;
    this.notify();
  }

  static setStatus(message: string): void {
    this.status = message;
    this.notify();
  }

  static async requestContinuation(): Promise<void> {
    if (!this.starter) {
      this.setStatus('Free flow is unavailable in the current context.');
      return;
    }

    await this.starter();
  }

  static writeToWantParam(wantParam: Record<string, Object>): void {
    const payload: Record<string, Object> = {
      inputText: this.state.inputText as Object,
      selectedEffect: this.state.selectedEffect as Object
    };

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

    return this.restoreFromPayload(payload);
  }

  static restoreFromPayload(payload: string): boolean {
    try {
      const parsed: Record<string, Object> = JSON.parse(payload) as Record<string, Object>;
      const inputText: Object | undefined = parsed.inputText;
      const selectedEffect: Object | undefined = parsed.selectedEffect;

      if (typeof inputText !== 'string' || typeof selectedEffect !== 'number') {
        return false;
      }

      this.state = new TextEffectFlowState(inputText, selectedEffect);
      this.setStatus('State restored from free flow continuation.');
      return true;
    } catch (_) {
      this.setStatus('Failed to restore free flow state.');
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
    const state: TextEffectFlowState = this.getState();
    this.listeners.forEach((listener: FlowListener) => {
      listener(state, this.status);
    });
  }
}
