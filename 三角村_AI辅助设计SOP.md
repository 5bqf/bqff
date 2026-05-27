# AI 辅助设计 SOP：全流程自动化工作手册

> 文档版本：1.0 | 更新日期：2026-05-28 | 适用：建筑/景观/规划设计方案阶段
> 
> 基于三角村·邻里汇项目实践验证

---

## 一、核心AI工具定位与配置

### 1.1 工具选择矩阵

| 任务类型 | 首选工具 | 次选工具 | 关键方法 |
|---------|---------|---------|---------|
| 直接控制软件界面 (CAD/PS/SU) | Codex桌面版 | Claude桌面版(macOS) | Computer Use |
| 生成&执行脚本 (.jsx/.rb/.scr) | Codex(VSCode/桌面) | Claude(桌面/MCP) | 脚本生成+手动运行 |
| 深度集成建模 (SU参数化) | Claude + MCP服务器 | Codex + Ruby控制台 | 结构化API调用 |
| 批量图片处理 (PS彩平/效果图) | Codex + .jsx脚本 | PS原生AI助手 | 脚本批处理 |

### 1.2 环境配置清单

- Codex桌面版：开启"Computer Use"权限（系统设置→隐私与安全性）
- VSCode扩展：安装Continue/Cursor等Codex集成插件
- Claude桌面版(macOS)：开启屏幕录制权限
- SU MCP服务器：安装su_mcp.rb插件到SketchUp
- CAD桥接：安装Python pyautocad库

---

## 二、CAD阶段：底图生成与处理

### 2.1 交互式控制（快速出图）

指令模板：
```
在AutoCAD中：
1. 新建文件，设置单位为米
2. 创建图层：道路(红色)、建筑(蓝色)、绿化(绿色)
3. 绘制一个100x80米的矩形作为用地红线
4. 内部绘制宽度6米的主环路
5. 在中心绘制20x15米的矩形建筑轮廓
6. 保存为[文件名].dwg
```
工具：Codex桌面版 Computer Use

### 2.2 脚本自动化（批量/精确）

生成.scr脚本：
```scr
;; 由Codex生成的AutoCAD脚本
-LAYER M 道路 C 1
-LAYER M 建筑 C 5
-LINE 0,0 100,0 100,80 0,80 C
PLINE w 0 6 ...(道路坐标)
```

生成Python控制脚本：
```python
# Codex生成，通过pyautocad控制
import pythoncom
import win32com.client
acad = win32com.client.Dispatch("AutoCAD.Application")
doc = acad.ActiveDocument
# 绘制命令...
```

---

## 三、SketchUp阶段：模型生成

### 3.1 Claude MCP服务器工作流（推荐）

配置步骤：
1. 下载su_mcp.rb插件至SU插件目录
2. 重启SU，扩展中启用"SU MCP Server"
3. 配置Claude连接服务器
4. 通过自然语言控制SU

指令示例：
```
通过MCP执行：
1. 导入'场地底图.dwg'
2. 将图层'建筑'的所有闭合多段线推拉12米
3. 为每个体块创建组件，命名格式'建筑_001'
4. 在组件上开窗，窗墙比0.3
5. 导出为'模型.skp'
```

### 3.2 Ruby脚本生成（可复用）

生成参数化构件脚本：
```ruby
# Codex/Claude生成的SU Ruby脚本
def create_pavilion(length, width, height)
  model = Sketchup.active_model
  entities = model.entities
  
  # 创建基座
  points = [
    [0,0,0], [length,0,0],
    [length,width,0], [0,width,0]
  ]
  face = entities.add_face(points)
  face.pushpull(height)
  
  # 参数化柱网
  columns_x = (length/5).ceil
  columns_y = (width/5).ceil
  # ...更多代码
end
```

---

## 四、Photoshop阶段：图纸后期

### 4.1 Computer Use直接控制（创意处理）

指令模板：
```
在Photoshop中：
1. 打开'渲染图.jpg'
2. 复制背景层，应用Camera Raw滤镜：
   - 曝光+0.3
   - 对比度+15
   - 高光-20
   - 阴影+10
3. 新建图层，用柔光混合模式添加暖色渐变
4. 添加配景人图层（从'人物.psd'拖入）
5. 保存为PSD和JPG（质量90%）
```

### 4.2 .jsx脚本批处理（生产流程）

生成批量处理脚本：
```javascript
// Codex生成的PS .jsx脚本
var inputFolder = Folder.selectDialog("选择输入文件夹");
var outputFolder = Folder.selectDialog("选择输出文件夹");
var files = inputFolder.getFiles("*.jpg");

for(var i=0; i<files.length; i++){
  var doc = app.open(files[i]);
  doc.resizeImage(undefined, undefined, 300); // 300DPI
  
  // 统一调色
  var levels = new LevelsAdjustment();
  levels.inputRange = [0, 1.2, 255];
  doc.activeLayer.levels = levels;
  
  // 保存
  var saveFile = new File(outputFolder + "/processed_" + files[i].name);
  doc.saveAs(saveFile, new JPEGSaveOptions(), true, Extension.LOWERCASE);
  doc.close();
}
```

---

## 五、端到端工作流示例：公园设计

### 5.1 第一阶段：CAD底图（Codex控制）
```
在AutoCAD中创建1:500公园总平面：
- 用地范围：200x150米
- 主入口道路宽8米
- 中心湖区轮廓（自由曲线）
- 功能区：儿童活动区、休闲草坪、林下广场
- 标注主要尺寸和标高
- 导出为'公园底图.dwg'和'公园底图.jpg'
```

### 5.2 第二阶段：SU模型（Claude控制）
```
通过MCP在SketchUp中：
1. 导入'公园底图.dwg'
2. 将湖区下挖1.5米，边坡1:3
3. 创建微地形，最高点+3米
4. 布置树木组件（乔木、灌木不同）
5. 添加景观小品（座椅、灯具）
6. 设置日光研究阴影
7. 导出立面视角和鸟瞰图
```

### 5.3 第三阶段：PS出图（Codex控制）
```
执行PS批处理脚本：
1. 对'鸟瞰图.jpg' '立面图1.jpg' '立面图2.jpg'统一：
   - 调整为A2尺寸（420x594mm，300DPI）
   - 应用智能锐化（数量80%，半径1.2）
   - 添加设计单位水印（右下角）
2. 单独处理彩平图：
   - 打开'公园底图.jpg'
   - 分区填色（水体#4A90E2，绿地#8BC34A）
   - 添加纹理叠加（不透明度30%）
   - 放置图例和比例尺
3. 所有成果图保存至'成果图'文件夹
```

---

## 六、提示词工程指南

### 6.1 有效指令结构

1. 环境状态：明确当前软件和文件状态
2. 动作分解：用数字序号分解步骤
3. 参数具体：提供精确数值和选项
4. 输出指定：格式、路径、命名规则

### 6.2 避免的模糊表述

| 模糊指令 | 精确替代 |
|---------|---------|
| "做个好看的设计" | "将饱和度提高15%，对比度提高10%" |
| "优化一下图片" | "锐化80%，半径1.2px" |
| "建个大概的模型" | "创建长宽高20x10x3米的体块，窗间距3米" |
| "填个绿色" | "填充#8BC34A，叠加草地纹理50%" |

---

## 七、质量控制与验证清单

### 7.1 每次AI操作后检查

- [ ] 尺寸精度（CAD尺寸标注，SU模型尺度）
- [ ] 图层/组件组织（命名规范，逻辑清晰）
- [ ] 文件链接（贴图、参照文件路径正确）
- [ ] 输出格式（分辨率、色彩模式、文件大小）

### 7.2 每周工作流优化

1. 常用脚本库：将验证过的.jsx/.rb/.scr脚本分类存档
2. 指令模板库：保存高效可复用的自然语言指令
3. 错误日志：记录AI执行失败案例及解决方案
4. 效率评估：对比AI处理vs手动处理的时间成本

---

## 八、风险提示与边界认知

### 8.1 AI能做的（高效执行）

- 重复性绘图操作
- 参数化模型生成
- 批量图片处理
- 设计数据整理与分析
- 格式转换与输出

### 8.2 AI不能做的（需人工介入）

- 核心设计创意与概念生成
- 规范审查（消防、无障碍等）
- 结构合理性判断
- 审美决策与艺术表达
- 最终质量审核与签字确认

### 8.3 故障恢复流程

1. 立即回滚：AI操作前必须保存版本或创建备份
2. 分步验证：复杂任务分解为小步骤，每步验证
3. 人工复核：关键节点必须人工检查
4. 反馈优化：将AI错误反馈给系统，优化后续指令

---

> **使用原则**：AI是"超级助手"而非"替代设计师"。核心是将设计师从重复劳动解放，聚焦于创意、决策与质量把控。所有AI产出必须经过专业人员审核确认。
