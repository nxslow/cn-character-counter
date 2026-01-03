import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Character Counter extension is now active!');

    // 注册命令
    let disposable = vscode.commands.registerCommand('char-counter.countCharacters', () => {
        countCharactersInActiveDocument();
    });

    // 注册文本改变事件监听器（添加防抖处理）
    const textChangeListener = vscode.workspace.onDidChangeTextDocument(
        debounce((event) => {
            if (event.document === vscode.window.activeTextEditor?.document) {
                handleDocumentChange(event.document);
            }
        }, 500)
    );

    context.subscriptions.push(disposable, textChangeListener);
}

// 防抖函数
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function countCharactersInActiveDocument() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No active editor found');
        return;
    }
    handleDocumentChange(editor.document);
}

function handleDocumentChange(document: vscode.TextDocument) {
    try {
        const text = document.getText();
        const config = vscode.workspace.getConfiguration('charCounter');
        const goalNums = config.get<number>('goalNums', 200);

        const regex = /<counter>([\s\S]*?)<\/counter>/gi;
        let match;
        const edits: vscode.TextEdit[] = [];

        while ((match = regex.exec(text)) !== null) {
            const content = match[1];
            const startPos = match.index;
            
            // 检查是否已有分隔线
            const lineNumber = document.positionAt(startPos).line;
            const hasSeparator = checkExistingSeparator(document, lineNumber);
            
            if (!hasSeparator) {
                const charCount = countValidCharacters(content);
                if (charCount >= goalNums) {
                    const separatorLine = createSeparatorLine(goalNums);
                    const insertPos = new vscode.Position(lineNumber + 1, 0);
                    edits.push(vscode.TextEdit.insert(insertPos, separatorLine + '\n'));
                }
            }
        }

        applyEdits(document, edits);
    } catch (error) {
        console.error('Error in character counter:', error);
    }
}

function checkExistingSeparator(document: vscode.TextDocument, lineNumber: number): boolean {
    const nextLineNumber = lineNumber + 1;
    if (nextLineNumber >= document.lineCount) {
        return false;
    }
    const nextLineText = document.lineAt(nextLineNumber).text;
    return nextLineText.includes('goalNumsEND');
}

function createSeparatorLine(goalNums: number): string {
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
    
    return `-------------------${timestamp}|${goalNums}END--------------------`;
}

function applyEdits(document: vscode.TextDocument, edits: vscode.TextEdit[]) {
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
    const regex = /[\u4e00-\u9fa5a-zA-Z]/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

export function deactivate() {}
