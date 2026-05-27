---
name: ai-app-builder
description: 基于 AssetCraft Studio 48h 竞赛 SOP，快速搭建 AI 驱动的 Gradio Web 应用。覆盖项目初始化→核心引擎→导出层→Web UI→测试→部署全流程。
---

# AI App Builder — 快速搭建 AI 驱动的 Web 应用

## 何时使用

用户输入包含以下关键词时触发：
- "创建/搭建/做一个 AI 工具/App/网站"
- "Gradio 应用"、"AI 生图/生成工具"
- "比赛/竞赛/48小时 项目"
- "按照 AssetCraft SOP 开发"

## 核心流程

### Step 1: 项目初始化

```bash
mkdir project-name && cd project-name && git init
```

创建文件清单：
- `config.py` — 环境变量驱动配置 + 常量定义
- `requirements.txt` — gradio, Pillow, numpy, requests, pytest
- `.env.example` — API Key 配置模板
- `.gitignore` — __pycache__, .env, venv, static/outputs

目录结构：
```
core/        # 业务逻辑层
exporters/   # 导出/输出层
tests/       # pytest 测试
static/      # 静态资源
```

### Step 2: 核心引擎

1. API 封装（`core/generator.py`）
   - 环境变量读取 API Key
   - REST API 调用 + 错误处理
   - GenerationResult dataclass 封装结果

2. 提示词引擎（`core/prompt_engine.py`）
   - 预置模板字典（至少 5 个）
   - `build(subject, template, style)` 参数化构建
   - 支持中英文

3. 风格管理（`core/style_manager.py`）
   - StyleProfile: 种子/尺寸/步数
   - 种子序列: 递增保证一致性

4. 缓存（`core/cache.py`）
   - MD5 键值 + 24h 过期
   - 命中时跳过 API 调用

### Step 3: 导出层

1. 基类（`exporters/base_exporter.py`）
   - export_sprite: 1x + 2x PNG
   - finalize: manifest.json + ZIP 打包

2. 目标导出器（各一个文件）
   - 覆写 `_build_metadata()` 和 `_write_engine_files()`

### Step 4: Gradio Web UI

```python
# app.py 骨架
def create_ui():
    with gr.Blocks(title="App Name") as app:
        with gr.Tabs():
            with gr.TabItem("Tab 1"):
                _build_tab("label")
    return app
```

关键模式：
- 可复用 `_build_tab()` 函数
- `gr.Progress()` 进度反馈
- 错误 try/except → 友好提示
- 高级面板用 `gr.Accordion`

### Step 5: 测试

```python
# tests/test_core.py
class TestGenerator:
    def test_api_call(self): ...      # @pytest.mark.slow
    def test_prompt_build(self): ...   # 快速

# pytest.ini
[pytest]
markers = slow: 需要 API 调用的慢速测试
```

### Step 6: Git 策略

```
main ← feature/generator-module (--no-ff merge)
     ← feature/design-coordinator
     ← feature/asset-exporter
```

Commit 格式: `feat(scope): description`

### Step 7: 部署

- Docker: `docker-compose up -d`
- 云服务: ECS + systemd + nginx
- 域名: DNS A 记录

## 质量标准

- [ ] `python app.py` → 浏览器可访问
- [ ] `pytest tests/ -m "not slow"` → 全部通过
- [ ] `git log --oneline` → 原子化提交
- [ ] README 含产品定位 + 快速开始 + 技术架构
- [ ] .env.example 清晰标注占位符

## 参考项目

- AssetCraft Studio: https://github.com/5bqf/AssetCraft-Studio
- SOP 文档: 见 memory/sop-ai-app-dev.md
