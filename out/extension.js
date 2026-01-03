"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// 定义状态栏项
let statusBarItem;
let textChangeListener;
function activate(context) {
    console.log('Character Counter extension is now active!');
    // 创建状态栏项 - 显示所有字符数量
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "字符: 0";
    statusBarItem.tooltip = "当前文件的有效字符数量（汉字和字母）";
    statusBarItem.show();
    // 注册命令
    let disposable = vscode.commands.registerCommand('char-counter.countCharacters', () => {
        updateStatusBarAndCheckCounters();
    });
    // 注册文本改变事件监听器（带防抖）
    textChangeListener = vscode.workspace.onDidChangeTextDocument(debounce((event) => {
        if (event.document === vscode.window.activeTextEditor?.document) {
            updateStatusBarAndCheckCounters();
        }
    }, 300));
    // 注册编辑器切换事件
    const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(() => {
        updateStatusBarAndCheckCounters();
    });
    // 初始更新状态栏
    updateStatusBarAndCheckCounters();
    context.subscriptions.push(disposable, textChangeListener, editorChangeListener, statusBarItem);
}
exports.activate = activate;
// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
// 更新状态栏并检查计数器
function updateStatusBarAndCheckCounters() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        statusBarItem.text = "字符: 0";
        return;
    }
    const document = editor.document;
    const text = document.getText();
    // 更新状态栏显示当前文件的所有有效字符数量
    const totalValidCount = countValidCharacters(text);
    statusBarItem.text = `字符: ${totalValidCount}`;
    // 检查并处理计数器标签
    handleCounterTags(document, editor);
}
// 检查并处理计数器标签
function handleCounterTags(document, editor) {
    try {
        const text = document.getText();
        const config = vscode.workspace.getConfiguration('charCounter');
        const goalNums = config.get('goalNums', 30);
        const regex = /<counter>([\s\S]*?)<\/counter>/gi;
        let match;
        const edits = [];
        while ((match = regex.exec(text)) !== null) {
            const content = match[1];
            const startPos = match.index + match[0].indexOf('>') + 1; // 内容开始位置
            const endPos = match.index + match[0].lastIndexOf('<'); // 内容结束位置
            // 检查是否已有分隔线
            const contentEndLine = document.positionAt(endPos).line;
            const hasSeparator = checkExistingSeparator(document, contentEndLine);
            if (!hasSeparator) {
                const charCount = countValidCharacters(content);
                if (charCount >= goalNums) {
                    // 找到最后一个字符的位置
                    const lastCharPosition = findLastCharacterPosition(document, startPos, endPos);
                    // 创建分隔线
                    const separatorLine = createSeparatorLine();
                    const insertPos = new vscode.Position(lastCharPosition.line + 1, 0);
                    edits.push(vscode.TextEdit.insert(insertPos, '\n' + separatorLine + '\n'));
                }
            }
        }
        applyEdits(document, edits);
    }
    catch (error) {
        console.error('Error in character counter:', error);
    }
}
// 查找最后一个字符的位置
function findLastCharacterPosition(document, startOffset, endOffset) {
    const text = document.getText();
    let lastCharOffset = endOffset - 1;
    // 向后查找最后一个非空白字符
    while (lastCharOffset > startOffset) {
        const char = text[lastCharOffset];
        if (char && !char.match(/\s/)) {
            break;
        }
        lastCharOffset--;
    }
    return document.positionAt(lastCharOffset);
}
// 检查是否存在分隔线
function checkExistingSeparator(document, lineNumber) {
    for (let i = lineNumber + 1; i < document.lineCount; i++) {
        const lineText = document.lineAt(i).text.trim();
        // 如果遇到新的counter开始标签，停止检查（属于另一个counter的作用域）
        if (lineText.includes('<counter>')) {
            break;
        }
        // 精确匹配分隔线格式：以多个横线开头，包含END，以多个横线结尾（不带goalNums）
        if (/^-+.*\d{12}\|END-+$/.test(lineText)) {
            return true;
        }
        // 如果遇到counter结束标签，继续检查（分隔线应该在</counter>之后）
        if (lineText.includes('</counter>')) {
            continue;
        }
    }
    return false;
}
// 创建分隔线（新格式，不包含goalNums）
function createSeparatorLine() {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
    return `-------------------${timestamp}|END--------------------`;
}
// 应用编辑
function applyEdits(document, edits) {
    if (edits.length > 0) {
        const edit = new vscode.WorkspaceEdit();
        edit.set(document.uri, edits);
        vscode.workspace.applyEdit(edit);
    }
}
// 统计有效字符（汉字和字母） - 用于状态栏显示和计数器统计
function countValidCharacters(text) {
    const regex = /[\u4e00-\u9fa5a-zA-Z]/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}
function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    if (textChangeListener) {
        textChangeListener.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map