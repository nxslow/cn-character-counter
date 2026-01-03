# 插件功能测试

## 状态栏测试
打开此文件后，VS Code 状态栏右侧应该显示当前文件的汉字数量。

## 计数器标签测试

<counter>
这个标签内的文本包含了汉字和字母，总字符数会实时统计。
This text contains both Chinese characters and English letters.
字符统计功能将会检测汉字和字母的数量。
</counter>

<counter>
短标签测试
short test
</counter>

<counter>
这个测试用例用于验证当字符数达到目标值（默认30）时的自动处理功能。
The counter should automatically add a separator line and create a new tag pair.
汉字和字母都会被计入总数，空格和标点符号不计入。
</counter>