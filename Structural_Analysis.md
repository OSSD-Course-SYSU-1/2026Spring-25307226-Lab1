# text-effects-master 项目结构与代码结构超级详细解析

> 说明：本文档基于你上传的 `text-effects-master.zip` 项目进行分析。该项目是一个 HarmonyOS / ArkTS 示例工程，主题是“基于 Text 组件及通用属性实现文字特效”，主要展示文字渐变、歌词滚动、文字倒影、跑马灯渐变等效果。

---

## 1. 项目总体定位

该项目不是一个复杂的业务型应用，而是一个 **HarmonyOS ArkTS UI 示例工程**。它的核心目标是演示 ArkUI 中 `Text` 组件与若干通用属性的组合使用方法，包括：

1. `linearGradient`：线性渐变背景或遮罩。
2. `blendMode`：混合模式，用于实现文字裁剪、渐变填充、透明遮罩等视觉效果。
3. `rotate`：旋转变换，用于实现倒影。
4. `textOverflow`：文本超出后的显示方式，用于跑马灯。
5. `animateTo`：显式动画，用于歌词滚动效果。
6. `ResourceStr` 与 `$r()`：资源引用机制，用于读取字符串、颜色、尺寸等资源。

项目运行后的界面是一个单页面应用，首页 `Index.ets` 中依次展示四个文字特效模块：

| 序号 | 展示模块 | 对应组件文件 | 主要技术 |
|---|---|---|---|
| 1 | 文字渐变效果 | `TextGradientView.ets` | `Text` + `linearGradient` + `blendMode` |
| 2 | 歌词滚动效果 | `TextScrollingView.ets` | `linearGradient` + `blendMode` + `animateTo` |
| 3 | 文字倒影效果 | `TextReflectionView.ets` | `Stack` + `rotate` + `linearGradient` |
| 4 | 跑马灯渐变效果 | `TextMarqueeView.ets` | `textOverflow` + `linearGradient` + `blendMode` |

---

## 2. 顶层目录结构总览

项目根目录大致如下：

```text
text-effects-master/
├── AppScope/
├── entry/
├── hvigor/
├── screenshots/
├── .hvigor/
├── .idea/
├── build-profile.json5
├── hvigorfile.ts
├── oh-package.json5
├── README.md
├── README.en.md
└── LICENSE
```

各目录和文件的作用如下：

| 路径 | 类型 | 作用 |
|---|---|---|
| `AppScope/` | 应用级配置目录 | 存放整个应用级别的配置和资源，例如应用名称、图标等。 |
| `entry/` | 主模块目录 | 项目的核心模块，包含 ArkTS 页面、组件、Ability、资源文件和模块配置。 |
| `hvigor/` | 构建工具配置目录 | Hvigor 构建系统配置，类似前端工程中的构建配置目录。 |
| `screenshots/` | 截图目录 | 存放示例运行效果图，README 中引用这些图片。 |
| `.hvigor/` | 构建缓存目录 | DevEco / Hvigor 生成的缓存、构建日志、依赖映射等，一般不需要手动修改。 |
| `.idea/` | IDE 配置目录 | DevEco Studio / IntelliJ 系 IDE 的工程配置，一般不需要手动修改。 |
| `build-profile.json5` | 应用级构建配置 | 定义产品、SDK 版本、模块列表、构建模式等。 |
| `hvigorfile.ts` | 应用级 Hvigor 脚本 | 引入应用级构建任务 `appTasks`。 |
| `oh-package.json5` | 应用级包配置 | 定义工程级依赖，目前为空。 |
| `README.md` | 中文说明文档 | 简要介绍项目功能、目录、实现方式和运行限制。 |
| `README.en.md` | 英文说明文档 | README 的英文版本。 |
| `LICENSE` | 开源协议 | 项目的开源许可文件。 |

---

## 3. 重点目录：entry 模块

`entry` 是整个项目最重要的模块。HarmonyOS 应用通常至少有一个入口模块，常见名称就是 `entry`。本项目的所有业务 UI 代码都在这个模块中。

`entry` 目录结构如下：

```text
entry/
├── build-profile.json5
├── hvigorfile.ts
├── obfuscation-rules.txt
├── oh-package.json5
└── src/
    └── main/
        ├── ets/
        │   ├── constants/
        │   │   └── Constants.ets
        │   ├── entryability/
        │   │   └── EntryAbility.ets
        │   ├── pages/
        │   │   └── Index.ets
        │   └── view/
        │       ├── TextGradientView.ets
        │       ├── TextScrollingView.ets
        │       ├── TextReflectionView.ets
        │       └── TextMarqueeView.ets
        ├── module.json5
        └── resources/
            ├── base/
            │   ├── element/
            │   │   ├── color.json
            │   │   ├── float.json
            │   │   └── string.json
            │   ├── media/
            │   │   ├── background.png
            │   │   ├── foreground.png
            │   │   ├── layered_image.json
            │   │   └── startIcon.png
            │   └── profile/
            │       └── main_pages.json
            ├── en_US/
            │   └── element/
            │       └── string.json
            └── zh_CN/
                └── element/
                    └── string.json
```

`entry` 模块内部可以分成五类内容：

1. **模块构建配置**：`entry/build-profile.json5`、`entry/hvigorfile.ts`、`entry/oh-package.json5`。
2. **模块声明配置**：`entry/src/main/module.json5`。
3. **ArkTS 代码**：`entry/src/main/ets/`。
4. **资源文件**：`entry/src/main/resources/`。
5. **混淆配置**：`entry/obfuscation-rules.txt`。

---

## 4. 程序启动流程

该项目的启动过程可以理解为下面这条链路：

```text
DevEco Studio 点击运行
        ↓
读取根目录 build-profile.json5
        ↓
识别 entry 模块
        ↓
读取 entry/src/main/module.json5
        ↓
找到 mainElement: EntryAbility
        ↓
启动 EntryAbility.ets
        ↓
EntryAbility.onWindowStageCreate()
        ↓
windowStage.loadContent('pages/Index')
        ↓
加载 pages/Index.ets
        ↓
Index 页面引入并展示四个 view 组件
```

对应代码关系如下：

```text
module.json5
  └── mainElement: EntryAbility
        └── EntryAbility.ets
              └── windowStage.loadContent('pages/Index')
                    └── Index.ets
                          ├── TextGradientView.ets
                          ├── TextScrollingView.ets
                          ├── TextReflectionView.ets
                          └── TextMarqueeView.ets
```

这是整个项目最核心的文件关系。

---

## 5. 应用级配置文件解析

### 5.1 `build-profile.json5`

路径：

```text
build-profile.json5
```

作用：

该文件是整个 HarmonyOS 工程的应用级构建配置，用来告诉 DevEco / Hvigor：

1. 当前应用有哪些产品形态。
2. 使用什么 SDK 版本。
3. 目标运行系统是什么。
4. 工程包含哪些模块。
5. 支持哪些构建模式。

项目中的关键内容如下：

```json5
{
  "app": {
    "products": [
      {
        "name": "default",
        "signingConfig": "default",
        "compatibleSdkVersion": "5.0.5(17)",
        "targetSdkVersion": "5.0.5(17)",
        "runtimeOS": "HarmonyOS"
      }
    ],
    "buildModeSet": [
      { "name": "debug" },
      { "name": "release" }
    ]
  },
  "modules": [
    {
      "name": "entry",
      "srcPath": "./entry"
    }
  ]
}
```

重点字段说明：

| 字段 | 含义 |
|---|---|
| `products` | 产品配置。这里只有一个默认产品 `default`。 |
| `compatibleSdkVersion` | 最低兼容 SDK 版本。 |
| `targetSdkVersion` | 目标 SDK 版本。 |
| `runtimeOS` | 目标运行系统，这里是 HarmonyOS。 |
| `buildModeSet` | 构建模式，包含 `debug` 和 `release`。 |
| `modules` | 工程包含的模块列表。此项目只有 `entry` 一个模块。 |
| `srcPath` | 模块路径，指向 `./entry`。 |

这个文件和 `entry/` 目录之间的关系是：

```text
build-profile.json5
  └── modules[0].srcPath = ./entry
        └── entry 模块
```

也就是说，DevEco 打开工程后，是通过这个文件知道 `entry` 是一个需要参与构建的模块。

---

### 5.2 根目录 `oh-package.json5`

路径：

```text
oh-package.json5
```

作用：

该文件是工程级包配置文件，用于声明工程级依赖。当前项目中依赖为空：

```json5
{
  "modelVersion": "5.0.0",
  "description": "Please describe the basic information.",
  "dependencies": {},
  "devDependencies": {}
}
```

说明：

1. 当前示例没有引入第三方库。
2. 所有功能都基于 HarmonyOS 自带 ArkUI 组件和系统 API 实现。
3. 如果后续要引入第三方包，一般会修改这里或模块级 `oh-package.json5`。

---

### 5.3 根目录 `hvigorfile.ts`

路径：

```text
hvigorfile.ts
```

内容：

```ts
import { appTasks } from '@ohos/hvigor-ohos-plugin';

export default {
    system: appTasks,
    plugins: []
}
```

作用：

这是应用级 Hvigor 构建脚本。

| 内容 | 说明 |
|---|---|
| `appTasks` | 应用级构建任务集合。 |
| `system: appTasks` | 表示使用 HarmonyOS 默认应用构建任务。 |
| `plugins: []` | 当前没有自定义插件。 |

可以把它理解成：

```text
告诉构建系统：这个工程是 HarmonyOS 应用工程，请使用默认应用构建流程。
```

---

### 5.4 `hvigor/hvigor-config.json5`

路径：

```text
hvigor/hvigor-config.json5
```

作用：

这是 Hvigor 构建系统的全局配置文件。项目中大部分配置都处于注释状态，使用默认值。

它可以控制：

1. 是否开启增量编译。
2. 是否开启并行编译。
3. 是否开启类型检查。
4. 日志级别。
5. Node 最大内存。
6. 构建调试选项。

当前项目没有进行特殊配置，因此属于比较标准的示例工程配置。

---

## 6. AppScope 应用级资源解析

目录：

```text
AppScope/
├── app.json5
└── resources/
    └── base/
        ├── element/
        │   └── string.json
        └── media/
            └── app_icon.png
```

### 6.1 `AppScope/app.json5`

作用：

该文件通常用于配置应用级信息，例如应用包名、应用标签、版本信息等。它属于整个 App 的范围，不是某一个模块独有。

和 `entry/src/main/module.json5` 的区别是：

| 文件 | 级别 | 作用 |
|---|---|---|
| `AppScope/app.json5` | 应用级 | 描述整个应用。 |
| `entry/src/main/module.json5` | 模块级 | 描述 entry 模块、Ability、页面、设备类型等。 |

### 6.2 `AppScope/resources/`

该目录放的是应用级资源，例如应用图标、应用名称字符串等。模块也可以有自己的资源目录，即 `entry/src/main/resources/`。

---

## 7. 模块级配置文件解析

### 7.1 `entry/build-profile.json5`

路径：

```text
entry/build-profile.json5
```

作用：

这是 `entry` 模块自己的构建配置，主要定义：

1. 模块使用 Stage 模型。
2. release 模式下的混淆配置。
3. 模块构建目标。

关键内容：

```json5
{
  "apiType": "stageMode",
  "buildOption": {},
  "buildOptionSet": [
    {
      "name": "release",
      "arkOptions": {
        "obfuscation": {
          "ruleOptions": {
            "enable": true,
            "files": [
              "./obfuscation-rules.txt"
            ]
          }
        }
      }
    }
  ],
  "targets": [
    {
      "name": "default"
    }
  ]
}
```

重点字段说明：

| 字段 | 说明 |
|---|---|
| `apiType: stageMode` | 使用 HarmonyOS Stage 模型。 |
| `buildOptionSet` | 不同构建模式的配置集合。 |
| `release` | 发布模式配置。 |
| `obfuscation.enable` | release 模式下开启混淆。 |
| `obfuscation-rules.txt` | 混淆规则文件。 |
| `targets` | 模块构建目标。 |

---

### 7.2 `entry/oh-package.json5`

路径：

```text
entry/oh-package.json5
```

作用：

这是 `entry` 模块自己的包配置文件。当前内容为：

```json5
{
  "name": "entry",
  "version": "1.0.0",
  "description": "Please describe the basic information.",
  "main": "",
  "author": "",
  "license": "",
  "dependencies": {}
}
```

说明：

1. 模块名为 `entry`。
2. 版本为 `1.0.0`。
3. 没有引入第三方依赖。
4. 所有组件都直接使用 ArkUI / HarmonyOS 基础能力。

---

### 7.3 `entry/hvigorfile.ts`

路径：

```text
entry/hvigorfile.ts
```

内容：

```ts
import { hapTasks } from '@ohos/hvigor-ohos-plugin';

export default {
    system: hapTasks,
    plugins: []
}
```

作用：

这是模块级 Hvigor 构建脚本。

| 内容 | 说明 |
|---|---|
| `hapTasks` | HAP 模块构建任务。 |
| `system: hapTasks` | 表示该模块按照 HAP 包方式构建。 |
| `plugins: []` | 当前没有自定义插件。 |

与根目录 `hvigorfile.ts` 的区别：

| 文件 | 使用任务 | 级别 |
|---|---|---|
| 根目录 `hvigorfile.ts` | `appTasks` | 应用级 |
| `entry/hvigorfile.ts` | `hapTasks` | 模块级 HAP |

---

### 7.4 `entry/src/main/module.json5`

路径：

```text
entry/src/main/module.json5
```

这是 `entry` 模块非常关键的配置文件。它决定了模块的名称、类型、设备支持、入口 Ability、图标、标签、页面列表等。

关键内容：

```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "description": "$string:module_desc",
    "mainElement": "EntryAbility",
    "deviceTypes": [
      "phone"
    ],
    "deliveryWithInstall": true,
    "installationFree": false,
    "pages": "$profile:main_pages",
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        "description": "$string:EntryAbility_desc",
        "icon": "$media:layered_image",
        "label": "$string:EntryAbility_label",
        "startWindowIcon": "$media:startIcon",
        "startWindowBackground": "$color:start_window_background",
        "exported": true,
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home"
            ]
          }
        ]
      }
    ]
  }
}
```

字段解释：

| 字段 | 说明 |
|---|---|
| `module.name` | 模块名称，当前是 `entry`。 |
| `module.type` | 模块类型，当前是入口模块。 |
| `description` | 模块描述，引用字符串资源 `$string:module_desc`。 |
| `mainElement` | 主入口元素，当前是 `EntryAbility`。 |
| `deviceTypes` | 支持设备类型，当前只支持 `phone`。 |
| `deliveryWithInstall` | 是否随应用安装一起分发，当前为 true。 |
| `installationFree` | 是否免安装，当前为 false。 |
| `pages` | 页面路由配置，引用 `$profile:main_pages`。 |
| `abilities` | Ability 列表。 |
| `srcEntry` | Ability 的源码入口文件。 |
| `icon` | 应用图标资源。 |
| `label` | 应用显示名称。 |
| `startWindowIcon` | 启动窗口图标。 |
| `startWindowBackground` | 启动窗口背景颜色。 |
| `exported` | 是否可被外部拉起。 |
| `skills` | 启动入口声明，包含 home 图标入口能力。 |

它和代码文件之间的关系非常重要：

```text
module.json5
  ├── mainElement: EntryAbility
  ├── abilities[0].srcEntry: ./ets/entryability/EntryAbility.ets
  └── pages: $profile:main_pages
```

也就是说：

1. 系统先读取 `module.json5`。
2. 确认主 Ability 是 `EntryAbility`。
3. 根据 `srcEntry` 找到 `EntryAbility.ets`。
4. 根据 `pages` 找到页面路由配置 `main_pages.json`。

---

## 8. 页面路由资源解析

### 8.1 `main_pages.json`

路径：

```text
entry/src/main/resources/base/profile/main_pages.json
```

内容：

```json
{
  "src": [
    "pages/Index"
  ]
}
```

作用：

该文件声明了模块中可被路由加载的页面。当前只有一个页面：

```text
pages/Index
```

它对应的源码文件是：

```text
entry/src/main/ets/pages/Index.ets
```

两者关系：

```text
main_pages.json
  └── pages/Index
        └── entry/src/main/ets/pages/Index.ets
```

`EntryAbility.ets` 中也正是通过这个路径加载页面：

```ts
windowStage.loadContent('pages/Index', ...)
```

因此 `main_pages.json` 和 `EntryAbility.ets` 的页面路径需要保持一致。

---

## 9. ArkTS 源码目录总体结构

源码主目录：

```text
entry/src/main/ets/
├── constants/
│   └── Constants.ets
├── entryability/
│   └── EntryAbility.ets
├── pages/
│   └── Index.ets
└── view/
    ├── TextGradientView.ets
    ├── TextScrollingView.ets
    ├── TextReflectionView.ets
    └── TextMarqueeView.ets
```

这个目录可以分成四层职责：

| 目录 | 职责 | 说明 |
|---|---|---|
| `constants/` | 常量层 | 存放可复用常量，避免魔法数字和重复字符串。 |
| `entryability/` | 应用入口层 | 负责 Ability 生命周期和加载首页。 |
| `pages/` | 页面层 | 负责页面整体布局和组织子组件。 |
| `view/` | 组件层 | 负责具体文字特效的独立 UI 实现。 |

整体架构关系：

```text
EntryAbility.ets
  ↓ 加载
Index.ets
  ↓ 组合
TextGradientView.ets
TextScrollingView.ets
TextReflectionView.ets
TextMarqueeView.ets
  ↑ 使用
Constants.ets
  ↑ 使用
resources/base/element/*.json
```

---

## 10. `Constants.ets` 常量文件解析

路径：

```text
entry/src/main/ets/constants/Constants.ets
```

作用：

该文件定义了一组项目中复用的常量，避免在多个组件中反复写相同的值。

代码结构：

```ts
export default class Constants {
  static readonly FULL_PERCENT: string = '100%';
  static readonly TEXT_SCROLL_DURATION: number = 5000;
  static readonly ANGLE_DEGREE: number = 180;
  static readonly FIFTY_PERCENT: string = '50%';
  static readonly ANGLE_DEGREE_HORIZONTAL: number = 90;
  static readonly FONT_WEIGHT_500: number = 500;
}
```

常量说明：

| 常量名 | 值 | 用途 |
|---|---:|---|
| `FULL_PERCENT` | `'100%'` | 宽度、高度、旋转中心等场景表示 100%。 |
| `TEXT_SCROLL_DURATION` | `5000` | 歌词滚动动画持续时间，单位通常按毫秒理解。 |
| `ANGLE_DEGREE` | `180` | 文字倒影中用于上下翻转文本。 |
| `FIFTY_PERCENT` | `'50%'` | 倒影旋转中心 X 坐标。 |
| `ANGLE_DEGREE_HORIZONTAL` | `90` | 跑马灯渐变的线性渐变角度。 |
| `FONT_WEIGHT_500` | `500` | 首页标题字体粗细。 |

被哪些文件使用：

```text
Constants.ets
├── Index.ets
├── TextScrollingView.ets
├── TextReflectionView.ets
└── TextMarqueeView.ets
```

没有使用它的组件：

```text
TextGradientView.ets
```

因为文字渐变组件中没有复用这些常量。

---

## 11. `EntryAbility.ets` 入口文件解析

路径：

```text
entry/src/main/ets/entryability/EntryAbility.ets
```

作用：

`EntryAbility` 是应用的主 Ability。它负责接收系统生命周期回调，并在窗口创建时加载主页面 `pages/Index`。

### 11.1 导入模块

```ts
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
```

说明：

| 导入内容 | 来源 | 用途 |
|---|---|---|
| `UIAbility` | `@kit.AbilityKit` | 定义应用 Ability。 |
| `AbilityConstant` | `@kit.AbilityKit` | Ability 启动参数相关类型。 |
| `Want` | `@kit.AbilityKit` | Ability 启动意图对象。 |
| `hilog` | `@kit.PerformanceAnalysisKit` | 日志输出。 |
| `window` | `@kit.ArkUI` | 窗口阶段相关类型。 |

### 11.2 生命周期函数

`EntryAbility` 中包含以下生命周期函数：

| 函数 | 触发时机 | 当前作用 |
|---|---|---|
| `onCreate()` | Ability 创建时 | 打印日志。 |
| `onDestroy()` | Ability 销毁时 | 打印日志。 |
| `onWindowStageCreate()` | 窗口创建时 | 加载主页面。 |
| `onWindowStageDestroy()` | 窗口销毁时 | 打印日志。 |
| `onForeground()` | 应用进入前台时 | 打印日志。 |
| `onBackground()` | 应用进入后台时 | 打印日志。 |

### 11.3 核心代码：加载页面

最关键代码是：

```ts
windowStage.loadContent('pages/Index', (err) => {
  if (err.code) {
    hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
    return;
  }
  hilog.info(0x0000, 'testTag', 'Succeeded in loading the content.');
});
```

这段代码的作用是：

1. 在应用窗口创建完成后，加载页面 `pages/Index`。
2. 如果加载失败，输出错误日志。
3. 如果加载成功，输出成功日志。

该路径对应文件：

```text
pages/Index
  ↓
entry/src/main/ets/pages/Index.ets
```

因此，如果未来你把 `Index.ets` 移动或改名，必须同步修改：

1. `EntryAbility.ets` 中的 `loadContent('pages/Index')`。
2. `main_pages.json` 中的页面路径。

---

## 12. `Index.ets` 首页文件解析

路径：

```text
entry/src/main/ets/pages/Index.ets
```

作用：

`Index.ets` 是整个应用的主页面。它本身不直接实现复杂文字特效，而是：

1. 定义页面导航容器。
2. 定义每个模块标题样式。
3. 定义每个特效展示区域样式。
4. 引入四个文字特效组件并逐个展示。

### 12.1 文件导入关系

```ts
import Constants from '../constants/Constants';
import TextGradientView from '../view/TextGradientView';
import TextMarqueeView from '../view/TextMarqueeView';
import TextReflectionView from '../view/TextReflectionView';
import TextScrollingView from '../view/TextScrollingView';
```

这说明 `Index.ets` 依赖五个文件：

```text
Index.ets
├── Constants.ets
├── TextGradientView.ets
├── TextMarqueeView.ets
├── TextReflectionView.ets
└── TextScrollingView.ets
```

### 12.2 组件声明

```ts
@Entry
@Component
struct Index {
  ...
}
```

说明：

| 装饰器 | 作用 |
|---|---|
| `@Entry` | 表示这是一个页面入口组件。 |
| `@Component` | 表示这是一个 ArkUI 自定义组件。 |

### 12.3 状态变量

```ts
@State message: ResourceStr = $r('app.string.text_content');
@State messageLong: ResourceStr = $r('app.string.text_content_long');
@State value: number = 0;
```

说明：

| 变量 | 类型 | 作用 |
|---|---|---|
| `message` | `ResourceStr` | 短文本，传给前三个特效组件。 |
| `messageLong` | `ResourceStr` | 长文本，传给跑马灯组件。 |
| `value` | `number` | 当前页面中声明但没有实际使用。 |

`message` 的资源来源：

```text
$r('app.string.text_content')
  ↓
resources/base/element/string.json
resources/zh_CN/element/string.json
resources/en_US/element/string.json
```

`messageLong` 的资源来源：

```text
$r('app.string.text_content_long')
  ↓
resources/base/element/string.json
resources/zh_CN/element/string.json
resources/en_US/element/string.json
```

根据系统语言不同，会选择不同语言目录下的字符串资源。

### 12.4 公共样式 `fancy()`

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

作用：

该样式用于四个展示卡片区域，统一设置：

1. 圆角。
2. 白色背景。
3. 上下内边距。
4. 宽度 100%。

资源引用关系：

```text
fancy()
├── $r('app.float.row_border_radius') → float.json
├── $r('app.float.row_padding') → float.json
└── Constants.FULL_PERCENT → Constants.ets
```

### 12.5 标题构造器 `textBuilder()`

```ts
@Builder
textBuilder(value: ResourceStr) {
  Row() {
    Text(value)
      .fontSize($r("app.float.title_font_size"))
      .fontColor($r('app.color.title_font_color'))
      .fontWeight(Constants.FONT_WEIGHT_500)
      .margin({ top: $r('app.float.title_margin_bottom') })
      .lineHeight($r('app.float.title_line_height'))
  }
  .width(Constants.FULL_PERCENT)
  .height($r('app.float.title_row_height'))
  .margin({ bottom: $r('app.float.title_row_margin_bottom') })
}
```

作用：

这是一个可复用的标题区域构造函数，用来生成每个特效模块上方的小标题。

被调用四次：

```ts
this.textBuilder($r('app.string.text_gradient'))
this.textBuilder($r('app.string.text_scrolling'))
this.textBuilder($r('app.string.text_reflection'))
this.textBuilder($r('app.string.text_marquee'))
```

资源关系：

```text
textBuilder()
├── 文本内容 → string.json
├── 字体大小 → float.json
├── 字体颜色 → color.json
├── 字体粗细 → Constants.ets
├── 行高 → float.json
└── 标题区域尺寸 → float.json
```

### 12.6 页面布局 `build()`

`Index.ets` 的主布局结构如下：

```text
Navigation
└── Column
    ├── 标题：文字渐变效果
    ├── Row 卡片
    │   └── TextGradientView
    ├── 标题：歌词滚动效果
    ├── Row 卡片
    │   └── TextScrollingView
    ├── 标题：文字倒影效果
    ├── Row 卡片
    │   └── TextReflectionView
    ├── 标题：跑马灯渐变效果
    └── Row 卡片
        └── TextMarqueeView
```

页面中四个组件的调用方式：

```ts
TextGradientView({ message: this.message })
TextScrollingView({ message: this.message })
TextReflectionView({ message: this.message })
TextMarqueeView({ message: this.messageLong })
```

这说明：

1. 前三个组件使用短文本。
2. 跑马灯组件使用长文本，因为跑马灯必须有足够长的内容才能看到滚动效果。

### 12.7 Navigation 配置

```ts
Navigation() {
  ...
}
.height(Constants.FULL_PERCENT)
.width(Constants.FULL_PERCENT)
.title($r('app.string.title'))
.backgroundColor($r('app.color.page_background_color'))
.mode(NavigationMode.Stack)
```

说明：

| 属性 | 作用 |
|---|---|
| `height('100%')` | 页面高度占满屏幕。 |
| `width('100%')` | 页面宽度占满屏幕。 |
| `title()` | 顶部标题，来自字符串资源。 |
| `backgroundColor()` | 页面背景色，来自颜色资源。 |
| `mode(NavigationMode.Stack)` | 使用栈式导航模式。 |

---

## 13. 四个文字特效组件详细解析

---

### 13.1 `TextGradientView.ets`：文字渐变效果

路径：

```text
entry/src/main/ets/view/TextGradientView.ets
```

作用：

实现“文字颜色渐变”效果。

核心代码：

```ts
@Component
export default struct TextGradientView {
  @State message: ResourceStr = '';

  build() {
    Row() {
      Text(this.message)
        .fontSize($r('app.float.content_font_size'))
        .fontWeight(FontWeight.Bold)
        .blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN)
    }
    .linearGradient({
      direction: GradientDirection.Right,
      colors: [[$r('app.color.gradient_start_color'), 0.0], [$r('app.color.gradient_end_color'), 1]]
    })
    .blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN)
  }
}
```

#### 13.1.1 输入数据

该组件接收一个状态变量：

```ts
@State message: ResourceStr = '';
```

它由首页传入：

```ts
TextGradientView({ message: this.message })
```

数据流如下：

```text
string.json 中的 text_content
  ↓
Index.ets 的 message
  ↓
TextGradientView 的 message
  ↓
Text(this.message)
```

#### 13.1.2 实现原理

文字渐变的核心思路是：

```text
先给 Row 设置渐变背景
        ↓
再用 Text 的形状作为遮罩
        ↓
最终只在文字区域显示渐变颜色
```

关键属性：

| 属性 | 作用 |
|---|---|
| `linearGradient` | 给 Row 设置从左到右的渐变。 |
| `blendMode(BlendMode.DST_IN)` | 让文本区域作为遮罩，使渐变只显示在文字轮廓内。 |
| `BlendApplyType.OFFSCREEN` | 使用离屏混合，避免混合影响外部组件。 |

渐变颜色来源：

```text
$r('app.color.gradient_start_color') → #F97794
$r('app.color.gradient_end_color') → #623AA2
```

#### 13.1.3 与其他文件的关系

```text
TextGradientView.ets
├── 被 Index.ets 导入和调用
├── 使用 float.json 中 content_font_size
└── 使用 color.json 中 gradient_start_color / gradient_end_color
```

它没有依赖 `Constants.ets`。

---

### 13.2 `TextScrollingView.ets`：歌词滚动效果

路径：

```text
entry/src/main/ets/view/TextScrollingView.ets
```

作用：

实现类似“KTV 歌词逐渐变色”的滚动高亮效果。

核心代码：

```ts
@Component
export default struct TextScrollingView {
  @State message: ResourceStr = '';
  @State value: number = 0;

  build() {
    Row() {
      Text(this.message)
        .fontSize($r('app.float.content_font_size'))
        .fontColor(Color.Black)
        .fontWeight(FontWeight.Bold)
        .blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN)
    }
    .linearGradient({
      direction: GradientDirection.Right,
      colors: [[Color.Red, 0.0], [Color.Red, this.value], [Color.Black, this.value], [Color.Black, 1.0]]
    })
    .blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN)
    .backgroundImageSize({
      width: 0,
      height: 0
    })
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
  }
}
```

#### 13.2.1 输入数据

```ts
@State message: ResourceStr = '';
```

由首页传入：

```ts
TextScrollingView({ message: this.message })
```

#### 13.2.2 动画状态变量

```ts
@State value: number = 0;
```

`value` 是歌词滚动的关键变量。

它在渐变中被使用：

```ts
colors: [[Color.Red, 0.0], [Color.Red, this.value], [Color.Black, this.value], [Color.Black, 1.0]]
```

当 `value = 0` 时：

```text
红色区域几乎没有，文字主要是黑色。
```

当 `value = 0.5` 时：

```text
左半部分红色，右半部分黑色。
```

当 `value = 1` 时：

```text
红色覆盖全部文字。
```

#### 13.2.3 动画逻辑

在组件出现时触发：

```ts
.onAppear(() => {
  this.getUIContext().animateTo({
    duration: Constants.TEXT_SCROLL_DURATION,
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

含义：

1. 组件出现后执行动画。
2. 动画时间为 `Constants.TEXT_SCROLL_DURATION`，即 5000ms。
3. 动画曲线为线性 `Curve.Linear`。
4. `iterations: -1` 表示无限循环。
5. 动画目标是把 `value` 从 `0` 变成 `1`。
6. 每次动画结束后，把 `value` 重置为 `0`。

动画流程：

```text
value = 0
  ↓ animateTo 5秒
value 逐渐变为 1
  ↓ onFinish
value = 0
  ↓ 下一轮动画
无限循环
```

#### 13.2.4 实现原理

歌词滚动效果可以理解为：

```text
文本形状作为遮罩
        ↓
底层是红黑分界的线性渐变
        ↓
动画不断移动红黑分界线
        ↓
形成文字逐渐变红的效果
```

这里并不是文字本身移动，而是“颜色边界”在移动。

#### 13.2.5 与其他文件的关系

```text
TextScrollingView.ets
├── 被 Index.ets 导入和调用
├── 引入 Constants.ets
│   └── 使用 TEXT_SCROLL_DURATION
└── 使用 float.json 中 content_font_size
```

---

### 13.3 `TextReflectionView.ets`：文字倒影效果

路径：

```text
entry/src/main/ets/view/TextReflectionView.ets
```

作用：

实现文字本体加下方倒影的效果。

核心代码：

```ts
@Component
export default struct TextRefectionView {
  @State message: ResourceStr = '';

  build() {
    Stack() {
      Text(this.message)
        .fontSize($r('app.float.content_font_size'))
        .fontColor(Color.Red)
        .fontWeight(FontWeight.Bold)
      Text(this.message)
        .fontSize($r('app.float.content_font_size'))
        .fontColor(Color.Red)
        .fontWeight(FontWeight.Bold)
        .rotate({
          x: 1,
          y: 0,
          z: 0,
          angle: Constants.ANGLE_DEGREE,
          centerX: Constants.FIFTY_PERCENT,
          centerY: Constants.FULL_PERCENT
        })
        .blendMode(BlendMode.DST_IN, BlendApplyType.OFFSCREEN)
    }
    .linearGradient({
      direction: GradientDirection.Bottom,
      colors: [[Color.Transparent, 0], [Color.Transparent, 0.50],
        [Color.Red, 0.50], [$r('app.color.text_reflection_color'), 1]]
    })
    .height($r('app.float.text_refection_height'))
    .alignContent(Alignment.Top)
    .blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN)
  }
}
```

#### 13.3.1 输入数据

```ts
@State message: ResourceStr = '';
```

由首页传入：

```ts
TextReflectionView({ message: this.message })
```

#### 13.3.2 结构设计

组件使用 `Stack()`：

```text
Stack
├── Text：原始文字
└── Text：旋转后的倒影文字
```

`Stack` 的特点是子组件叠放，而不是像 `Column` 或 `Row` 那样线性排列。因此它适合做图层叠加。

#### 13.3.3 倒影生成原理

第二个 `Text` 通过 `rotate()` 旋转：

```ts
.rotate({
  x: 1,
  y: 0,
  z: 0,
  angle: Constants.ANGLE_DEGREE,
  centerX: Constants.FIFTY_PERCENT,
  centerY: Constants.FULL_PERCENT
})
```

含义：

| 参数 | 值 | 说明 |
|---|---:|---|
| `x` | 1 | 绕 X 轴旋转。 |
| `y` | 0 | 不绕 Y 轴旋转。 |
| `z` | 0 | 不绕 Z 轴旋转。 |
| `angle` | 180 | 旋转 180 度。 |
| `centerX` | 50% | 旋转中心在水平中点。 |
| `centerY` | 100% | 旋转中心在文字底部。 |

这会让第二个文本上下翻转，形成倒影。

#### 13.3.4 渐隐效果

倒影不是直接显示完整红色文字，而是结合线性渐变：

```ts
.linearGradient({
  direction: GradientDirection.Bottom,
  colors: [[Color.Transparent, 0], [Color.Transparent, 0.50],
    [Color.Red, 0.50], [$r('app.color.text_reflection_color'), 1]]
})
```

意思是：

1. 上半部分透明，避免影响原始文字区域。
2. 从 50% 位置开始出现红色。
3. 越往下越接近透明色，形成倒影逐渐消失的效果。

`text_reflection_color` 定义为：

```json
{
  "name": "text_reflection_color",
  "value": "#00F3C8C8"
}
```

其中 `#00` 表示透明度为 0，因此这是一个透明色。

#### 13.3.5 需要注意的命名问题

文件名是：

```text
TextReflectionView.ets
```

但组件导出名是：

```ts
export default struct TextRefectionView
```

这里 `Refection` 少了一个 `l`，正确拼写应为 `Reflection`。

由于它是 `export default`，外部导入时可以命名为：

```ts
import TextReflectionView from '../view/TextReflectionView';
```

所以目前不影响运行。但是从代码规范角度，建议改为：

```ts
export default struct TextReflectionView
```

同时还存在资源名拼写：

```text
text_refection_height
```

也少了一个 `l`，建议改成：

```text
text_reflection_height
```

不过如果修改资源名，代码中对应引用也要同步修改。

#### 13.3.6 与其他文件的关系

```text
TextReflectionView.ets
├── 被 Index.ets 导入和调用
├── 引入 Constants.ets
│   ├── ANGLE_DEGREE
│   ├── FIFTY_PERCENT
│   └── FULL_PERCENT
├── 使用 float.json 中 content_font_size
├── 使用 float.json 中 text_refection_height
└── 使用 color.json 中 text_reflection_color
```

---

### 13.4 `TextMarqueeView.ets`：跑马灯渐变效果

路径：

```text
entry/src/main/ets/view/TextMarqueeView.ets
```

作用：

实现长文本的跑马灯滚动，并在左右两侧添加透明渐隐效果。

核心代码：

```ts
import Constants from '../constants/Constants';

@Component
export default struct TextGradientView {
  @State message: ResourceStr = '';

  build() {
    Row() {
      Column() {
        Text(this.message)
          .width($r('app.string.ninety_percent'))
          .fontColor(Color.Black)
          .fontSize($r('app.float.content_font_size'))
          .fontWeight(FontWeight.Bold)
          .textOverflow({ overflow: TextOverflow.MARQUEE })
      }
      .blendMode(BlendMode.SRC_IN, BlendApplyType.OFFSCREEN)
      .backgroundColor(Color.Transparent)
      .width(Constants.FULL_PERCENT)
    }
    .width(Constants.FULL_PERCENT)
    .linearGradient({
      angle: Constants.ANGLE_DEGREE_HORIZONTAL,
      colors: [[Color.Transparent, 0], [Color.Black, 0.2],
        [Color.Black, 0.8], [Color.Transparent, 1]]
    })
    .blendMode(BlendMode.SRC_OVER, BlendApplyType.OFFSCREEN)
  }
}
```

#### 13.4.1 输入数据

该组件接收长文本：

```ts
TextMarqueeView({ message: this.messageLong })
```

`messageLong` 来自资源：

```text
$r('app.string.text_content_long')
```

中文资源为：

```text
这是一段文字示例 这是一段文字示例 这是一段文字示例
```

英文资源为：

```text
This is a text example. This is a text example. This is a text example.
```

#### 13.4.2 跑马灯核心属性

```ts
.textOverflow({ overflow: TextOverflow.MARQUEE })
```

作用：

当文字内容超过可显示区域时，以跑马灯方式滚动展示。

为了让超出效果出现，文本宽度设置为：

```ts
.width($r('app.string.ninety_percent'))
```

其中 `ninety_percent` 的值是：

```text
90%
```

#### 13.4.3 左右渐隐效果

外层 Row 使用线性渐变：

```ts
.linearGradient({
  angle: Constants.ANGLE_DEGREE_HORIZONTAL,
  colors: [[Color.Transparent, 0], [Color.Black, 0.2],
    [Color.Black, 0.8], [Color.Transparent, 1]]
})
```

含义：

```text
最左侧透明
  ↓
中间黑色不透明
  ↓
最右侧透明
```

再结合：

```ts
.blendMode(BlendMode.SRC_IN, BlendApplyType.OFFSCREEN)
```

使文字内容在左右边缘逐渐淡出。

#### 13.4.4 需要注意的命名问题

文件名是：

```text
TextMarqueeView.ets
```

但组件导出名写成了：

```ts
export default struct TextGradientView
```

这与 `TextGradientView.ets` 里的组件名重复。从运行角度看，因为是默认导出，`Index.ets` 中导入时命名为 `TextMarqueeView`，通常仍然可以工作：

```ts
import TextMarqueeView from '../view/TextMarqueeView';
```

但从可读性和维护性来说，建议改为：

```ts
export default struct TextMarqueeView
```

否则后续调试时容易混淆。

#### 13.4.5 与其他文件的关系

```text
TextMarqueeView.ets
├── 被 Index.ets 导入和调用
├── 引入 Constants.ets
│   ├── FULL_PERCENT
│   └── ANGLE_DEGREE_HORIZONTAL
├── 使用 string.json 中 ninety_percent
└── 使用 float.json 中 content_font_size
```

---

## 14. 资源文件结构详细解析

资源目录：

```text
entry/src/main/resources/
├── base/
│   ├── element/
│   │   ├── color.json
│   │   ├── float.json
│   │   └── string.json
│   ├── media/
│   │   ├── background.png
│   │   ├── foreground.png
│   │   ├── layered_image.json
│   │   └── startIcon.png
│   └── profile/
│       └── main_pages.json
├── en_US/
│   └── element/
│       └── string.json
└── zh_CN/
    └── element/
        └── string.json
```

HarmonyOS 中，资源通常通过 `$r()` 引用。例如：

```ts
$r('app.string.title')
$r('app.float.content_font_size')
$r('app.color.page_background_color')
```

---

### 14.1 `color.json`

路径：

```text
entry/src/main/resources/base/element/color.json
```

定义项目颜色资源。

| 资源名 | 值 | 使用位置 | 说明 |
|---|---|---|---|
| `start_window_background` | `#FFFFFF` | `module.json5` | 启动窗口背景色。 |
| `title_font_color` | `#99000000` | `Index.ets` | 每个模块标题颜色，半透明黑。 |
| `gradient_start_color` | `#F97794` | `TextGradientView.ets` | 文字渐变起始颜色。 |
| `gradient_end_color` | `#623AA2` | `TextGradientView.ets` | 文字渐变结束颜色。 |
| `text_reflection_color` | `#00F3C8C8` | `TextReflectionView.ets` | 倒影底部透明色。 |
| `page_background_color` | `#F1F3F5` | `Index.ets` | 页面背景色。 |

颜色资源引用关系：

```text
color.json
├── module.json5
│   └── start_window_background
├── Index.ets
│   ├── title_font_color
│   └── page_background_color
├── TextGradientView.ets
│   ├── gradient_start_color
│   └── gradient_end_color
└── TextReflectionView.ets
    └── text_reflection_color
```

---

### 14.2 `float.json`

路径：

```text
entry/src/main/resources/base/element/float.json
```

定义尺寸、字体大小、间距等资源。

| 资源名 | 值 | 使用位置 | 说明 |
|---|---:|---|---|
| `title_font_size` | `18fp` | `Index.ets` | 模块标题字体大小。 |
| `title_margin_bottom` | `18vp` | `Index.ets` | 标题顶部 margin。 |
| `content_font_size` | `30fp` | 四个 view 组件 | 特效文字字体大小。 |
| `text_refection_height` | `74vp` | `TextReflectionView.ets` | 倒影组件高度。 |
| `row_border_radius` | `16vp` | `Index.ets` | 白色卡片圆角。 |
| `row_padding` | `14vp` | `Index.ets` | 白色卡片上下内边距。 |
| `title_line_height` | `22fp` | `Index.ets` | 标题行高。 |
| `title_row_height` | `50vp` | `Index.ets` | 标题行高度。 |
| `title_row_margin_bottom` | `6vp` | `Index.ets` | 标题行底部 margin。 |
| `area_padding_left` | `16vp` | `Index.ets` | 页面左右边距。 |

尺寸资源引用关系：

```text
float.json
├── Index.ets
│   ├── title_font_size
│   ├── title_margin_bottom
│   ├── row_border_radius
│   ├── row_padding
│   ├── title_line_height
│   ├── title_row_height
│   ├── title_row_margin_bottom
│   └── area_padding_left
├── TextGradientView.ets
│   └── content_font_size
├── TextScrollingView.ets
│   └── content_font_size
├── TextReflectionView.ets
│   ├── content_font_size
│   └── text_refection_height
└── TextMarqueeView.ets
    └── content_font_size
```

---

### 14.3 `string.json`

项目有三套字符串资源：

```text
entry/src/main/resources/base/element/string.json
entry/src/main/resources/en_US/element/string.json
entry/src/main/resources/zh_CN/element/string.json
```

其中：

| 目录 | 作用 |
|---|---|
| `base/element/string.json` | 默认字符串资源。 |
| `en_US/element/string.json` | 英文环境字符串资源。 |
| `zh_CN/element/string.json` | 中文环境字符串资源。 |

主要字符串资源如下：

| 资源名 | 中文值 | 英文值 | 使用位置 |
|---|---|---|---|
| `module_desc` | 模块描述 | module description | `module.json5` |
| `EntryAbility_desc` | description | description | `module.json5` |
| `EntryAbility_label` | 文字特效 | TextEffects | `module.json5` |
| `text_content` | 这是一段文字示例 | This is a text example. | `Index.ets` |
| `text_content_long` | 这是一段文字示例... | This is a text example... | `Index.ets` |
| `ninety_percent` | 90% | 90% | `TextMarqueeView.ets` |
| `text_gradient` | 文字渐变效果 | Text gradient effect. | `Index.ets` |
| `text_scrolling` | 歌词滚动效果 | Lyrics scrolling effect. | `Index.ets` |
| `text_reflection` | 文字倒影效果 | Text reflection effect. | `Index.ets` |
| `text_marquee` | 跑马灯渐变效果 | The scrolling light gradient effect. | `Index.ets` |
| `title` | 文字特效合集 | Text Effect Collection | `Index.ets` |

字符串资源引用关系：

```text
string.json
├── module.json5
│   ├── module_desc
│   ├── EntryAbility_desc
│   └── EntryAbility_label
├── Index.ets
│   ├── title
│   ├── text_content
│   ├── text_content_long
│   ├── text_gradient
│   ├── text_scrolling
│   ├── text_reflection
│   └── text_marquee
└── TextMarqueeView.ets
    └── ninety_percent
```

---

### 14.4 `media/` 图片资源

路径：

```text
entry/src/main/resources/base/media/
```

文件包括：

```text
background.png
foreground.png
layered_image.json
startIcon.png
```

作用：

| 文件 | 作用 |
|---|---|
| `background.png` | 分层图标背景图。 |
| `foreground.png` | 分层图标前景图。 |
| `layered_image.json` | 分层图标配置文件。 |
| `startIcon.png` | 启动窗口图标。 |

与 `module.json5` 的关系：

```json5
"icon": "$media:layered_image",
"startWindowIcon": "$media:startIcon"
```

即：

```text
module.json5
├── 应用图标 → layered_image.json
└── 启动图标 → startIcon.png
```

---

## 15. 文件之间的完整依赖关系图

### 15.1 构建层依赖关系

```text
DevEco Studio / Hvigor
    ↓
build-profile.json5
    ↓
entry 模块
    ↓
entry/build-profile.json5
    ↓
entry/hvigorfile.ts
    ↓
entry/src/main/module.json5
```

### 15.2 运行层依赖关系

```text
module.json5
    ↓ srcEntry
EntryAbility.ets
    ↓ loadContent('pages/Index')
Index.ets
    ↓ imports
四个文字特效组件
```

### 15.3 UI 组件依赖关系

```text
Index.ets
├── Constants.ets
├── TextGradientView.ets
│   ├── color.json
│   └── float.json
├── TextScrollingView.ets
│   ├── Constants.ets
│   └── float.json
├── TextReflectionView.ets
│   ├── Constants.ets
│   ├── color.json
│   └── float.json
└── TextMarqueeView.ets
    ├── Constants.ets
    ├── string.json
    └── float.json
```

### 15.4 资源层依赖关系

```text
resources/
├── base/element/color.json
│   ├── Index.ets
│   ├── TextGradientView.ets
│   ├── TextReflectionView.ets
│   └── module.json5
├── base/element/float.json
│   ├── Index.ets
│   ├── TextGradientView.ets
│   ├── TextScrollingView.ets
│   ├── TextReflectionView.ets
│   └── TextMarqueeView.ets
├── base/element/string.json
│   ├── module.json5
│   ├── Index.ets
│   └── TextMarqueeView.ets
├── base/profile/main_pages.json
│   ├── module.json5
│   └── EntryAbility.ets 的页面路径需要保持一致
└── base/media/
    └── module.json5
```

---

## 16. 数据流分析

该项目没有网络请求、数据库、文件读写、用户输入等复杂业务数据流。主要数据流是“资源字符串 → 页面状态 → 组件显示”。

### 16.1 短文本数据流

```text
resources/*/element/string.json
  └── text_content
        ↓ $r('app.string.text_content')
Index.ets
  └── @State message
        ↓ 组件参数传递
TextGradientView / TextScrollingView / TextReflectionView
        ↓
Text(this.message)
```

### 16.2 长文本数据流

```text
resources/*/element/string.json
  └── text_content_long
        ↓ $r('app.string.text_content_long')
Index.ets
  └── @State messageLong
        ↓ 组件参数传递
TextMarqueeView
        ↓
Text(this.message)
        ↓
textOverflow({ overflow: TextOverflow.MARQUEE })
```

### 16.3 样式数据流

```text
resources/base/element/color.json
resources/base/element/float.json
Constants.ets
        ↓
Index.ets 和 view 组件
        ↓
ArkUI 组件属性
        ↓
最终界面效果
```

---

## 17. 页面渲染结构分析

`Index.ets` 的实际渲染层级可以写成如下伪结构：

```text
Navigation(title = 文字特效合集)
└── Column(padding-left/right = 16vp)
    ├── Row(title = 文字渐变效果)
    ├── Row(card)
    │   └── TextGradientView
    │       └── Row(linearGradient)
    │           └── Text(message)
    │
    ├── Row(title = 歌词滚动效果)
    ├── Row(card)
    │   └── TextScrollingView
    │       └── Row(animated linearGradient)
    │           └── Text(message)
    │
    ├── Row(title = 文字倒影效果)
    ├── Row(card)
    │   └── TextReflectionView
    │       └── Stack(linearGradient)
    │           ├── Text(message)
    │           └── Text(message rotated 180deg)
    │
    ├── Row(title = 跑马灯渐变效果)
    └── Row(card)
        └── TextMarqueeView
            └── Row(linearGradient mask)
                └── Column
                    └── Text(long message, MARQUEE)
```

这个结构说明：

1. 首页负责“大布局”。
2. 每个 view 组件负责“单一特效”。
3. 特效组件之间互不依赖。
4. 常量和资源文件为所有 UI 提供统一配置。

---

## 18. 四个特效的实现对比

| 特效 | 组件 | 是否动画 | 是否文本移动 | 是否使用渐变 | 是否使用混合模式 | 核心变量 |
|---|---|---|---|---|---|---|
| 文字渐变 | `TextGradientView` | 否 | 否 | 是 | 是 | 无 |
| 歌词滚动 | `TextScrollingView` | 是 | 否 | 是 | 是 | `value` |
| 文字倒影 | `TextReflectionView` | 否 | 否 | 是 | 是 | 旋转角度 |
| 跑马灯渐变 | `TextMarqueeView` | 系统内置滚动 | 是 | 是 | 是 | `TextOverflow.MARQUEE` |

其中最容易混淆的是：

1. **歌词滚动效果**：文字不移动，只是颜色分界线移动。
2. **跑马灯渐变效果**：文字本身会横向滚动。

---

## 19. 程序运行时的生命周期顺序

运行应用后，大致生命周期如下：

```text
1. 系统创建 EntryAbility
2. 调用 EntryAbility.onCreate()
3. 创建窗口 WindowStage
4. 调用 EntryAbility.onWindowStageCreate()
5. 执行 windowStage.loadContent('pages/Index')
6. Index 页面开始构建
7. Index.build() 被调用
8. 四个子组件依次构建
9. TextScrollingView 出现后触发 onAppear()
10. TextScrollingView 开始无限循环动画
11. 应用进入后台时调用 onBackground()
12. 应用回到前台时调用 onForeground()
13. 应用关闭时调用 onWindowStageDestroy() 和 onDestroy()
```

---

## 20. 关键代码关系逐行级说明

### 20.1 `Index.ets` 为什么能调用四个组件？

因为顶部写了：

```ts
import TextGradientView from '../view/TextGradientView';
import TextMarqueeView from '../view/TextMarqueeView';
import TextReflectionView from '../view/TextReflectionView';
import TextScrollingView from '../view/TextScrollingView';
```

所以在 `build()` 里可以直接使用：

```ts
TextGradientView({ message: this.message })
```

这里的 `{ message: this.message }` 是父组件向子组件传参。

### 20.2 为什么子组件都有 `@State message`？

例如：

```ts
@State message: ResourceStr = '';
```

这使组件可以接收并保存外部传入的文本资源。父组件传入后，子组件用：

```ts
Text(this.message)
```

进行显示。

### 20.3 为什么大量使用 `$r()`？

例如：

```ts
.fontSize($r('app.float.content_font_size'))
```

这是 HarmonyOS 的资源引用写法。好处是：

1. 样式参数统一管理。
2. 支持多语言。
3. 修改颜色、尺寸时不必逐个改代码。
4. 方便适配不同设备和主题。

### 20.4 为什么使用 `BlendApplyType.OFFSCREEN`？

多个组件都使用：

```ts
.blendMode(..., BlendApplyType.OFFSCREEN)
```

它的作用是让混合效果在离屏缓冲区中完成，避免影响页面中其他组件。对于渐变文字、透明遮罩、倒影等效果，离屏混合更安全。

---

## 21. 当前项目中值得注意的问题与优化建议

### 21.1 组件命名不一致

存在两个命名问题：

| 文件 | 当前导出名 | 建议导出名 |
|---|---|---|
| `TextReflectionView.ets` | `TextRefectionView` | `TextReflectionView` |
| `TextMarqueeView.ets` | `TextGradientView` | `TextMarqueeView` |

虽然默认导出不一定影响运行，但不利于维护。

建议修改：

```ts
// TextReflectionView.ets
export default struct TextReflectionView {
```

```ts
// TextMarqueeView.ets
export default struct TextMarqueeView {
```

### 21.2 资源名拼写错误

当前资源名：

```text
text_refection_height
```

建议改为：

```text
text_reflection_height
```

同步修改代码：

```ts
.height($r('app.float.text_reflection_height'))
```

### 21.3 `Index.ets` 中 `value` 状态未使用

当前代码：

```ts
@State value: number = 0;
```

在 `Index.ets` 中没有实际用途，可以删除，避免误导。

### 21.4 `TextMarqueeView` 中宽度使用字符串资源不太合适

当前代码：

```ts
.width($r('app.string.ninety_percent'))
```

虽然可以表达 `90%`，但从语义上说，宽度属于尺寸，不属于普通字符串。更规范的做法是放入 `float.json` 或直接使用常量。

可以考虑：

```ts
.width('90%')
```

或者新增常量：

```ts
static readonly NINETY_PERCENT: string = '90%';
```

然后写：

```ts
.width(Constants.NINETY_PERCENT)
```

### 21.5 `.hvigor` 和 `.idea` 一般不建议提交到普通源码包

当前压缩包里包含：

```text
.hvigor/
.idea/
entry/.preview/
```

这些一般是构建缓存和 IDE 配置。正式上传 GitHub 时，可以考虑在 `.gitignore` 中忽略它们，保持项目干净。

建议忽略：

```gitignore
.hvigor/
.idea/
entry/.preview/
**/build/
**/.preview/
```

具体是否忽略要结合 DevEco 工程要求和团队规范决定。

---

## 22. 如果要修改页面标题或文字内容，应该改哪里？

如果要修改顶部标题“文字特效合集”：

```text
entry/src/main/resources/zh_CN/element/string.json
  └── title
```

如果要修改每个模块标题：

```text
text_gradient
text_scrolling
text_reflection
text_marquee
```

如果要修改示例文字：

```text
text_content
text_content_long
```

不要直接在 `Index.ets` 里写死中文文本，推荐继续使用资源文件，这样方便多语言适配。

---

## 23. 如果要新增一个文字特效，应该怎么做？

假设要新增一个“文字阴影效果”，推荐步骤如下。

### 第一步：新增组件文件

在目录中新增：

```text
entry/src/main/ets/view/TextShadowView.ets
```

示例结构：

```ts
@Component
export default struct TextShadowView {
  @State message: ResourceStr = '';

  build() {
    Text(this.message)
      .fontSize($r('app.float.content_font_size'))
      .fontWeight(FontWeight.Bold)
      .fontColor(Color.Black)
      .shadow({
        radius: 8,
        color: Color.Gray,
        offsetX: 4,
        offsetY: 4
      })
  }
}
```

### 第二步：在 `Index.ets` 中导入

```ts
import TextShadowView from '../view/TextShadowView';
```

### 第三步：新增标题资源

在 `string.json` 中添加：

```json
{
  "name": "text_shadow",
  "value": "文字阴影效果"
}
```

英文资源中也添加：

```json
{
  "name": "text_shadow",
  "value": "Text shadow effect."
}
```

### 第四步：在 `Index.ets` 的 `build()` 中加入展示区域

```ts
this.textBuilder($r('app.string.text_shadow'))
Row() {
  TextShadowView({ message: this.message })
}
.fancy()
.justifyContent(FlexAlign.Center)
```

新增后的关系：

```text
Index.ets
  ├── 原四个组件
  └── TextShadowView.ets
        └── string.json / float.json
```

---

## 24. 如果要调试这个项目，重点看哪些文件？

### 24.1 页面不显示

重点检查：

```text
entry/src/main/ets/entryability/EntryAbility.ets
entry/src/main/resources/base/profile/main_pages.json
entry/src/main/ets/pages/Index.ets
```

检查：

1. `loadContent('pages/Index')` 路径是否正确。
2. `main_pages.json` 是否包含 `pages/Index`。
3. `Index.ets` 是否存在语法错误。

### 24.2 应用图标或名称不对

重点检查：

```text
entry/src/main/module.json5
entry/src/main/resources/base/media/
entry/src/main/resources/*/element/string.json
```

### 24.3 某个文字特效不显示

重点检查对应组件：

| 效果 | 检查文件 |
|---|---|
| 文字渐变 | `TextGradientView.ets` |
| 歌词滚动 | `TextScrollingView.ets` |
| 文字倒影 | `TextReflectionView.ets` |
| 跑马灯渐变 | `TextMarqueeView.ets` |

还要检查：

```text
Index.ets 是否正确导入
Index.ets 是否正确调用
资源文件是否有缺失
```

### 24.4 资源报错

如果 DevEco 提示资源找不到，例如：

```text
app.float.xxx not found
app.string.xxx not found
app.color.xxx not found
```

检查：

```text
entry/src/main/resources/base/element/color.json
entry/src/main/resources/base/element/float.json
entry/src/main/resources/base/element/string.json
entry/src/main/resources/zh_CN/element/string.json
entry/src/main/resources/en_US/element/string.json
```

---

## 25. 开发者视角下的代码分层总结

这个项目采用的是非常典型的 HarmonyOS 示例工程分层：

```text
应用级配置层
├── AppScope/
├── build-profile.json5
├── oh-package.json5
└── hvigorfile.ts

模块配置层
├── entry/build-profile.json5
├── entry/oh-package.json5
├── entry/hvigorfile.ts
└── entry/src/main/module.json5

Ability 入口层
└── entry/src/main/ets/entryability/EntryAbility.ets

页面组织层
└── entry/src/main/ets/pages/Index.ets

功能组件层
├── TextGradientView.ets
├── TextScrollingView.ets
├── TextReflectionView.ets
└── TextMarqueeView.ets

公共配置层
├── Constants.ets
└── resources/
```

这种分层的优点是：

1. 入口逻辑和页面 UI 分离。
2. 页面布局和具体特效组件分离。
3. 组件之间互不干扰。
4. 样式资源集中管理。
5. 多语言支持清晰。
6. 后续新增特效比较方便。

---

## 26. 总结

该项目的核心并不复杂，可以用一句话概括：

```text
EntryAbility 加载 Index 页面，Index 页面组合四个独立文字特效组件，组件通过 Text、linearGradient、blendMode、rotate、animateTo、textOverflow 等 ArkUI 能力实现不同视觉效果。
```

最重要的文件是：

```text
entry/src/main/ets/entryability/EntryAbility.ets
entry/src/main/ets/pages/Index.ets
entry/src/main/ets/view/TextGradientView.ets
entry/src/main/ets/view/TextScrollingView.ets
entry/src/main/ets/view/TextReflectionView.ets
entry/src/main/ets/view/TextMarqueeView.ets
entry/src/main/ets/constants/Constants.ets
entry/src/main/resources/base/element/color.json
entry/src/main/resources/base/element/float.json
entry/src/main/resources/base/element/string.json
```

其中，最核心的运行链路是：

```text
module.json5
  → EntryAbility.ets
  → pages/Index
  → Index.ets
  → 四个 view 组件
  → resources 与 Constants
```

如果你要继续开发这个项目，建议优先掌握：

1. `EntryAbility.ets` 如何加载页面。
2. `Index.ets` 如何组织页面结构。
3. `$r()` 如何引用资源。
4. `@Component` 和 `@State` 如何传递数据。
5. `linearGradient + blendMode` 如何实现文字特效。
6. 每个 view 组件如何保持单一职责。

---

## 27. 推荐阅读顺序

为了快速理解该项目，建议按下面顺序读代码：

```text
1. README.md
2. build-profile.json5
3. entry/src/main/module.json5
4. entry/src/main/ets/entryability/EntryAbility.ets
5. entry/src/main/resources/base/profile/main_pages.json
6. entry/src/main/ets/pages/Index.ets
7. entry/src/main/ets/constants/Constants.ets
8. entry/src/main/ets/view/TextGradientView.ets
9. entry/src/main/ets/view/TextScrollingView.ets
10. entry/src/main/ets/view/TextReflectionView.ets
11. entry/src/main/ets/view/TextMarqueeView.ets
12. entry/src/main/resources/base/element/*.json
13. entry/src/main/resources/zh_CN/element/string.json
14. entry/src/main/resources/en_US/element/string.json
```

这样可以从“项目整体”逐步进入“入口逻辑”“页面组织”“具体组件”“资源配置”。
