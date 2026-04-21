# 鸿蒙应用文件结构解析

## 项目整体结构
entry/src/main/ets/
├── entryability/ # 应用入口能力
│ └── EntryAbility.ets # 主Ability入口文件
├── pages/ # 页面组件目录
│ ├── Index.ets # 首页组件
│ └── Second.ets # 二级页面组件
├── components/ # 公共组件目录
│ └── CustomComponent.ets # 自定义复用组件
├── utils/ # 工具类目录
│ └── Logger.ets # 日志工具类
└── resources/ # 资源文件目录
├── base/
│ ├── element/ # 字符串/颜色资源
│ └── media/ # 图片/图标资源
└── rawfile/ # 原始资源文件





## 核心文件解析

### 1. 应用入口文件 (`EntryAbility.ets`)
```typescript
// 应用主入口，管理应用生命周期
export default class EntryAbility extends Ability {
  onCreate(want, launchParam) {
    // 应用初始化逻辑
  }
  
  onWindowStageCreate(windowStage) {
    // 主窗口创建，加载首页
    windowStage.loadContent('pages/Index', (err) => {})
  }
}
```
功能：应用启动入口，管理整个应用生命周期
关联：调用pages/Index作为首个页面

### 2. 页面组件 (pages/Index.ets)
@Entry
@Component
struct Index {
  build() {
    Column() {
      Text('首页').fontSize(30)
      Navigator({ target: 'pages/Second' }) {
        Button('跳转到第二页')
      }
    }
  }
}
功能：应用首页UI布局和交互
关联：
使用@Entry声明为入口页面
通过Navigator跳转到Second.ets


### 3. 配置文件 (module.json5)
{
  "module": {
    "name": "entry",
    "mainAbility": ".EntryAbility",
    "abilities": [{
      "name": ".EntryAbility",
      "srcEntrance": "./ets/entryability/EntryAbility.ets",
      "launchType": "standard"
    }]
  }
}
功能：模块配置信息，定义Ability入口
关键字段：
mainAbility：指定主入口为EntryAbility
srcEntrance：指向Ability实现文件路径


### 4. 资源文件 (resources/base/element/string.json)
{
  "string": [{
    "name": "app_name",
    "value": "我的鸿蒙应用"
  }]
}
功能：存储文本、颜色等静态资源
调用方式：$r('app.string.app_name')


### 5. 自定义组件 (components/CustomComponent.ets)
@Component
export struct CustomButton {
  @Prop label: string = ''
  
  build() {
    Button(this.label)
      .width(120)
      .height(40)
  }
}
功能：封装可复用UI组件
使用场景：
// 在页面中调用
import { CustomButton } from '../components/CustomComponent'

@Component
struct MyPage {
  build() {
    Column() {
      CustomButton({ label: '确认' })
    }
  }
}



## 文件间协作关系


### 启动流程 1
graph LR
  A[module.json5] -->|声明主Ability| B(EntryAbility.ets)
  B -->|加载首个页面| C(Index.ets)
  C -->|用户交互触发| D(Second.ets)

### 资源调用链
页面组件 → 资源文件
      ↑       ↓
自定义组件 → 工具类

### 关键交互
页面导航：通过router或Navigator组件实现页面跳转
数据传递：使用@Prop/@Link装饰器实现组件间通信
资源引用：通过$r()全局方法访问资源文件
能力扩展：在module.json5中声明新Ability