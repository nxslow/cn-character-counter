// 字符计数器功能测试
function testCharacterCounter() {
    console.log('=== Character Counter 插件功能测试 ===\n');

    // 测试用例1: 统计字符（汉字、字母、逗号和句号）
    const testText1 = '汉字测试,English test。';
    const count1 = countValidCharacters(testText1);
    console.log('测试1 - 统计字符:');
    console.log('输入:', testText1);
    console.log('统计结果:', count1, '个有效字符');
    console.log('预期: 4个汉字 + 11个字母 + 1个逗号 + 1个句号 = 17个字符');
    console.log('测试结果:', count1 === 17 ? '✓ 通过' : '✗ 失败');
    console.log('');

    // 测试用例2: 分隔线生成
    const separatorLine = createSeparatorLine();
    console.log('测试2 - 分隔线生成:');
    console.log('分隔线:', separatorLine);
    console.log('格式验证:', /^----------------\d{12}------------------$/.test(separatorLine) ? '✓ 通过' : '✗ 失败');
    console.log('');

    // 测试用例3: 查找最后一个字符位置
    const testText3 = 'abc汉字,def。';
    const pos3 = findLastValidCharPosition(testText3, 5); // 查找第5个有效字符
    console.log('测试3 - 查找字符位置:');
    console.log('输入:', testText3);
    console.log('第5个字符位置:', pos3, '字符:', testText3[pos3]);
    console.log('预期: 位置5, 字符 "字"');
    console.log('测试结果:', pos3 === 5 && testText3[pos3] === '字' ? '✓ 通过' : '✗ 失败');
}

// 核心函数
function countValidCharacters(text) {
    const regex = /[\u4e00-\u9fa5a-zA-Z，。]/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

function createSeparatorLine() {
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
    
    return `----------------${timestamp}------------------`;
}

function findLastValidCharPosition(text, targetCount) {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        if (/[\u4e00-\u9fa5a-zA-Z，。]/.test(text[i])) {
            count++;
            if (count === targetCount) {
                return i;
            }
        }
    }
    return -1;
}

// 运行测试
testCharacterCounter();