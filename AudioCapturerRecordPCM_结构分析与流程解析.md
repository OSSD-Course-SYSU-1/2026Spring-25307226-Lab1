# AudioCapturerRecordPCM 应用结构分析与流程解析

## 1. 项目概述

该项目是一个基于 **HarmonyOS + ArkTS** 的音频录制示例程序，核心目标是：

- 申请麦克风权限；
- 使用 `AudioCapturer` 采集 PCM 原始音频流；
- 将采集到的数据持续写入本地文件；
- 在首页读取本地录音文件列表；
- 使用 `AudioRenderer` 对 PCM 文件进行播放；
- 支持录音、暂停播放、删除录音，以及录音时后台连续任务保活。

从工程性质上看，它更像一个 **官方示例型项目**，重点在于演示音频采集与播放 API 的基本使用方式，而不是一个完整的商用录音 App。因此，代码结构较清晰，但在“多文件播放管理”“文件命名策略”“异常处理完整性”等方面仍保留了示例工程的简化特征。

---

## 2. 项目整体结构

项目主体位于：

```text
entry/src/main/ets/
```

主要目录如下：

```text
entry/src/main/ets/
├── common/
│   └── Constants.ets                  # 常量定义，如权限名
├── components/
│   └── RecordDialog.ets               # 录音弹窗组件
├── controller/
│   ├── AudioCapturerController.ets    # 音频采集控制器
│   └── AudioRendererController.ets    # 音频播放控制器
├── entryability/
│   └── EntryAbility.ets               # 应用入口 Ability
├── entrybackupability/
│   └── EntryBackupAbility.ets         # 备份扩展能力
├── model/
│   └── RecordFileInfo.ets             # 录音文件数据模型
├── pages/
│   └── Index.ets                      # 首页 / 主页面
└── utils/
    ├── BackgroundTaskUtil.ets         # 后台连续任务工具
    ├── Logger.ets                     # 日志工具
    ├── PermissionUtil.ets             # 权限检查与申请
    └── StringUtil.ets                 # 时间/字符串格式化工具
```

除此之外，还有以下关键配置与资源目录：

```text
entry/src/main/module.json5            # 模块配置，声明 Ability、权限、后台模式
entry/src/main/resources/              # 图片、颜色、字符串、多语言资源
AppScope/app.json5                     # 应用级配置
build-profile.json5                    # 工程构建配置
```

---

## 3. 分层理解：这个项目是怎么拆分的

从职责划分来看，这个项目可以分成 5 层：

### 3.1 入口层
由 `EntryAbility.ets` 和 `module.json5` 组成。

职责：
- 声明应用入口；
- 创建主窗口；
- 加载首页 `pages/Index`；
- 配置窗口显示方式和运行模式。

### 3.2 页面层
由 `pages/Index.ets` 组成。

职责：
- 展示页面 UI；
- 管理录音文件列表；
- 控制录音弹窗显示与隐藏；
- 响应播放、暂停、删除等用户交互；
- 串联权限、文件扫描、播放器控制等逻辑。

### 3.3 组件层
由 `components/RecordDialog.ets` 组成。

职责：
- 封装录音中的弹窗界面；
- 展示录音计时；
- 在页面打开时启动录音；
- 在点击停止时结束录音并释放资源。

### 3.4 控制层
由两个 controller 组成：

- `AudioCapturerController.ets`：负责录音采集；
- `AudioRendererController.ets`：负责音频播放。

职责：
- 与 HarmonyOS 音频框架 API 直接交互；
- 隐藏底层音频状态机细节；
- 对外提供 `init / start / stop / release` 这类可调用接口。

### 3.5 工具与模型层
包括：
- `RecordFileInfo.ets`
- `PermissionUtil.ets`
- `BackgroundTaskUtil.ets`
- `StringUtil.ets`
- `Logger.ets`
- `Constants.ets`

职责：
- 提供数据模型；
- 提供权限申请与后台任务工具；
- 提供日志与格式化能力；
- 避免页面层和控制层出现重复代码。

---

## 4. 启动链路分析

### 4.1 配置入口：`module.json5`

该文件是整个 entry 模块的运行声明中心，关键内容如下：

- `mainElement: "EntryAbility"`：指定主入口 Ability；
- `srcEntry: "./ets/entryability/EntryAbility.ets"`：指向入口实现文件；
- `pages: "$profile:main_pages"`：声明页面配置；
- `backgroundModes: ["audioRecording"]`：允许应用在录音场景下进行后台运行；
- `requestPermissions`：声明麦克风和后台长时任务权限。

这一层决定了：**应用能否启动、能否使用麦克风、能否在录音过程中后台保活。**

### 4.2 Ability 入口：`EntryAbility.ets`

`EntryAbility` 是应用启动后的第一个运行单元。它主要做了几件事：

1. 在 `onCreate()` 中设置应用颜色模式；
2. 在 `onWindowStageCreate()` 中加载首页 `pages/Index`；
3. 获取主窗口并设置全屏布局；
4. 在生命周期回调中记录日志，便于调试。

这里的核心逻辑是：

```text
应用启动
  → EntryAbility 创建
  → 创建 WindowStage
  → loadContent('pages/Index')
  → 首页渲染
```

### 4.3 页面入口：`main_pages.json`

该文件非常简单：

```json
{
  "src": [
    "pages/Index"
  ]
}
```

它说明：应用 UI 的首页是 `Index.ets`。

---

## 5. 首页 `Index.ets` 结构分析

`Index.ets` 是整个应用的业务中枢，既负责页面展示，也负责串联录音、播放、删除、权限、文件扫描等逻辑。

### 5.1 状态变量分析

该页面中最关键的状态包括：

- `@State isPlay`：当前是否正在播放；
- `@State isRecord`：录音弹窗是否显示；
- `@State recordFiles`：录音文件列表；
- `@StorageLink('CurrentTime') currentTime`：播放进度，与 `AppStorage` 联动；
- `audioRendererController`：播放控制器实例；
- `context`：宿主上下文，用于获取文件目录等；
- `timeout`：用于播放按钮防抖。

这些状态组合起来，形成了页面的两个核心工作区：

1. **录音列表区**：展示本地 PCM 文件；
2. **底部录音按钮区**：打开录音弹窗。

### 5.2 生命周期逻辑

#### `aboutToAppear()`
页面出现时执行：

- 检查麦克风权限；
- 若未授权，则发起权限请求；
- 调用 `loadAudioFiles()` 扫描本地文件。

这说明首页承担了“初始化环境”的职责。

#### `aboutToDisappear()`
页面消失时执行：

- 调用 `playerRelease()`，释放播放相关资源。

#### `onPageHide()`
页面隐藏时执行：

- 若当前正在播放，则暂停播放，并将 `isPlay` 置为 `false`。

这一步是在做一个基本的生命周期保护，避免页面切入后台后仍持续播放。

### 5.3 文件扫描逻辑：`loadAudioFiles()`

该方法是首页数据刷新的关键。

执行过程如下：

1. 获取应用内部文件目录 `context.filesDir`；
2. 使用 `fs.listFileSync()` 列出目录中的文件；
3. 对每个文件执行 `statSync()` 获取修改时间和大小；
4. 将文件信息组装为 `RecordFileInfo[]`；
5. 按修改时间倒序排列；
6. 赋值给 `this.recordFiles`，驱动 UI 列表刷新；
7. 若存在文件且播放器未初始化，则初始化 `AudioRendererController`。

这里可以看到该应用采用的是最直接的数据来源方式：

- **不使用数据库**；
- **不维护额外的录音元数据文件**；
- 直接以文件系统作为真实数据源。

这对示例工程来说很合适，结构简单，但也有局限：

- 文件名、时长、格式等信息都没有独立管理；
- 文件与播放控制器之间的映射比较粗糙；
- 一旦以后要支持重命名、搜索、分类，就需要重新扩展数据层。

### 5.4 列表卡片显示逻辑

`listCard(info: RecordFileInfo)` 负责单个录音文件的展示，包括：

- 文件名；
- 修改时间；
- 根据文件大小换算出的“时长”；
- 当前播放进度条；
- 播放/暂停按钮。

这里有一个值得注意的设计点：

- 时间显示 `toTimeStr(info.size)` 并不是读取真实音频元数据；
- 而是根据 PCM 参数手工换算：
  - 采样率 48000
  - 单声道
  - 16 位（2 字节）

换算公式来自 `StringUtil.ets`：

```text
duration = size / (48000 × 2 × 1)
```

这意味着：**列表中的“时长”本质上是根据 PCM 文件体积估算出来的**，仅对当前这套采样参数成立。

### 5.5 删除逻辑

`deleteCard(index)` 中通过滑动操作触发删除：

1. 先调用 `playerRelease()` 停止播放；
2. 拼接文件路径；
3. 调用 `fs.unlinkSync(path)` 删除文件；
4. 从 `recordFiles` 数组中移除对应项；
5. UI 自动刷新。

这是一个典型的“先停播放，再删文件”的顺序，避免播放时删除文件造成资源竞争。

### 5.6 打开录音弹窗逻辑

底部圆形按钮点击后：

1. 调用 `playerRelease()`，停止当前播放；
2. 将 `isRecord = true`；
3. 通过 `bindSheet()` 绑定 `RecordDialog` 录音弹窗。

配置中还定义了：

- `detents: [SheetSize.MEDIUM]`：中等高度弹窗；
- `showClose: false`：不显示关闭按钮；
- `dragBar: false`：不显示拖拽条；
- `onDisappear`：弹窗消失后重新执行 `loadAudioFiles()`。

因此录音完成后的数据刷新方式是：

```text
关闭录音弹窗 → 触发 onDisappear → 重新扫描 filesDir → 刷新首页列表
```

---

## 6. 录音组件 `RecordDialog.ets` 分析

`RecordDialog` 是录音流程的执行面板，也是录音控制最集中的地方。

### 6.1 核心成员

- `@State timeStr`：页面上展示的录音时长；
- `@State isStop`：是否停止计时；
- `@Link isRecord`：与父页面绑定，控制弹窗显示；
- `recorderController`：`AudioCapturerController` 实例；
- `seconds`：当前累计秒数；
- `timer`：定时器句柄。

### 6.2 页面出现时的处理：`aboutToAppear()`

弹窗出现时执行以下逻辑：

1. 创建并初始化 `AudioCapturer`；
2. 初始化完成后调用 `startCapturer()` 开始录音；
3. 启动本地计时器，每秒刷新一次 `timeStr`；
4. 调用 `startContinuousTask()` 开启后台连续任务。

也就是说，**这个组件一旦被展示，就会立即开始录音。**

不存在“先显示弹窗，再按开始按钮”的中间状态；它的业务逻辑是“打开即录”。

### 6.3 计时逻辑：`getRecordTime()`

该方法通过 `setInterval()` 每秒执行一次：

- `seconds += 1`
- `timeStr = secToTimeStr(seconds)`

注意：

- 这个计时是前端 UI 计时；
- 它并不直接读取录音流的真实时间戳；
- 因而属于“界面时长显示”，而不是底层音频系统时间。

### 6.4 停止按钮逻辑

点击红色圆形停止按钮后：

1. `this.isRecord = false`，关闭弹窗；
2. 调用 `stopCapturer()` 停止录音；
3. 调用 `releaseCapturer()` 释放录音器；
4. 清除计时器；
5. 停止后台连续任务。

从职责角度看，这个组件本身完成了录音生命周期闭环：

```text
弹窗出现 → 初始化录音 → 开始录音 → 更新时间 → 点击停止 → 停止录音 → 释放资源 → 关闭弹窗
```

---

## 7. 录音控制器 `AudioCapturerController.ets` 分析

这是整个程序中最核心的底层模块之一，负责把“麦克风输入”变成“PCM 文件”。

### 7.1 成员变量职责

- `context`：获取应用私有文件目录；
- `tmpPath`：录音文件路径；
- `recordFile`：已打开的文件对象；
- `writeOffset`：当前写入偏移量；
- `capturer`：HarmonyOS 音频采集器实例。

### 7.2 初始化逻辑：`initCapturer()`

初始化时主要做了三类配置。

#### (1) 音频流格式配置 `AudioStreamInfo`

```text
channels      = 单声道 CHANNEL_1
samplingRate  = 48000 Hz
sampleFormat  = S16LE
encodingType  = RAW
```

这说明输出文件本质是：

- 单声道 PCM；
- 48k 采样率；
- 16-bit little-endian；
- 无封装头（不是 wav，而是裸 pcm）。

#### (2) 采集器来源配置 `AudioCapturerInfo`

```text
source = SOURCE_TYPE_VOICE_COMMUNICATION
```

说明它使用的是语音通信类音源，而不是普通媒体录音源。

#### (3) 创建 AudioCapturer 并注册回调

完成创建后，注册两个关键回调：

- `stateChange`：监听采集器状态变化；
- `readData`：当底层音频数据到达时，把 `ArrayBuffer` 写入文件。

`readData` 是核心中的核心，其逻辑为：

```text
收到 PCM buffer
  → 根据当前 writeOffset 写入文件
  → writeOffset += 本次 buffer 长度
```

这意味着录音文件是以“流式累加写入”的方式生成的，而不是先缓存所有音频再一次性落盘。

### 7.3 开始录音：`startCapturer()`

执行流程：

1. 检查 `capturer` 是否存在；
2. 检查状态是否合法（必须是 PREPARED 或 STOPPED）；
3. 生成录音文件路径：
   - `context.filesDir + '/example.pcm'`
4. 以“写入 + 创建 + 截断”的方式打开文件；
5. 重置写入偏移量；
6. 调用 `capturer.start()` 启动采集。

这里要特别指出一个非常重要的结构特征：

### 当前录音文件名是固定的 `example.pcm`

也就是说，每次录音都会覆盖上一次录音结果，而不是自动生成不同文件名。

这会直接带来两个影响：

1. 从“示例功能”角度，足以演示录音与播放；
2. 从“真实 App”角度，不支持保存多段录音历史。

虽然首页写了“文件列表”逻辑，但由于录音文件名固定，实际长期使用时通常只会保留一个最新文件，除非手动额外放入其它文件。

### 7.4 停止录音：`stopCapturer()`

逻辑非常直接：

- 若当前状态是 `RUNNING`，则调用 `capturer.stop()`；
- 然后关闭录音文件句柄。

### 7.5 释放录音器：`releaseCapturer()`

释放阶段会：

- 注销 `readData` 监听；
- 调用 `capturer.release()`；
- 将 `capturer` 置空。

这一步是必须的，因为音频设备资源通常不能无限持有。如果录音结束后不释放，下一轮重新进入录音页面时很容易出现状态异常或资源占用冲突。

---

## 8. 播放控制器 `AudioRendererController.ets` 分析

该控制器负责把本地 PCM 文件重新送入音频输出设备进行播放。

### 8.1 成员变量职责

- `playFile`：正在播放的文件对象；
- `fileSize`：当前文件总大小；
- `readOffset`：当前读取位置；
- `renderer`：AudioRenderer 实例。

### 8.2 初始化播放：`initRenderer(path)`

初始化流程与录音类似，也分为三部分：

#### (1) 配置播放音频流参数

参数与录音端保持一致：

- 单声道；
- 48k；
- S16LE；
- RAW PCM。

这是必须的，因为 PCM 没有自描述头信息，播放端必须与录音端使用同样的参数，否则声音会失真或无法正常播放。

#### (2) 创建 AudioRenderer 并注册回调

注册：

- `stateChange`：状态变化日志；
- `writeData`：播放系统请求数据时，从文件中读取对应字节填入 buffer。

这里的核心逻辑是：

```text
当系统请求播放数据
  → 计算还能读取多少字节
  → 从 playFile 按 readOffset 读入 buffer
  → 更新 readOffset
  → 写入 AppStorage.CurrentTime
  → 若到达文件末尾，则 readOffset 归零
```

这说明它使用的是 **边读文件边播放** 的流式输出模式。

#### (3) 打开指定文件

如果传入 `path`，则：

- 打开文件；
- 读取文件总大小；
- 把读取偏移量置 0。

### 8.3 开始播放：`startRenderer()`

在状态合法时调用 `renderer.start()` 即可开始播放。

允许的起始状态包括：

- `PREPARED`
- `STOPPED`
- `PAUSED`

### 8.4 暂停播放：`pauseRenderer()`

若当前处于 `RUNNING`，则调用 `renderer.pause()`。

### 8.5 停止/释放播放：`stopRenderer()`

该方法会：

- 若当前为 `RUNNING` 或 `PAUSED`，先调用 `stop()`；
- 关闭文件句柄；
- 调用 `renderer.release()`；
- 清理对象引用。

它既承担“停止”职责，也承担“彻底释放资源”职责。

---

## 9. 权限与后台任务机制

### 9.1 权限管理：`PermissionUtil.ets`

该工具主要负责两件事：

#### `checkPermission(permission)`
- 获取应用自身的 `accessTokenId`；
- 调用 `checkAccessToken()` 检查权限是否已授予。

#### `requestPermissions(context, permissions)`
- 调用 `requestPermissionsFromUser()` 向用户发起授权请求；
- 若用户拒绝，会写日志记录。

在首页中，实际检查的是：

```text
ohos.permission.MICROPHONE
```

也就是说，进入页面时会先确保录音最基本的权限可用。

### 9.2 后台连续任务：`BackgroundTaskUtil.ets`

录音过程中调用：

- `startContinuousTask(context)`
- `stopContinuousTask(context)`

其目的在于：

- 录音时申请后台连续运行能力；
- 录音结束后关闭该能力。

这与 `module.json5` 中配置的：

```json
"backgroundModes": ["audioRecording"]
```

共同组成了后台录音保活机制。

#### 需要注意的一点

`BackgroundTaskUtil.ets` 中的 `wantAgentInfo` 使用了：

- `bundleName: "com.sample.AudioCapturerRecordPCM"`
- `abilityName: "MainAbility"`

而实际模块入口 Ability 名称在 `module.json5` 中为 `EntryAbility`。

这意味着这里带有一定示例模板痕迹，若项目改包名或改 Ability 名称后没有同步调整，后台任务保活逻辑可能存在配置不一致的风险。

---

## 10. 工具模块分析

### 10.1 `StringUtil.ets`

该文件主要承担两个作用：

#### (1) 时间格式化
- `secToTimeStr(duration)`：秒数转 `HH:MM:SS`
- `toDateStr(mtime)`：文件修改时间转可读日期字符串

#### (2) PCM 文件大小与时长换算
- `toTimeStr(size)`
- `sizeToTime(size)`

换算依据固定为：

```text
时长(秒) = 文件字节数 / (采样率 48000 × 2字节 × 1声道)
```

因此它是建立在当前音频参数固定不变前提下的辅助函数。

### 10.2 `Logger.ets`

这是一个对 `hilog` 的轻量封装，提供：

- `debug`
- `info`
- `warn`
- `error`

作用是统一日志输出格式，方便在控制器、页面、工具类中复用。

### 10.3 `Constants.ets`

当前只定义了：

- `MICROPHONE_PERMISSION`

这说明常量层目前比较薄，后续如果项目扩展，可以继续把：

- 文件名模板
- 采样率
- 通道数
- 默认目录名
- 后台任务标识

等统一收敛到该文件中，减少硬编码。

---

## 11. 数据流与控制流解析

下面用几个关键场景说明整个 App 是如何运行的。

### 11.1 场景一：应用启动

```text
用户启动 App
  → EntryAbility.onCreate()
  → EntryAbility.onWindowStageCreate()
  → 加载 pages/Index
  → Index.aboutToAppear()
  → 检查麦克风权限
  → 扫描 filesDir 中的录音文件
  → 刷新页面列表
```

### 11.2 场景二：开始录音

```text
用户点击底部录音按钮
  → Index.playerRelease() 停止当前播放
  → isRecord = true
  → bindSheet 打开 RecordDialog
  → RecordDialog.aboutToAppear()
  → AudioCapturerController.initCapturer()
  → AudioCapturerController.startCapturer()
  → 创建/覆盖 example.pcm
  → AudioCapturer readData 回调持续写入 PCM 数据
  → 定时器每秒刷新录音时间
  → 开启后台连续任务
```

### 11.3 场景三：结束录音

```text
用户点击停止按钮
  → isRecord = false
  → stopCapturer()
  → releaseCapturer()
  → clearInterval(timer)
  → stopContinuousTask()
  → 弹窗关闭
  → Index.bindSheet.onDisappear()
  → loadAudioFiles()
  → 首页重新扫描目录
  → 新录音文件出现在列表中
```

### 11.4 场景四：播放录音

```text
用户点击播放按钮
  → Index.debounce()
  → AudioRendererController.startRenderer()
  → AudioRenderer writeData 回调触发
  → 从 PCM 文件按 readOffset 读数据
  → 写入播放 buffer
  → 更新 AppStorage.CurrentTime
  → 进度条实时变化
```

### 11.5 场景五：暂停播放

```text
用户再次点击播放按钮
  → AudioRendererController.pauseRenderer()
  → isPlay = false
```

### 11.6 场景六：删除录音

```text
用户左滑列表项并点击删除
  → Index.playerRelease()
  → fs.unlinkSync(目标文件)
  → recordFiles.splice(index, 1)
  → 页面刷新
```

---

## 12. 这个项目的关键设计特点

### 12.1 优点

#### (1) 结构清晰
页面、控制器、工具类、模型拆分较明确，适合作为二次开发起点。

#### (2) 音频链路完整
从录音到写文件，再到从文件读取播放，链路是完整闭环。

#### (3) 生命周期意识较好
页面隐藏、页面销毁、录音停止等节点都做了资源收尾处理。

#### (4) 使用本地文件系统作为数据源
实现简单直观，不依赖数据库，非常适合示例项目。

#### (5) 考虑了后台录音场景
通过后台连续任务和权限声明，使录音过程具备一定后台运行能力。

### 12.2 局限与风险

#### (1) 录音文件名固定
每次都写入 `example.pcm`，会覆盖旧录音，不适合真正的多段录音管理。

#### (2) 播放器与文件列表绑定不充分
首页虽然展示多个文件，但播放器初始化路径是固定的：

```text
filesDir + '/example.pcm'
```

这意味着当前代码更像“展示文件列表 + 实际播放默认文件”的示例状态，尚未真正实现“点哪一条就播放哪一条”。

#### (3) PCM 文件无封装头
输出是裸 PCM，不是 WAV/MP3/AAC；因此文件通用性较弱，离开本项目环境后可读性不强。

#### (4) 后台任务 WantAgent 配置可能与实际入口不完全一致
`BackgroundTaskUtil` 中的 `MainAbility` 与模块中声明的 `EntryAbility` 存在命名差异，需要上线前核实。

#### (5) 异常处理以日志输出为主
目前更多是打印错误，而不是给用户明确提示或回退机制。

---

## 13. 如果你后续要继续改造，这几个点最值得优先处理

### 13.1 改为动态文件命名
建议根据时间戳生成文件名，例如：

```text
record_20260421_153000.pcm
```

这样才能真正支持录音历史列表。

### 13.2 让列表项和播放器真正绑定
当前应改成：

- 用户点击某一项的播放按钮时；
- 重新初始化 `AudioRendererController`；
- 使用该条目对应的文件路径进行播放。

### 13.3 补充“播放结束”回调与 UI 状态复位
当前播放读到末尾后会将 `readOffset` 归零，但页面状态 `isPlay` 未必自动同步，建议补一个更明确的结束状态处理。

### 13.4 录音格式升级
如果后续需要更好的兼容性，可以考虑：

- PCM + WAV 头封装；
- AAC 编码；
- 保存采样参数元数据。

### 13.5 完善用户提示
例如：

- 权限被拒绝后的弹窗提示；
- 后台任务申请失败提示；
- 文件删除成功/失败提示；
- 录音启动失败提示。

---

## 14. 结论

这个项目的本质，是一个围绕 **HarmonyOS AudioCapturer / AudioRenderer** 搭建的 ArkTS 音频录制示例。它的整体结构并不复杂，但链路非常典型：

- **入口层** 负责启动页面；
- **页面层** 负责状态管理和交互组织；
- **录音控制器** 负责采集麦克风 PCM 流并写入文件；
- **播放控制器** 负责读取 PCM 文件并输出音频；
- **工具层** 负责权限、后台任务、日志和格式转换。

如果把它当作学习项目，它很适合用来理解 HarmonyOS 的音频 API 调用方式；
如果把它当作产品原型，它已经具备基础框架，但仍需要在“文件管理、播放绑定、异常处理、后台配置一致性”方面继续增强。

总体来说，这份代码最有价值的地方在于：**它已经把“录音 → 存储 → 列表展示 → 播放”这条主干链路搭起来了，后续优化主要是做产品化补全，而不是从零重写。**
