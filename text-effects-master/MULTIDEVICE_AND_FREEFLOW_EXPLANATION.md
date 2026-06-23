# 多端部署与自由流转改造说明

## 1. 文档目的

本文用于说明 `text-effects-master-upgraded-multidevice-freeflow` 相较于初始版本 `text-effects-master-upgraded` 新增了哪些能力，重点解释两部分：

- 多端部署
- 自由流转

初始版本本质上是一个 HarmonyOS ArkUI 文字特效示例应用，核心能力是：

- 输入一段文字
- 切换 4 种文字效果
- 在同一页面实时预览结果

它原本更偏向“单端示例”，而当前版本已经在这个基础上补齐了“多设备界面适配”和“跨设备继续使用”的框架能力。

## 2. 初始版本的特点

初始版本主要有以下特点：

- 只有一个主页面 `Index.ets`
- 页面布局偏手机端，整体为纵向单列结构
- 文本效果组件可以切换，但没有针对平板和电脑做宽屏适配
- 没有跨设备迁移状态的能力
- `EntryAbility` 只负责基础生命周期和页面加载

也就是说，初始版本更像是一个“文字特效功能示例”，而不是一个“多端协同应用示例”。

## 3. 新增的多端部署能力

### 3.1 设备类型扩展

当前版本在 [entry/src/main/module.json5](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/module.json5:1) 中扩展了 `deviceTypes`：

- `phone`
- `tablet`
- `2in1`

这一步的意义是：

- 应用不再只面向手机
- 工程配置层面已经声明支持平板和 2in1 大屏设备
- 为“同一套代码运行在不同设备上”提供基础入口

### 3.2 主页面响应式布局

当前版本在 [entry/src/main/ets/pages/Index.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/pages/Index.ets:1) 中加入了窗口宽度驱动的布局切换逻辑。

新增的关键状态：

- `containerWidth`

新增的核心判断方法：

- `isDesktopLayout()`
- `isTabletLayout()`

它们的作用是根据当前容器宽度判断设备呈现形态，从而让页面在不同屏幕尺寸上自动调整。

### 3.3 页面样式按屏幕尺寸动态变化

相较初始版本直接写固定值，当前版本将多项界面参数改成“按断点动态计算”，例如：

- 页面边距 `getPagePadding()`
- 卡片内边距 `getCardPadding()`
- 标题字号 `getTitleFontSize()`
- 内容字号 `getContentFontSize()`
- 预览区高度 `getPreviewHeight()`
- 倒影区域高度 `getReflectionHeight()`
- 输入框高度 `getInputHeight()`
- 按钮高度 `getButtonHeight()`

这样做的目的，是让同一份页面代码在：

- 手机上不显得拥挤
- 平板上不显得过窄
- 电脑/2in1 上不显得留白失衡

### 3.4 页面结构从单列升级为可切换布局

在当前的 `Index.ets` 中：

- 手机/普通中小屏采用纵向单列布局
- 大屏采用左右双栏布局

具体表现为：

- 左侧放控制区
- 右侧放预览区

这样相比初始版本的固定单列，更适合大屏设备的横向空间利用。

### 3.5 文字特效组件参数化

4 个文字特效组件都不再只依赖固定资源值，而是可以接收页面传入的动态参数：

- [TextGradientView.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/view/TextGradientView.ets:1)
- [TextScrollingView.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/view/TextScrollingView.ets:1)
- [TextReflectionView.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/view/TextReflectionView.ets:1)
- [TextMarqueeView.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/view/TextMarqueeView.ets:1)

改造后的重点有：

- 支持不同字号
- 支持不同倒影高度
- 支持不同跑马灯宽度
- 支持不同滚动动画时长

这一步非常关键，因为如果主页面做了多端适配，但组件内部还是写死手机参数，那么大屏下仍然会显得不协调。

## 4. 新增的自由流转能力

### 4.1 Ability 声明为可流转

在 [entry/src/main/module.json5](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/module.json5:1) 中，`EntryAbility` 新增了：

- `continuable: true`

它的作用是告诉系统：

- 当前 Ability 支持迁移
- 当前页面任务可以参与自由流转

这属于自由流转能力的配置入口。

### 4.2 新增分布式数据同步权限

在 [AppScope/app.json5](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/AppScope/app.json5:1) 中新增了：

- `ohos.permission.DISTRIBUTED_DATASYNC`

这项权限的作用是为跨设备数据同步和 continuation 相关流程提供权限基础。

### 4.3 新增可迁移状态模型

为了让自由流转不只是“跳到另一台设备打开应用”，当前版本新增了 [TextEffectFlowState.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/model/TextEffectFlowState.ets:1)。

它提取了当前业务中真正需要迁移的状态：

- `inputText`
- `selectedEffect`

这一步很重要，因为不是所有状态都应该迁移。

例如：

- `containerWidth` 是当前设备环境信息，不应该迁移
- 目标设备应根据自己的窗口尺寸重新计算布局

因此，这个状态模型实际上明确区分了：

- 业务状态
- 设备环境状态

### 4.4 新增 FlowManager 统一管理流转逻辑

当前版本新增了 [FlowManager.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/manager/FlowManager.ets:1)。

它是自由流转能力的中枢，主要负责：

- 保存当前页面状态
- 统一维护流转状态提示文本
- 将状态写入 continuation payload
- 从 continuation payload 恢复状态
- 保存 continuation token
- 管理页面对流转状态的订阅

它解决了一个很实际的问题：

如果直接把这些逻辑散落在 `Index.ets` 和 `EntryAbility.ets` 里，页面逻辑、生命周期逻辑和流转逻辑会混在一起，后续会很难维护。

### 4.5 在 EntryAbility 中补齐 continuation 生命周期

在 [entry/src/main/ets/entryability/EntryAbility.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/entryability/EntryAbility.ets:1) 中，相较初始版本新增了完整的 continuation 相关处理。

主要包括：

- `onCreate()` 中恢复 continuation 状态并注册 continuation
- `onContinue()` 中把当前状态写入 `wantParam`
- `onNewWant()` 中恢复流转后的状态
- `activateContinuation()` 中将当前任务标记为可继续
- `registerContinuation()` 中注册 continuation manager
- `unregisterContinuation()` 中清理 continuation token 和回调

这些逻辑让应用不再只是“页面能显示”，而是具备了真正的跨设备继续使用入口。

### 4.6 页面新增自由流转入口

在 [Index.ets](C:/Users/31293/Desktop/workplace/text-effects-master-upgraded-multidevice-freeflow/entry/src/main/ets/pages/Index.ets:1) 中，相较初始版本新增了：

- `flowStatus`
- `freeFlowCard()`
- `Start Free Flow` 按钮

这表示自由流转不再只是底层能力，而是有了用户可见的操作入口。

用户现在可以在页面上看到：

- 当前流转状态说明
- 启动自由流转的按钮

这样也更方便后续联调和演示。

## 5. 多端部署与自由流转之间的关系

这两个能力不是彼此独立的，而是互相支撑的。

### 多端部署解决的问题

多端部署解决的是：

- 同一份应用如何在手机、平板、电脑上都能看起来正常
- 不同设备上界面如何自动适配

### 自由流转解决的问题

自由流转解决的是：

- 用户在一个设备上的当前操作，如何在另一个设备继续
- 当前输入内容和效果选择如何跨设备保留

### 两者组合后的实际效果

组合起来之后，这个项目的能力就从：

- “在一个设备上演示文字特效”

升级为：

- “在不同设备上都能正常显示，并且可以把当前编辑状态流转到另一台设备继续使用”

这也是当前版本相较初始版本最核心的提升。

## 6. 当前版本的流转范围

当前版本的自由流转属于“最小可用框架”。

已经支持迁移的内容：

- 当前输入文本
- 当前选中的文字特效

当前没有迁移的内容：

- 当前窗口宽度
- 当前具体布局分支
- 动画进行到哪一帧

这样设计是合理的，因为：

- 业务状态适合迁移
- 设备环境和即时动画状态不适合直接迁移

## 7. 与初始版本相比的整体升级总结

相较初始版本，当前版本新增的能力可以概括为两条主线。

### 第一条主线：从单端示例升级为多端界面

新增内容：

- 设备类型扩展
- 响应式布局
- 宽度断点判断
- 组件参数化
- 大屏双栏预览

带来的结果：

- 同一套工程可以面向手机、平板、2in1 等设备部署

### 第二条主线：从本地页面升级为可跨端继续的页面

新增内容：

- continuation 配置
- 分布式权限
- 流转状态模型
- FlowManager
- `EntryAbility` 的 continuation 生命周期处理
- 页面上的自由流转按钮和状态反馈

带来的结果：

- 当前页面状态可以在设备之间继续流转

## 8. 结论

初始版本更适合被理解为：

- 文字特效演示项目

而当前版本已经升级为：

- 多端部署的文字特效应用
- 带自由流转基础框架的 HarmonyOS 示例项目

它最大的价值不只是“功能变多了”，而是工程结构更接近真实的 HarmonyOS 多设备应用开发方式：

- 页面负责展示与交互
- 组件负责特效渲染
- Ability 负责生命周期和 continuation
- 管理器负责流转状态与数据中转

这也是当前版本比初始版本更完整、更接近课程实践或项目展示要求的原因。
