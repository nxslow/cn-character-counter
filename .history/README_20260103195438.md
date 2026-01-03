# Character Counter VS Code Extension

一个用于统计 `<counter>` 标签内字符数量并在达到目标值时自动添加分隔线的 VS Code 插件。

## 功能特性

- 自动检测 `<counter>` 标签内的字符数量
- 支持统计汉字和字母字符
- 当字符数量达到配置的目标值时，自动在标签所在行下方添加分隔线
- 分隔线包含时间戳和目标字符数信息

## 使用方法

1. 在文本中使用 `<counter>` 标签包裹需要计数的内容：
   ```html
   <counter>
   这里是需要计数的文本内容，可以包含汉字和字母
   </counter>
   ```

2. 当标签内的有效字符数达到配置的目标值时，会自动在标签行下方添加分隔线：
   ```
   -------------------202601031954|200END--------------------
   ```

## 配置选项

在 VS Code 设置中搜索 "Character Counter" 或直接编辑 `settings.json`：

```json
{
  "charCounter.goalNums": 200
}
```

## 安装和运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 编译 TypeScript：
   ```bash
   npm run compile
   ```

3. 按 F5 启动调试 Extension Development Host 进行测试

## 开发说明

- 插件会在文本更改时自动触发计数检查
- 也可以通过命令面板执行 "Character Counter: Count Characters" 命令手动触发
- 支持的文件类型：纯文本、Markdown、HTML