# Character Counter 插件使用指南

## 安装和运行

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **编译扩展**：
   ```bash
   npm run compile
   ```

3. **测试运行**：
   - 按 `F5` 键启动 Extension Development Host
   - 或者使用 `Ctrl+Shift+P` 打开命令面板，选择 "Developer: Reload Window"

## 配置选项

在 VS Code 设置中配置目标字符数：

**方法1：UI设置**
- 打开设置（`Ctrl+,`）
- 搜索 "Character Counter"
- 修改 "Goal Numbers" 值

**方法2：编辑 settings.json**
```json
{
  "charCounter.goalNums": 200
}
```

## 使用方法

### 基本使用
1. 在文档中使用 `<counter>` 标签包裹需要计数的内容：
   ```html
   <counter>
   这里是需要计数的文本内容...
   </counter>
   ```

2. 当字符数达到目标值时，会自动添加分隔线：
   ```
   -------------------202601031955|200END--------------------
   ```

### 支持的文件类型
- 纯文本文件 (.txt)
- Markdown 文件 (.md)
- HTML 文件 (.html)

### 手动触发计数
- 使用命令面板（`Ctrl+Shift+P`）
- 输入 "Character Counter: Count Characters"

## 功能特性

- ✅ 自动检测和计数 `<counter>` 标签内容
- ✅ 只统计汉字和字母字符（忽略空格、标点、数字）
- ✅ 自动在达标行下方添加时间戳分隔线
- ✅ 防止重复添加分隔线
- ✅ 实时响应文件更改和保存

## 示例

**输入：**
```markdown
<counter>
这是一个测试文本，用于演示字符计数功能。
This is a demonstration of character counting.
当字符数达到目标值时，会自动添加分隔线。
</counter>
```

**输出（当字符数≥200时）：**
```markdown
<counter>
这是一个测试文本，用于演示字符计数功能。
This is a demonstration of character counting.
当字符数达到目标值时，会自动添加分隔线。
</counter>
-------------------202601031955|200END--------------------
```

## 故障排除

1. **分隔线未出现**：
   - 检查字符数是否达到目标值
   - 确认标签格式正确：`<counter>内容</counter>`
   - 检查是否已存在分隔线

2. **字符计数不准确**：
   - 插件只统计汉字和字母，忽略其他字符
   - 使用命令面板手动触发重新计数

3. **性能问题**：
   - 对于大文件，建议增加目标字符数值
   - 可禁用自动检测，仅使用手动触发