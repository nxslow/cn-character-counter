import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Character Counter extension is now active!');

    // 注册命令
    let disposable = vscode.commands.registerCommand('char-counter.countCharacters', () => {
        countCharactersInActiveDocument();
    });

    // 注册文本改变事件监听器
    const textChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document === vscode.window.activeTextEditor?.document) {
            handleDocumentChange(event.document);
        }
    });

    context.subscriptions.push(disposable, textChangeListener);
}

function countCharactersInActiveDocument() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No active editor found');
        return;
    }

    const document = editor.document;
    handleDocumentChange(document);
}

function handleDocumentChange(document: vscode.TextDocument) {
    const text = document.getText();
    const config = vscode.workspace.getConfiguration('charCounter');
    const goalNums = config.get<number>('goalNums', 200);

    const regex = /<counter>([\s\S]*?)<\/counter>/gi;
    let match;
    const edits: vscode.TextEdit[] = [];

    while ((match = regex.exec(text)) !== null) {
        const fullMatch = match[0];
        const content = match[1];
        const startPos = match.index;
        
        // 计算字符数（汉字和字母）
        const charCount = countValidCharacters(content);
        
        if (charCount >= goalNums) {
            const lineNumber = document.positionAt(startPos).line;
            const lineText = document.lineAt(lineNumber).text;
            
            // 检查是否已经添加了分隔线
            const nextLineNumber = lineNumber + 1;
            if (nextLineNumber < document.lineCount) {
                const nextLineText = document.lineAt(nextLineNumber).text;
                if (nextLineText.includes('goalNumsEND')) {
                    continue; // 跳过，已存在分隔线
                }
            }
            
            // 创建时间戳
            const now = new Date();
            const timestamp = now.getFullYear().toString() + 
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0');
            
            const separatorLine = `-------------------${timestamp}|${goalNums}END--------------------`;
            
            // 在下一行插入分隔线
            const insertPos = new vscode.Position(lineNumber + 1, 0);
            edits.push(vscode.TextEdit.insert(insertPos, separatorLine + '\n'));
        }
    }

    if (edits.length > 0) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const edit = new vscode.WorkspaceEdit();
            edit.set(document.uri, edits);
            vscode.workspace.applyEdit(edit);
        }
    }
}

function countValidCharacters(text: string): number {
    // 匹配汉字和字母（包括大小写）
    const regex = /[\u4e00-\u9fa5a-zA-Z]/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

export function deactivate() {}