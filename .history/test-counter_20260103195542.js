// 测试字符计数功能
function countValidCharacters(text) {
    // 匹配汉字和字母（包括大小写）
    const regex = /[\u4e00-\u9fa5a-zA-Z]/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

// 测试用例
const testCases = [
    {
        name: "纯汉字测试",
        text: "这是一个测试文本", // 8个汉字
        expected: 8
    },
    {
        name: "纯英文测试", 
        text: "Hello World", // 10个字母（空格不算）
        expected: 10
    },
    {
        name: "混合测试",
        text: "Hello 世界 123 !@#", // Hello(5) + 世界(2) = 7个字符
        expected: 7
    },
    {
        name: "空文本测试",
        text: "",
        expected: 0
    }
];

console.log("字符计数功能测试:\n");

testCases.forEach(test => {
    const result = countValidCharacters(test.text);
    const status = result === test.expected ? "✓ 通过" : "✗ 失败";
    console.log(`${status} ${test.name}: ${result}/${test.expected}`);
});

// 测试分隔线生成
const now = new Date();
const timestamp = now.getFullYear().toString() + 
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0');

const goalNums = 200;
const separatorLine = `-------------------${timestamp}|${goalNums}END--------------------`;

console.log("\n分隔线示例:");
console.log(separatorLine);

// 测试示例文本
console.log("\n示例文本字符计数:");
const exampleText = `这是一个测试文本，包含汉字和英文字符。
This is a test text with Chinese and English characters.`;
console.log(`字符数: ${countValidCharacters(exampleText)}`);