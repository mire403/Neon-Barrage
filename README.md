# NEON BARRAGE·AI弹幕生成赛博生存战

<div align="center">
  <img src="https://github.com/mire403/Neon-Barrage/blob/main/%E4%B8%BB%E9%A1%B5.png">
</div>
<div align="center">游戏主页</div>


## 🚀 About / 关于本项目

**Neon Barrage·AI弹幕生成赛博生存战**是一个融合

**🟢 AI弹幕生成算法**

**🟢 赛博朋克界面设计**

**🟢 实时交互生存玩法**

的网页游戏。

你可以通过输入不同关键字（示例如赛博风暴/冰霜新星/矩阵代码）来由AI生成不同的**弹幕生成器（Emitter）**，每个弹幕模式都由一组 **PatternConfig**定义，包括：

🔸 弹幕发射器类型（ring / spiral / spread / aimed / random…）

🔸 发射频率、数量

🔸 子弹形状（circle / diamond / star / rect）

🔸 初始角度、自旋角速度

🔸 颜色、尺寸、速度、偏差

🔸 生命周期、延迟启动等高级控制

**💡 本游戏的弹幕不是脚本写死，而是完全由配置数据驱动的可扩展系统！**

<div align="center">
  <img src="https://github.com/mire403/Neon-Barrage/blob/main/picture/%E5%BC%80%E5%A7%8B%E6%B8%B8%E6%88%8F.png">
</div>
<div align="center">生成弹幕图</div>

## 🧬 Core Features // 核心特性

### 🎯 AI 弹幕生成系统（配置驱动）

由**PatternConfig → EmitterConfig → Bullet**三层结构构建。

可轻松扩展上百种 AI 弹幕模式。

### 🕹️ 赛博朋克互动 UI

仿终端界面、噪点贴图、警告条、扫描线、亮色 HUD。

### ⚡ 高性能渲染

React + Canvas

优化后的弹幕更新循环

支持数百枚子弹同时流畅运动。

### 🎮 玩家动作系统

WASD：移动

SHIFT：专注模式（减速）

X：闪避冲刺

带 HUD 动态条（HYPER.DRIVE ⚡）

<div align="center">
  <img src="https://github.com/mire403/Neon-Barrage/blob/main/picture/%E5%8A%A0%E9%80%9F.jpg">
</div>
<div align="center">闪避冲刺展示图</div>

<div align="center">
  <img src="https://github.com/mire403/Neon-Barrage/blob/main/picture/%E6%B8%B8%E6%88%8F%E5%A4%B1%E8%B4%A5.png">
</div>
<div align="center">游戏失败界面</div>

## 🏗️ Tech Stack / 技术栈

### Frontend 前端

TypeScript

React

Vite

Canvas 实时渲染

### Game Engine 核心模块

```ts
Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Lunatic'
EmitterConfig { type, frequency, bulletCount, speed, angleOffset ... }
PatternConfig { name, difficulty, emitters }
Bullet { x, y, vx, vy, size, rotation, rotationSpeed }
GameState { fps, score, dashCooldown }
```

### UI / Visuals

Cyberpunk HUD

CRT Noise + Scanline Layer

Neon Vector Rendering

Terminal Command Panel

## 🧩 How It Works / 工作原理

<div align="center">
  <img src="https://github.com/mire403/Neon-Barrage/blob/main/picture/%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.png">
</div>
<div align="center">可在游戏界面的左下角点击操作手册查看操作步骤</div>

### 🚀 1. 输入命令

玩家在左侧输入：

如 “赛博风暴 / 太陽耀斑 / 矩阵代码…………”

### ⚙️ 2. 匹配 PatternConfig

程序从配置库中取出相应模式。

### 🔥 3. 初始化 Emitters

多个发射器产生不同角度、速度、轨迹的子弹。

### 💥 4. 渲染到主场景

实时 Canvas 绘制，带尾迹、旋转、闪光特效。

## 🧱 Project Structure / 目录结构

```bash
/src
 ├── patterns/         # 弹幕模式库 PatternConfig
 ├── emitters/         # 各类发射器 EmitterType
 ├── components/       # UI 组件（面板 / HUD）
 ├── game/             # 游戏主循环与物体管理
 └── assets/           # 材质、噪点、字体
```

## ❤️ Made by Haoze Zheng

右侧 UI 的 “MADE BY HAOZE ZHENG” 已成为游戏标志性视觉元素。

## ⭐ Star Support

如果你觉得这个项目对你有帮助，请给仓库点一个 ⭐ Star！
你的鼓励是我继续优化此项目的最大动力 😊
