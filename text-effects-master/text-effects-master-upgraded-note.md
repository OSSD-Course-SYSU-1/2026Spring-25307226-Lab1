# text-effects-master 工程优化升级说明文档

## 1. 文档说明

本文档用于说明本次对 DevEco / HarmonyOS ArkUI 工程 `text-effects-master` 的功能优化内容。说明重点包括：

1. 与原工程相比新增了哪些功能。
2. 新功能在界面上表现为什么样子。
3. 新功能是如何通过代码实现的。
4. 修改了哪些文件。
5. 各文件之间是如何关联、调用和传递数据的。
6. 用户输入、特效选择、结果显示三者之间的完整运行流程。
7. 后续如果继续扩展新文字特效，应该怎么改。

本次升级的核心目标是：

> 将原来“固定展示多个文字特效示例”的页面，改造成一个“用户可选择文字特效、可输入文字、可查看处理结果”的交互式文字特效处理界面。

---

## 2. 原工程功能分析

原始工程主要是一个文字特效展示 Demo。它的页面入口文件是：

```text
entry/src/main/ets/pages/Index.ets
```

原始工程中包含 4 个文字特效组件：

```text
entry/src/main/ets/view/TextGradientView.ets
entry/src/main/ets/view/TextScrollingView.ets
entry/src/main/ets/view/TextReflectionView.ets
entry/src/main/ets/view/TextMarqueeView.ets
```

原来的页面结构大致是：

```text
标题：渐变文字
显示：固定文字内容的渐变特效

标题：滚动文字
显示：固定文字内容的滚动特效

标题：倒影文字
显示：固定文字内容的倒影特效

标题：跑马灯文字
显示：固定长文字内容的跑马灯特效
```

也就是说，原工程的主要特点是：

1. 页面一次性展示所有文字特效。
2. 用户不能输入文本。
3. 用户不能选择只显示某一种特效。
4. 特效组件显示的文字来自资源文件中的固定字符串。
5. 页面更接近“效果展示页”，不是“交互处理页”。

原来的 `Index.ets` 中存在如下状态变量：

```ts
@State message: ResourceStr = $r('app.string.text_content');
@State messageLong: ResourceStr = $r('app.string.text_content_long');
@State value: number = 0;
```

其中：

- `message`：普通文字特效使用的固定文本。
- `messageLong`：跑马灯特效使用的固定长文本。
- `value`：在原 `Index.ets` 中基本没有承担核心交互作用。

原来的调用方式类似：

```ts
TextGradientView({ message: this.message })
TextScrollingView({ message: this.message })
TextReflectionView({ message: this.message })
TextMarqueeView({ message: this.messageLong })
```

这说明原工程是把固定文字传入每个组件，然后分别展示。

---

## 3. 本次升级后新增的功能

本次升级后，页面从“特效展示 Demo”升级为“文字特效处理界面”。

新增功能主要包括以下几个方面。

### 3.1 新增三行式功能界面

页面现在分成三行：

```text
第一行：文字特效选择
第二行：输入需要处理的文本
第三行：文字特效处理结果
```

这三行分别承担不同职责：

| 行数 | 功能 | 用户是否可交互 | 作用 |
|---|---|---|---|
| 第一行 | 文字特效选择 | 是 | 用户选择使用哪一种文字特效 |
| 第二行 | 文本输入 | 是 | 用户输入需要被处理的文字 |
| 第三行 | 处理结果展示 | 否 | 根据用户选择的特效和输入文本显示处理后的效果 |

也就是说，升级后用户的操作流程变为：

```text
选择特效 → 输入文字 → 查看处理结果
```

---

### 3.2 新增文字特效选择功能

第一行新增了四个按钮：

```text
渐变
滚动
倒影
跑马灯
```

每个按钮对应一个文字特效组件：

| 按钮名称 | 对应组件文件 | 显示效果 |
|---|---|---|
| 渐变 | `TextGradientView.ets` | 渐变文字 |
| 滚动 | `TextScrollingView.ets` | 扫光 / 滚动文字效果 |
| 倒影 | `TextReflectionView.ets` | 文字倒影效果 |
| 跑马灯 | `TextMarqueeView.ets` | 超出区域后的跑马灯滚动效果 |

原工程是同时显示所有效果，本次升级改成了：

> 用户选择一个特效后，第三行只显示当前选择的特效结果。

---

### 3.3 新增用户输入文本功能

第二行新增了 `TextInput` 输入框。

用户可以在输入框中输入任意文本，例如：

```text
Hello HarmonyOS
文字特效测试
DevEco Studio
这是我输入的内容
```

输入内容会实时保存到页面状态变量：

```ts
@State inputText: string = '这是一段文字示例';
```

当用户输入发生变化时，会触发：

```ts
.onChange((value: string) => {
  this.inputText = value;
})
```

这段代码的作用是：

```text
用户输入框内容变化
        ↓
触发 onChange 回调
        ↓
把最新输入内容赋值给 this.inputText
        ↓
页面状态发生变化
        ↓
第三行特效显示内容自动更新
```

---

### 3.4 新增处理结果实时展示功能

第三行用于展示处理后的文字特效结果。

它不再显示固定资源字符串，而是显示用户在第二行输入的内容。

第三行展示逻辑由 `effectPreview()` 控制：

```ts
@Builder
effectPreview() {
  if (this.selectedEffect === 0) {
    TextGradientView({ message: this.inputText })
  } else if (this.selectedEffect === 1) {
    TextScrollingView({ message: this.inputText })
  } else if (this.selectedEffect === 2) {
    TextReflectionView({ message: this.inputText })
  } else {
    TextMarqueeView({ message: this.inputText })
  }
}
```

这段代码的核心含义是：

```text
如果 selectedEffect 是 0 → 显示渐变文字
如果 selectedEffect 是 1 → 显示滚动文字
如果 selectedEffect 是 2 → 显示倒影文字
否则 → 显示跑马灯文字
```

也就是说，第三行显示什么内容，取决于两个状态：

```text
selectedEffect：决定使用哪一种特效
inputText：决定特效处理的文本内容
```

---

### 3.5 新增按钮选中状态提示

为了让用户知道当前选择的是哪一种特效，按钮增加了选中状态颜色变化。

核心代码：

```ts
.backgroundColor(this.selectedEffect === index ? '#623AA2' : '#E9ECEF')
.fontColor(this.selectedEffect === index ? Color.White : '#333333')
```

含义是：

```text
当前按钮 index 等于 selectedEffect
        ↓
说明该按钮是当前选中的按钮
        ↓
按钮背景变成紫色，文字变成白色

当前按钮 index 不等于 selectedEffect
        ↓
说明该按钮不是当前选中的按钮
        ↓
按钮背景变成浅灰色，文字变成深灰色
```

这样用户能直接看出当前正在使用哪个文字特效。

---

## 4. 本次修改的文件清单

本次主要修改了 5 个 ArkTS 文件。

```text
entry/src/main/ets/pages/Index.ets
entry/src/main/ets/view/TextGradientView.ets
entry/src/main/ets/view/TextScrollingView.ets
entry/src/main/ets/view/TextReflectionView.ets
entry/src/main/ets/view/TextMarqueeView.ets
```

其中：

| 文件 | 修改程度 | 主要作用 |
|---|---|---|
| `Index.ets` | 修改最多 | 页面结构、状态管理、输入框、按钮选择、结果预览 |
| `TextGradientView.ets` | 小幅修改 | 支持接收父组件传入的动态文本 |
| `TextScrollingView.ets` | 小幅修改 | 支持接收父组件传入的动态文本 |
| `TextReflectionView.ets` | 小幅修改 | 支持接收父组件传入的动态文本 |
| `TextMarqueeView.ets` | 小幅修改 | 支持接收父组件传入的动态文本 |

---

## 5. `Index.ets` 修改详解

`Index.ets` 是整个页面的入口，也是本次升级的核心文件。

它承担了以下职责：

1. 保存用户输入的文本。
2. 保存当前选择的文字特效类型。
3. 绘制三行式页面结构。
4. 处理按钮点击事件。
5. 处理输入框内容变化事件。
6. 根据状态决定第三行显示哪个特效组件。

---

### 5.1 状态变量修改

#### 原来的状态变量

原工程中是：

```ts
@State message: ResourceStr = $r('app.string.text_content');
@State messageLong: ResourceStr = $r('app.string.text_content_long');
@State value: number = 0;
```

这些变量主要用于展示固定文字，没有用户输入逻辑。

#### 升级后的状态变量

现在改成：

```ts
@State inputText: string = '这是一段文字示例';
@State selectedEffect: number = 0;
```

两个变量的含义如下：

| 状态变量 | 类型 | 默认值 | 作用 |
|---|---|---|---|
| `inputText` | `string` | `这是一段文字示例` | 保存用户输入的文本 |
| `selectedEffect` | `number` | `0` | 保存当前选择的文字特效编号 |

这两个状态变量是本次升级的核心。

页面所有交互都围绕它们展开：

```text
用户输入内容 → 修改 inputText
用户点击按钮 → 修改 selectedEffect
第三行展示结果 → 同时读取 inputText 和 selectedEffect
```

---

### 5.2 页面样式函数从 `fancy()` 改为 `cardStyle()`

#### 原来的样式函数

原工程中有：

```ts
@Styles
fancy() {
  .borderRadius($r('app.float.row_border_radius'))
  .backgroundColor(Color.White)
  .padding({
    top: $r('app.float.row_padding'),
    bottom: $r('app.float.row_padding')
  })
  .width(Constants.FULL_PERCENT)
}
```

它主要用于给每个特效展示行添加圆角、背景和上下内边距。

#### 升级后的样式函数

现在改成：

```ts
@Styles
cardStyle() {
  .borderRadius($r('app.float.row_border_radius'))
  .backgroundColor(Color.White)
  .padding($r('app.float.row_padding'))
  .width(Constants.FULL_PERCENT)
  .margin({ bottom: 16 })
}
```

相比原来的 `fancy()`，新的 `cardStyle()` 有几个变化：

1. 名字更符合现在的页面结构，因为三行现在更像三个卡片区块。
2. `padding` 从只设置上下内边距，改成四周统一内边距。
3. 增加了底部间距 `margin({ bottom: 16 })`，让三行之间有明显分隔。
4. 仍然保留白色背景、圆角和全宽布局。

---

### 5.3 新增 `sectionTitle()` 标题构建器

新增代码：

```ts
@Builder
sectionTitle(title: string) {
  Row() {
    Text(title)
      .fontSize($r('app.float.title_font_size'))
      .fontColor($r('app.color.title_font_color'))
      .fontWeight(Constants.FONT_WEIGHT_500)
  }
  .width(Constants.FULL_PERCENT)
  .margin({ bottom: 8 })
}
```

这个函数用于统一绘制每一行的标题。

比如：

```ts
this.sectionTitle('第一行：文字特效选择')
this.sectionTitle('第二行：输入需要处理的文本')
this.sectionTitle('第三行：文字特效处理结果')
```

这样做的好处是：

1. 避免每一行重复写标题样式。
2. 如果以后想修改标题颜色、大小或间距，只需要改 `sectionTitle()` 一处。
3. 页面结构更清晰。

---

### 5.4 新增 `effectButton()` 特效按钮构建器

新增代码：

```ts
@Builder
effectButton(title: string, index: number) {
  Button(title)
    .fontSize(14)
    .fontWeight(FontWeight.Medium)
    .backgroundColor(this.selectedEffect === index ? '#623AA2' : '#E9ECEF')
    .fontColor(this.selectedEffect === index ? Color.White : '#333333')
    .borderRadius(18)
    .height(36)
    .padding({ left: 14, right: 14 })
    .onClick(() => {
      this.selectedEffect = index;
    })
}
```

这个构建器用于创建特效选择按钮。

它有两个参数：

| 参数 | 类型 | 作用 |
|---|---|---|
| `title` | `string` | 按钮上显示的文字 |
| `index` | `number` | 按钮对应的特效编号 |

当前使用方式是：

```ts
this.effectButton('渐变', 0)
this.effectButton('滚动', 1)
this.effectButton('倒影', 2)
this.effectButton('跑马灯', 3)
```

按钮和特效编号的对应关系如下：

```text
0 → 渐变
1 → 滚动
2 → 倒影
3 → 跑马灯
```

当用户点击按钮时，会执行：

```ts
this.selectedEffect = index;
```

例如用户点击“倒影”按钮：

```text
倒影按钮的 index 是 2
        ↓
点击按钮
        ↓
this.selectedEffect = 2
        ↓
页面重新渲染
        ↓
effectPreview() 判断 selectedEffect === 2
        ↓
第三行显示 TextReflectionView
```

---

### 5.5 新增 `effectPreview()` 结果预览构建器

新增代码：

```ts
@Builder
effectPreview() {
  if (this.selectedEffect === 0) {
    TextGradientView({ message: this.inputText })
  } else if (this.selectedEffect === 1) {
    TextScrollingView({ message: this.inputText })
  } else if (this.selectedEffect === 2) {
    TextReflectionView({ message: this.inputText })
  } else {
    TextMarqueeView({ message: this.inputText })
  }
}
```

这是第三行结果显示的核心逻辑。

它会根据 `selectedEffect` 的值动态选择组件。

详细逻辑如下：

| `selectedEffect` 值 | 调用组件 | 传入文本 |
|---|---|---|
| `0` | `TextGradientView` | `this.inputText` |
| `1` | `TextScrollingView` | `this.inputText` |
| `2` | `TextReflectionView` | `this.inputText` |
| 其他值 | `TextMarqueeView` | `this.inputText` |

注意：无论用户选择哪一个特效，传入的文本都是：

```ts
this.inputText
```

这就保证了：

```text
第二行输入什么
第三行就用什么内容做文字特效
```

---

### 5.6 第一行：文字特效选择区域

升级后的第一行代码：

```ts
Column() {
  this.sectionTitle('第一行：文字特效选择')
  Row({ space: 8 }) {
    this.effectButton('渐变', 0)
    this.effectButton('滚动', 1)
    this.effectButton('倒影', 2)
    this.effectButton('跑马灯', 3)
  }
  .width(Constants.FULL_PERCENT)
  .justifyContent(FlexAlign.Start)
}
.cardStyle()
```

结构解释：

```text
Column
 ├─ sectionTitle：显示“第一行：文字特效选择”
 └─ Row
     ├─ 渐变按钮
     ├─ 滚动按钮
     ├─ 倒影按钮
     └─ 跑马灯按钮
```

这里使用 `Row({ space: 8 })` 让按钮之间保持 8 的间距。

`.cardStyle()` 给整个第一行加上卡片样式。

---

### 5.7 第二行：文本输入区域

升级后的第二行代码：

```ts
Column() {
  this.sectionTitle('第二行：输入需要处理的文本')
  TextInput({ placeholder: '请输入文字内容', text: this.inputText })
    .width(Constants.FULL_PERCENT)
    .height(48)
    .fontSize(16)
    .backgroundColor('#F8F9FA')
    .borderRadius(12)
    .padding({ left: 12, right: 12 })
    .onChange((value: string) => {
      this.inputText = value;
    })
}
.cardStyle()
```

结构解释：

```text
Column
 ├─ sectionTitle：显示“第二行：输入需要处理的文本”
 └─ TextInput：用户输入框
```

关键点是：

```ts
TextInput({ placeholder: '请输入文字内容', text: this.inputText })
```

这表示输入框初始显示 `this.inputText` 的值。

当用户修改输入内容时：

```ts
.onChange((value: string) => {
  this.inputText = value;
})
```

`value` 就是输入框里的最新内容。

例如：

```text
用户输入：HarmonyOS文字特效
        ↓
onChange 获取 value = 'HarmonyOS文字特效'
        ↓
this.inputText = 'HarmonyOS文字特效'
        ↓
第三行自动使用新文本重新显示特效
```

---

### 5.8 第三行：文字特效处理结果区域

升级后的第三行代码：

```ts
Column() {
  this.sectionTitle('第三行：文字特效处理结果')
  Row() {
    this.effectPreview()
  }
  .width(Constants.FULL_PERCENT)
  .minHeight(96)
  .justifyContent(FlexAlign.Center)
  .alignItems(VerticalAlign.Center)
  .backgroundColor('#F8F9FA')
  .borderRadius(12)
  .padding(12)
}
.cardStyle()
```

结构解释：

```text
Column
 ├─ sectionTitle：显示“第三行：文字特效处理结果”
 └─ Row
     └─ effectPreview：根据当前选择显示对应特效组件
```

这里的 `Row` 设置了：

```ts
.justifyContent(FlexAlign.Center)
.alignItems(VerticalAlign.Center)
```

作用是让处理结果在结果区域中居中显示。

---

## 6. 四个文字特效组件修改详解

本次对四个特效组件的修改非常小，但非常关键。

修改前，组件内部是：

```ts
@State message: ResourceStr = '';
```

修改后，变成：

```ts
@Prop message: ResourceStr = '';
```

这个变化是本次“用户输入内容能够传给特效组件”的关键。

---

### 6.1 为什么要把 `@State` 改成 `@Prop`

在 ArkUI 中，可以简单理解为：

| 装饰器 | 主要含义 | 适合场景 |
|---|---|---|
| `@State` | 组件自己的内部状态 | 组件自己管理、自己修改的数据 |
| `@Prop` | 父组件传给子组件的数据 | 子组件接收外部传入内容并显示 |

原来的写法：

```ts
@State message: ResourceStr = '';
```

表示 `message` 更像是组件自己的内部状态。

升级后的写法：

```ts
@Prop message: ResourceStr = '';
```

表示 `message` 是父组件传入的属性。

现在 `Index.ets` 作为父组件，会这样传值：

```ts
TextGradientView({ message: this.inputText })
```

子组件中使用：

```ts
Text(this.message)
```

完整数据流是：

```text
Index.ets 中的 inputText
        ↓
通过 message 属性传给 TextGradientView / TextScrollingView / TextReflectionView / TextMarqueeView
        ↓
子组件内部用 Text(this.message) 显示文字
        ↓
文字被对应特效样式处理后显示出来
```

---

### 6.2 `TextGradientView.ets` 修改说明

文件路径：

```text
entry/src/main/ets/view/TextGradientView.ets
```

修改点：

```ts
@Prop message: ResourceStr = '';
```

它的核心显示代码：

```ts
Text(this.message)
  .fontSize($r('app.float.content_font_size'))
  .fontWeight(FontWeight.Bold)
  .blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN)
```

外层通过：

```ts
.linearGradient({
  direction: GradientDirection.Right,
  colors: [[$r('app.color.gradient_start_color'), 0.0], [$r('app.color.gradient_end_color'), 1]]
})
```

实现渐变文字效果。

升级后的作用是：

```text
用户输入的文字 → 传入 TextGradientView → 使用渐变效果显示
```

---

### 6.3 `TextScrollingView.ets` 修改说明

文件路径：

```text
entry/src/main/ets/view/TextScrollingView.ets
```

修改点：

```ts
@Prop message: ResourceStr = '';
```

它仍然保留自己的动画状态：

```ts
@State value: number = 0;
```

这里的 `value` 是滚动 / 扫光动画使用的内部状态，不需要父组件传入，所以仍然保留 `@State`。

核心动画逻辑：

```ts
.onAppear(() => {
  this.getUIContext().animateTo({
    duration: Constants.TEXT_SCROLL_DURATION,
    finishCallbackType: FinishCallbackType.LOGICALLY,
    curve: Curve.Linear,
    iterations: -1,
    onFinish: () => {
      this.value = 0
    }
  }, () => {
    this.value = 1
  });
})
```

含义是：

```text
组件出现
        ↓
启动动画
        ↓
value 从 0 变化到 1
        ↓
linearGradient 根据 value 改变颜色分界位置
        ↓
形成文字扫光 / 滚动效果
        ↓
iterations: -1 表示循环播放
```

升级后的作用是：

```text
用户输入的文字 → 传入 TextScrollingView → 使用滚动扫光效果显示
```

---

### 6.4 `TextReflectionView.ets` 修改说明

文件路径：

```text
entry/src/main/ets/view/TextReflectionView.ets
```

修改点：

```ts
@Prop message: ResourceStr = '';
```

它的核心结构是：

```ts
Stack() {
  Text(this.message)
  Text(this.message)
    .rotate({...})
    .blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN)
}
```

这里使用了两个相同的 `Text(this.message)`：

1. 第一个显示正常文字。
2. 第二个进行旋转和渐变遮罩，形成倒影。

升级后的作用是：

```text
用户输入的文字 → 传入 TextReflectionView → 同时生成正常文字和倒影文字
```

---

### 6.5 `TextMarqueeView.ets` 修改说明

文件路径：

```text
entry/src/main/ets/view/TextMarqueeView.ets
```

修改点：

```ts
@Prop message: ResourceStr = '';
```

它的核心跑马灯设置是：

```ts
.textOverflow({ overflow: TextOverflow.MARQUEE })
```

含义是：

```text
当文字内容超过显示区域时
        ↓
使用 MARQUEE 方式滚动显示
```

升级后的作用是：

```text
用户输入较长文本 → 传入 TextMarqueeView → 超出区域后以跑马灯方式显示
```

---

## 7. 新旧工程对比总结

### 7.1 功能层面对比

| 对比项 | 原工程 | 升级后工程 |
|---|---|---|
| 页面定位 | 文字特效展示 Demo | 文字特效处理工具 |
| 用户输入 | 不支持 | 支持 |
| 特效选择 | 不支持，全部同时显示 | 支持，通过按钮选择 |
| 结果展示 | 固定文本分别展示 | 根据输入文本和选择特效动态展示 |
| 页面结构 | 多个特效展示区 | 三行式交互区 |
| 状态管理 | 固定资源字符串 | `inputText` + `selectedEffect` |
| 组件通信 | 父组件传固定资源字符串 | 父组件传用户输入字符串 |
| 可扩展性 | 增加新特效需要直接添加展示区 | 增加新按钮和判断分支即可 |

---

### 7.2 代码层面对比

| 修改位置 | 原来 | 现在 |
|---|---|---|
| `Index.ets` 状态 | `message`、`messageLong` | `inputText`、`selectedEffect` |
| `Index.ets` 页面 | 四个特效全部展示 | 三行式布局，只展示选中特效 |
| 特效组件参数 | `@State message` | `@Prop message` |
| 输入框 | 无 | 新增 `TextInput` |
| 按钮选择 | 无 | 新增 `effectButton()` |
| 动态预览 | 无 | 新增 `effectPreview()` |

---

## 8. 完整代码关联关系

本工程本次升级后的核心代码关联关系如下：

```text
Index.ets
│
├── 保存状态
│   ├── inputText：用户输入的文本
│   └── selectedEffect：当前选择的特效编号
│
├── 第一行：文字特效选择
│   └── effectButton(title, index)
│       └── 点击后修改 selectedEffect
│
├── 第二行：文本输入
│   └── TextInput
│       └── onChange 修改 inputText
│
└── 第三行：特效结果展示
    └── effectPreview()
        ├── selectedEffect === 0 → TextGradientView({ message: inputText })
        ├── selectedEffect === 1 → TextScrollingView({ message: inputText })
        ├── selectedEffect === 2 → TextReflectionView({ message: inputText })
        └── selectedEffect 其他值 → TextMarqueeView({ message: inputText })
```

四个子组件内部统一通过：

```ts
@Prop message: ResourceStr = '';
```

接收父组件传入的数据。

然后通过：

```ts
Text(this.message)
```

将文本显示出来，并叠加各自的特效样式。

---

## 9. 运行流程详细说明

下面以用户操作为例，说明升级后页面的完整运行流程。

### 9.1 页面初次打开

页面打开时：

```ts
@State inputText: string = '这是一段文字示例';
@State selectedEffect: number = 0;
```

因此默认状态是：

```text
输入框默认文字：这是一段文字示例
默认选择特效：渐变
第三行默认显示：这是一段文字示例 的渐变效果
```

---

### 9.2 用户输入文字

假设用户输入：

```text
欢迎使用文字特效工具
```

触发流程：

```text
用户在 TextInput 中输入内容
        ↓
TextInput 的 onChange 被触发
        ↓
value = '欢迎使用文字特效工具'
        ↓
this.inputText = value
        ↓
inputText 状态更新
        ↓
页面重新渲染
        ↓
effectPreview() 重新执行
        ↓
当前选中的特效组件收到新的 message
        ↓
第三行显示新文字的特效结果
```

---

### 9.3 用户切换特效

假设用户点击“倒影”按钮。

触发流程：

```text
用户点击“倒影”按钮
        ↓
effectButton('倒影', 2) 的 onClick 被触发
        ↓
this.selectedEffect = 2
        ↓
selectedEffect 状态更新
        ↓
页面重新渲染
        ↓
effectPreview() 判断 selectedEffect === 2
        ↓
调用 TextReflectionView({ message: this.inputText })
        ↓
第三行显示当前输入文字的倒影效果
```

---

### 9.4 用户同时修改输入和特效

如果用户先输入文字，再切换特效，流程是：

```text
输入文字改变 inputText
        ↓
点击按钮改变 selectedEffect
        ↓
effectPreview() 同时读取 inputText 和 selectedEffect
        ↓
显示最新文字 + 最新特效
```

因此，页面最终结果始终由下面两个变量决定：

```text
最终显示结果 = 当前输入文本 inputText + 当前选中特效 selectedEffect
```

---

## 10. 关键代码片段说明

### 10.1 状态定义

```ts
@State inputText: string = '这是一段文字示例';
@State selectedEffect: number = 0;
```

作用：

```text
inputText 控制显示什么文字
selectedEffect 控制使用什么特效
```

---

### 10.2 输入框更新状态

```ts
TextInput({ placeholder: '请输入文字内容', text: this.inputText })
  .onChange((value: string) => {
    this.inputText = value;
  })
```

作用：

```text
把用户输入内容实时写入 inputText
```

---

### 10.3 按钮更新状态

```ts
.onClick(() => {
  this.selectedEffect = index;
})
```

作用：

```text
用户点击哪个按钮，就把 selectedEffect 改成对应编号
```

---

### 10.4 根据状态切换组件

```ts
if (this.selectedEffect === 0) {
  TextGradientView({ message: this.inputText })
} else if (this.selectedEffect === 1) {
  TextScrollingView({ message: this.inputText })
} else if (this.selectedEffect === 2) {
  TextReflectionView({ message: this.inputText })
} else {
  TextMarqueeView({ message: this.inputText })
}
```

作用：

```text
根据 selectedEffect 选择具体特效组件，并把 inputText 传进去
```

---

### 10.5 子组件接收父组件数据

```ts
@Prop message: ResourceStr = '';
```

作用：

```text
允许父组件 Index.ets 把 inputText 传入子组件
```

---

## 11. 为什么本次修改能实现用户输入后实时显示结果

核心原因是 ArkUI 的状态驱动机制。

页面中 `inputText` 和 `selectedEffect` 都使用了 `@State`：

```ts
@State inputText: string = '这是一段文字示例';
@State selectedEffect: number = 0;
```

当它们发生变化时，ArkUI 会重新构建相关 UI。

例如：

```ts
this.inputText = value;
```

或者：

```ts
this.selectedEffect = index;
```

都会导致页面刷新。

刷新时，`effectPreview()` 会重新根据最新状态选择组件并传入最新文字。

因此可以实现：

```text
输入框一改，结果区马上变化
按钮一切换，结果区马上切换特效
```

这就是本次升级的主要技术实现思路。

---

## 12. 后续扩展新文字特效的方法

如果以后要增加新的文字特效，例如“阴影文字”或“发光文字”，可以按下面步骤扩展。

### 12.1 新增一个特效组件

例如创建文件：

```text
entry/src/main/ets/view/TextShadowView.ets
```

组件结构建议保持一致：

```ts
@Component
export default struct TextShadowView {
  @Prop message: ResourceStr = '';

  build() {
    Text(this.message)
      .fontSize($r('app.float.content_font_size'))
      .fontWeight(FontWeight.Bold)
      .fontColor(Color.Black)
  }
}
```

### 12.2 在 `Index.ets` 中导入组件

```ts
import TextShadowView from '../view/TextShadowView';
```

### 12.3 第一行增加按钮

```ts
this.effectButton('阴影', 4)
```

### 12.4 `effectPreview()` 增加判断分支

```ts
} else if (this.selectedEffect === 4) {
  TextShadowView({ message: this.inputText })
}
```

这样就可以把新特效接入当前三行式交互界面。

---

## 13. 注意事项

### 13.1 当前特效编号要保持一致

按钮编号和 `effectPreview()` 中的判断编号必须一致。

例如：

```ts
this.effectButton('滚动', 1)
```

那么 `effectPreview()` 中也必须有：

```ts
this.selectedEffect === 1
```

否则按钮点击后可能无法显示正确特效。

---

### 13.2 子组件应继续使用 `@Prop`

如果某个特效组件需要显示用户输入的文字，就应该使用：

```ts
@Prop message: ResourceStr = '';
```

不要再改回：

```ts
@State message: ResourceStr = '';
```

因为 `@State` 更适合组件内部自己维护的数据，而本项目中文本内容来自父组件。

---

### 13.3 跑马灯适合长文本

`TextMarqueeView` 的跑马灯效果通常在文字较长、超出显示区域时更明显。

如果输入内容很短，可能看起来和普通文本差别不大。

---

### 13.4 滚动效果依赖动画启动

`TextScrollingView` 的动画在组件出现时通过 `onAppear()` 启动。

如果切换到滚动效果后没有立即看到明显变化，可以关注：

1. 动画时长 `Constants.TEXT_SCROLL_DURATION`。
2. 渐变颜色分界是否明显。
3. 设备或模拟器是否正常渲染动画。

---

## 14. 本次升级后的页面逻辑总图

```text
页面打开
  ↓
初始化状态
  ├── inputText = '这是一段文字示例'
  └── selectedEffect = 0
  ↓
渲染三行界面
  ├── 第一行：特效选择按钮
  ├── 第二行：文本输入框
  └── 第三行：结果展示区
  ↓
用户操作
  ├── 输入文字 → 修改 inputText
  └── 点击按钮 → 修改 selectedEffect
  ↓
ArkUI 状态驱动重新渲染
  ↓
effectPreview() 根据 selectedEffect 选择组件
  ↓
把 inputText 作为 message 传给子组件
  ↓
子组件使用 Text(this.message) 显示文字
  ↓
叠加对应文字特效
  ↓
第三行显示最终结果
```

---

## 15. 总结

本次升级将原来的文字特效展示工程改造成了一个更接近实际应用的小工具。

原工程只是展示：

```text
固定文字 + 固定特效
```

升级后变成：

```text
用户选择特效 + 用户输入文字 + 实时显示处理结果
```

核心修改集中在 `Index.ets`：

1. 新增 `inputText` 保存用户输入。
2. 新增 `selectedEffect` 保存用户选择的特效。
3. 新增 `TextInput` 输入框。
4. 新增特效选择按钮。
5. 新增 `effectPreview()` 动态选择展示组件。
6. 将页面改为三行式结构。

同时，四个特效组件统一将：

```ts
@State message
```

改为：

```ts
@Prop message
```

使它们可以接收父组件传入的动态文字。

最终实现了一个清晰的交互流程：

```text
第一行选择文字特效
第二行输入待处理文本
第三行显示处理后的文字特效结果
```

这就是本次优化升级的主要功能、实现方式和代码关联关系。
