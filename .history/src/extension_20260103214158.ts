import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
let textChangeListener: vscode.Disposable;

export function activate(context: vscode.ExtensionContext) {
    console.log('Character Counter extension is now active!');

    // 状态栏显示所有字符数量（汉字、字母、逗号和句号）
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "字符: 0";
    statusBarItem.tooltip = "当前文件的有效字符数量（汉字、字母、逗号和句号）";
    statusBarItem.show();

    // 注册命令
    let disposable = vscode.commands.registerCommand('char-counter.countCharacters', () => {
        updateCharacterCount();
    });

    // 文本改变监听器（带防抖）
    textChangeListener = vscode.workspace.onDidChangeTextDocument(
        debounce((event: vscode.TextDocumentChangeEvent) => {
            if (event.document === vscode.window.activeTextEditor?.document) {
                updateCharacterCount();
            }
        }, 300)
    );

    context.subscriptions.push(disposable, textChangeListener, statusBarItem);
}

function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function(this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function updateCharacterCount() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        statusBarItem.text = "字符: 0";
        return;
    }

    const document = editor.document;
    const text = document.getText();
    
    // 统计所有有效字符
    const validChars = text.match(/[\u4e00-\u9fa5a-zA-Z\，。]/g) || [];
    const totalValidChars = validChars.length;
    statusBarItem.text = `字符: ${totalValidChars}`;

    // 检查并添加分隔线
    addSeparators(document, editor, totalValidChars);
}

function addSeparators(document: vscode.TextDocument, editor: vscode.TextEditor, totalChars: number) {
    try {
        const config = vscode.workspace.getConfiguration('charCounter');
        const goalNums = config.get<number>('goalNums', 10);

        // 计算需要添加分隔线的倍数（正整数倍）
        const multiplier = Math.floor(totalChars / goalNums);
        let ysh = totalChars % goalNums;
        if (multiplier < 1 && ysh==0) return;

        // 查找最后一个有效字符的位置
        const lastCharPos = findLastValidCharPosition(document.getText(), multiplier * goalNums);
        if (lastCharPos === -1) return;

        const position = document.positionAt(lastCharPos);
        
        // 检查是否已有分隔线
        if (!hasSeparator(document, position.line)) {
            const separatorLine = createSeparatorLine();
            const insertPos = new vscode.Position(position.line + 1, 0);
            
            const edit = new vscode.WorkspaceEdit();
            edit.insert(document.uri, insertPos, '\n' + separatorLine + '\n');
            vscode.workspace.applyEdit(edit);
        }
    } catch (error) {
        console.error('Error adding separators:', error);
    }
}

function findLastValidCharPosition(text: string, targetCount: number): number {
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

function hasSeparator(document: vscode.TextDocument, lineNumber: number): boolean {
    for (let i = lineNumber + 1; i < document.lineCount; i++) {
        const lineText = document.lineAt(i).text.trim();
        if (/^-+\d{12}-+$/.test(lineText)) {
            return true;
        }
        // 遇到非空行停止检查
        if (lineText.length > 0 && !lineText.startsWith('-')) {
            break;
        }
    }
    return false;
}

function createSeparatorLine(): string {
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
    
    return `----------------${timestamp}------------------`;
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    if (textChangeListener) {
        textChangeListener.dispose();
    }
}