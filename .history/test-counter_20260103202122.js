// Character Counter 插件功能测试
function testCharacterCounter() {
    console.log('=== Character Counter 插件功能测试 ===\n');

    // 测试用例1: 统计汉字和字母
    const testText1 = '汉字测试 English test 123!@#';
    const count1 = countValidCharacters(testText1);
    console.log('测试1 - 统计汉字和字母:');
    console.log('输入:', testText1);
    console.log('统计结果:', count1, '个有效字符');
    console.log('预期: 4个汉字 + 11个字母 = 15个字符');
    console.log('测试结果:', count1 === 15 ? '✓ 通过' : '✗ 失败');
    console.log('');

    // 测试用例2: 仅统计汉字
    const testText2 = '这是一个只包含汉字的测试文本';
    const count2 = countValidCharacters(testText2);
    console.log('测试2 - 仅统计汉字:');
    console.log('输入:', testText2);
    console.log('统计结果:', count2, '个有效字符');
    console.log('预期: 14个汉字');
    console.log('测试结果:', count2 === 14 ? '✓ 通过' : '✗ 失败');
    console.log('');

    // 测试用例3: 分隔线生成
    const goalNums = 30;
    const separatorLine = createSeparatorLine(goalNums);
    console.log('测试3 - 分隔线生成:');
    console.log('分隔线:', separatorLine);
    console.log('格式验证:', /^-------------------\d{12}\|30END--------------------$/.test(separatorLine) ? '✓ 通过' : '✗ 失败');
    console.log('');

    // 测试用例4: 汉字统计（状态栏功能）
    const fullText = '汉字统计测试 Chinese characters 123!@#';
    const chineseCount = countChineseCharacters(fullText);
    console.log('测试4 - 汉字统计:');
    console.log('输入:', fullText);
    console.log('汉字数量:', chineseCount);
    console.log('预期: 6个汉字');
    console.log('测试结果:', chineseCount === 6 ? '✓ 通过' : '✗ 失败');
    console.log('');

    console.log('=== 测试完成 ===');
}

// 从扩展代码中复制的核心函数
function countValidCharacters(text) {
    const regex = /[\u4e00-\u9fa5a-zA-Z]/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

function countChineseCharacters(text) {
    const regex = /[\u4e00-\u9fa5]/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

function createSeparatorLine(goalNums) {
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
    
    return `-------------------${timestamp}|${goalNums}END--------------------`;
}

// 运行测试
testCharacterCounter();