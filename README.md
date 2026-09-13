# Three.js 智慧工厂可视化 Demo

个人作品：基于 **Three.js / WebGL** 的三维可视化小场景，用于展示三维场景搭建、交互控制与 **InstancedMesh 渲染优化** 能力。

适合放进简历 / 作品集：可直接本地运行，也可部署到 GitHub Pages。

---

## 亮点（可写进简历）

1. **场景与交互**：工厂主体、储罐环、管线、控制楼、状态标记；OrbitControls 旋转/平移/缩放。
2. **渲染优化实践**：同一场景在 `InstancedMesh` 与「独立 Mesh」之间一键切换，实时对比 **FPS / Draw Calls / 三角面**。
3. **动态可视化**：粒子流场、脉冲扩散环、信标呼吸灯，体现动画循环与材质参数控制。
4. **工程结构**：源码 ES Modules 分层（`js/scene|factory|particles|main`）；已打包为 `dist/app.js`（IIFE），**不依赖 CDN / import map**，本地可直接跑。

---

## 快速开始（二选一）

### 推荐 A：双击 `启动Demo.bat`

会自动打开浏览器 → <http://127.0.0.1:5173>  
（依赖本机 Python 3 起静态服务。）

### 推荐 B：直接打开单文件

双击 **`standalone.html`**  
（CSS + JS 已全部内联，最适合演示。）

### 命令行

```bash
cd "E:\简历v\Three.js 或 Cesium 小 demo"
python -m http.server 5173 --bind 127.0.0.1
# 浏览器打开 http://127.0.0.1:5173/
```

> 不要使用旧的 `type="module"` 方式；当前入口加载的是打包后的 `dist/app.js`。  
> 若改了 `js/` 源码，需重新执行打包脚本生成 `dist/app.js`（或改回维护源码工程）。

---

## 操作说明

| 操作 | 说明 |
|------|------|
| 左键拖拽 | 旋转镜头 |
| 右键拖拽 | 平移 |
| 滚轮 | 缩放 |
| 渲染模式 | 切换 InstancedMesh / 独立 Mesh |
| 实例数量 | 200–5000，实时重建 |
| 粒子流 | 开关粒子动画 |

---

## 目录结构

```text
Three.js 或 Cesium 小 demo/
├── index.html          # 网页入口（加载 dist/app.js）
├── standalone.html     # 单文件版，可双击直接看
├── 启动Demo.bat        # 一键启动本地服务
├── package.json
├── README.md
├── dist/app.js         # 打包后的完整脚本（Three.js 已内联）
├── vendor/             # 源码依赖（three + OrbitControls）
├── css/style.css
└── js/                 # 源码（与 dist 对应）
    ├── main.js
    ├── scene.js
    ├── factory.js
    └── particles.js
```

---

## 简历写法参考

> **Three.js 智慧工厂可视化（个人项目）**  
> - 使用 Three.js 搭建工业场景：储罐、管线、控制楼、粒子流与动态状态标记；  
> - 实现 InstancedMesh 与独立 Mesh 双模式渲染对比，上千实例下显著降低 Draw Calls，验证批处理渲染优化；  
> - 提供交互镜头、参数调节与实时 FPS/Draw Call 面板，体现可视化性能意识与前端工程化能力。

---

## 后续可扩展（面试加分）

- 加入 EffectComposer（Bloom）做后处理  
- 用 `Raycaster` 做储罐点击高亮与属性面板  
- 接入实时数据（WebSocket）驱动颜色/高度  
- 迁移到 React Three Fiber，或用 Cesium 做地球/倾斜摄影版本

---

## License

MIT
