export default class TextEffectFlowState {
  inputText: string = 'This is a text example.';
  selectedEffect: number = 0;

  constructor(inputText?: string, selectedEffect?: number) {
    if (typeof inputText === 'string') {
      this.inputText = inputText;
    }

    if (typeof selectedEffect === 'number') {
      this.selectedEffect = selectedEffect;
    }
  }
}
