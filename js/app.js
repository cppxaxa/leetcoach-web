// Initialize Storage
const storage = new Storage();

// Initialize LLM
const llm = new Llm(storage);

// Application State
let monacoEditor = null;
let currentProject = null;
let isLLMResponding = false;
let isSidebarCollapsed = false;
let maximizedPanel = null; // Track which panel is maximized
let panelStates = {
    editor: { collapsed: false, originalHeight: null },
    output: { collapsed: false, originalHeight: null },
    input: { collapsed: false, originalHeight: null }
};

// LLM chat state
let currentAbortController = null;
let dialogAbortController = null;
let isDialogLLMResponding = false;

// Auto-save configuration
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
let autoSaveTimer = null;

// Simple markdown parser fallback (if marked.js doesn't load)
function simpleMarkdownParse(markdown) {
    let html = markdown;
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    return html;
}

// Theme configurations for Monaco Editor
const monacoThemes = {
    'dark': 'vs-dark',
    'light': 'vs'
};

// Sample code templates for different problems
const codeTemplates = {
    'two-sum': {
        python: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your solution here
    pass`,
        csharp: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Your solution here
        
    }
}`
    },
    'add-two-numbers': {
        python: `# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution(object):
    def addTwoNumbers(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        # Your solution here
        pass`,
        csharp: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     public int val;
 *     public ListNode next;
 *     public ListNode(int val=0, ListNode next=null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */
public class Solution {
    public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {
        // Your solution here
        
    }
}`
    },
    'longest-substring': {
        python: `def lengthOfLongestSubstring(s):
    """
    :type s: str
    :rtype: int
    """
    # Your solution here
    pass`,
        csharp: `public class Solution {
    public int LengthOfLongestSubstring(string s) {
        // Your solution here
        
    }
}`
    }
};

// Project configuration with metadata
const projectConfig = {
    'two-sum': {
        name: 'Two Sum',
        difficulty: 'easy'
    },
    'add-two-numbers': {
        name: 'Add Two Numbers',
        difficulty: 'medium'
    },
    'longest-substring': {
        name: 'Longest Substring',
        difficulty: 'medium'
    },
    'median-arrays': {
        name: 'Median of Two Arrays',
        difficulty: 'hard'
    },
    'palindrome-number': {
        name: 'Palindrome Number',
        difficulty: 'easy'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize LLM settings
    llm.initSettingPlaceholders();

    // Set LLM type
    llm.setType('gemini');

    // Configure marked.js
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
    }
    
    // Load saved theme preference
    const savedTheme = storage.get('preferences:theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update theme button active state
    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Load saved language preference
    const savedLanguage = storage.get('preferences:language') || 'csharp';
    document.querySelectorAll('.language-btn').forEach(btn => {
        if (btn.getAttribute('data-language') === savedLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Load saved sidebar state
    const savedSidebarState = storage.get('preferences:sidebarCollapsed');
    if (savedSidebarState === true) {
        isSidebarCollapsed = true;
        document.getElementById('sidebar').classList.add('collapsed');
    }
    
    // Don't auto-select any project on launch
    // User must explicitly select a project from the sidebar
    
    initializeMonacoEditor();
    initializeEventListeners();
    
    // Restore panel heights if saved
    const savedPanelHeights = storage.get('preferences:panelHeights');
    if (savedPanelHeights) {
        const editorPanel = document.querySelector('.editor-panel');
        const outputPanel = document.querySelector('.output-panel');
        const inputPanel = document.querySelector('.input-panel');
        
        if (savedPanelHeights.editor) editorPanel.style.height = savedPanelHeights.editor + 'px';
        if (savedPanelHeights.output) outputPanel.style.height = savedPanelHeights.output + 'px';
        if (savedPanelHeights.input) inputPanel.style.height = savedPanelHeights.input + 'px';
    }
    
    // Refresh projects on launch
    handleRefreshProjects();
    
    // No project loaded initially - user must select one
});

// Save editor content when page is about to unload
window.addEventListener('beforeunload', function(e) {
    // Perform final save
    saveEditorContent();
    stopPeriodicAutoSave();
});

// Initialize Monaco Editor
function initializeMonacoEditor() {
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
    
    require(['vs/editor/editor.main'], function() {
        monacoEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
            value: '',
            language: 'csharp',
            theme: 'vs-dark',
            fontSize: 13,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            wordWrap: 'on',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            bracketMatching: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true
        });

        // Apply current theme
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        updateMonacoTheme(currentTheme);
        
        // Save code on content change (debounced)
        let saveTimeout;
        monacoEditor.onDidChangeModelContent(() => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const activeLanguageBtn = document.querySelector('.language-btn.active');
                const currentLanguage = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
                const currentCode = monacoEditor.getValue();
                storage.set(`project:${currentProject}:${currentLanguage}:code`, currentCode);
            }, 500); // Save after 500ms of no typing
        });
        
        // Save code when editor loses focus
        monacoEditor.onDidBlurEditorText(() => {
            saveEditorContent();
            console.log('[Auto-save] Code saved on editor blur');
        });
        
        // Initialize periodic auto-save
        startPeriodicAutoSave();
    });
}

// Periodic auto-save function
function saveEditorContent() {
    if (!monacoEditor) return;
    
    const activeLanguageBtn = document.querySelector('.language-btn.active');
    const currentLanguage = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
    const currentCode = monacoEditor.getValue();
    
    // Save the code
    storage.set(`project:${currentProject}:${currentLanguage}:code`, currentCode);
    
    // Store timestamp of last auto-save
    storage.set(`project:${currentProject}:${currentLanguage}:lastSave`, new Date().toISOString());
    
    console.log(`[Auto-save] Code saved at ${new Date().toLocaleTimeString()}`);
}

// Start periodic auto-save timer
function startPeriodicAutoSave() {
    // Clear any existing timer
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    
    // Set up new interval
    autoSaveTimer = setInterval(() => {
        saveEditorContent();
    }, AUTO_SAVE_INTERVAL);
    
    console.log(`[Auto-save] Periodic save enabled (every ${AUTO_SAVE_INTERVAL / 1000} seconds)`);
}

// Stop periodic auto-save timer
function stopPeriodicAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
        console.log('[Auto-save] Periodic save disabled');
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Theme selector buttons
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', handleThemeButtonClick);
    });

    // Language selector buttons
    const languageBtns = document.querySelectorAll('.language-btn');
    languageBtns.forEach(btn => {
        btn.addEventListener('click', handleLanguageButtonClick);
    });

    // Project items
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('click', handleProjectClick);
    });

    // Send button
    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', handleSendMessage);

    // Stop button
    const stopBtn = document.getElementById('stop-btn');
    stopBtn.addEventListener('click', handleStopMessage);

    // Clear output button
    const clearBtn = document.getElementById('clear-output');
    clearBtn.addEventListener('click', handleClearOutput);

    // Sidebar toggle button
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle.addEventListener('click', handleSidebarToggle);

    // Sidebar expand button
    const sidebarExpandBtn = document.getElementById('sidebar-expand-btn');
    sidebarExpandBtn.addEventListener('click', handleSidebarExpand);

    // Refresh projects button
    const refreshBtn = document.getElementById('refresh-projects');
    refreshBtn.addEventListener('click', handleRefreshProjects);

    // Add project button
    const addProjectBtn = document.getElementById('add-project-btn');
    addProjectBtn.addEventListener('click', handleAddProjectClick);

    // Dialog buttons
    const dialogCloseBtn = document.getElementById('dialog-close-btn');
    const dialogSendBtn = document.getElementById('dialog-send-btn');
    const dialogStopBtn = document.getElementById('dialog-stop-btn');
    const dialogCancelBtn = document.getElementById('dialog-cancel-btn');
    const dialogRandomBtn = document.getElementById('dialog-random-btn');
    const dialogOverlay = document.getElementById('project-dialog-overlay');

    dialogCloseBtn.addEventListener('click', handleCloseDialog);
    dialogSendBtn.addEventListener('click', handleDialogSend);
    dialogStopBtn.addEventListener('click', handleDialogStop);
    dialogCancelBtn.addEventListener('click', handleCloseDialog);
    dialogRandomBtn.addEventListener('click', handleDialogRandom);
    
    // Close dialog when clicking overlay
    dialogOverlay.addEventListener('click', function(e) {
        if (e.target === dialogOverlay) {
            handleCloseDialog();
        }
    });

    // Delete dialog buttons
    const deleteDialogCloseBtn = document.getElementById('delete-dialog-close-btn');
    const deleteDialogConfirmBtn = document.getElementById('delete-dialog-confirm-btn');
    const deleteDialogCancelBtn = document.getElementById('delete-dialog-cancel-btn');
    const deleteDialogOverlay = document.getElementById('delete-dialog-overlay');

    deleteDialogCloseBtn.addEventListener('click', handleCloseDeleteDialog);
    deleteDialogConfirmBtn.addEventListener('click', handleConfirmDelete);
    deleteDialogCancelBtn.addEventListener('click', handleCloseDeleteDialog);
    
    // Close delete dialog when clicking overlay
    deleteDialogOverlay.addEventListener('click', function(e) {
        if (e.target === deleteDialogOverlay) {
            handleCloseDeleteDialog();
        }
    });

    // Clarify dialog buttons
    const clarifyBtn = document.getElementById('clarify-btn');
    const clarifyDialogCloseBtn = document.getElementById('clarify-dialog-close-btn');
    const clarifySendBtn = document.getElementById('clarify-send-btn');
    const clarifyStopBtn = document.getElementById('clarify-stop-btn');
    const clarifyClearBtn = document.getElementById('clarify-clear-btn');
    const clarifyDialogOverlay = document.getElementById('clarify-dialog-overlay');
    const clarifyInput = document.getElementById('clarify-input');

    clarifyBtn.addEventListener('click', handleClarifyClick);
    clarifyDialogCloseBtn.addEventListener('click', handleCloseClarifyDialog);
    clarifySendBtn.addEventListener('click', handleClarifySend);
    clarifyStopBtn.addEventListener('click', handleClarifyStop);
    clarifyClearBtn.addEventListener('click', handleClarifyClearHistory);
    
    // Close clarify dialog when clicking overlay
    clarifyDialogOverlay.addEventListener('click', function(e) {
        if (e.target === clarifyDialogOverlay) {
            handleCloseClarifyDialog();
        }
    });

    // Clarify input - handle Enter key
    clarifyInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleClarifySend();
        }
        // Shift+Enter will allow default behavior (new line)
    });

    // LLM Help dialog buttons
    const chatHelpBtn = document.getElementById('chat-help-btn');
    const llmHelpDialogCloseBtn = document.getElementById('llm-help-dialog-close-btn');
    const llmHelpDialogOkBtn = document.getElementById('llm-help-dialog-ok-btn');
    const llmHelpDialogOverlay = document.getElementById('llm-help-dialog-overlay');

    chatHelpBtn.addEventListener('click', handleOpenLlmHelpDialog);
    llmHelpDialogCloseBtn.addEventListener('click', handleCloseLlmHelpDialog);
    llmHelpDialogOkBtn.addEventListener('click', handleCloseLlmHelpDialog);
    
    // Close help dialog when clicking overlay
    llmHelpDialogOverlay.addEventListener('click', function(e) {
        if (e.target === llmHelpDialogOverlay) {
            handleCloseLlmHelpDialog();
        }
    });

    // Editor send button
    const editorSendBtn = document.getElementById('editor-send-btn');
    editorSendBtn.addEventListener('click', handleEditorSendClick);

    // Maximize buttons
    const maximizeEditorBtn = document.getElementById('maximize-editor');
    const maximizeOutputBtn = document.getElementById('maximize-output');
    const maximizeInputBtn = document.getElementById('maximize-input');
    
    maximizeEditorBtn.addEventListener('click', () => handleMaximizePanel('editor'));
    maximizeOutputBtn.addEventListener('click', () => handleMaximizePanel('output'));
    maximizeInputBtn.addEventListener('click', () => handleMaximizePanel('input'));

    // Double-click on panel headers to collapse/expand (only for Editor and Output panels)
    const editorHeader = document.querySelector('.editor-panel .panel-header');
    const outputHeader = document.querySelector('.output-panel .panel-header');
    
    editorHeader.addEventListener('dblclick', () => handlePanelCollapse('editor'));
    outputHeader.addEventListener('dblclick', () => handlePanelCollapse('output'));

    // User input textarea - handle Enter key
    const userInput = document.getElementById('user-input');
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        // Shift+Enter will allow default behavior (new line)
    });
    
    // Add keyboard shortcut for sidebar toggle (Ctrl+B)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            handleSidebarToggle();
        }
    });

    // Storage export/import buttons
    const exportStorageBtn = document.getElementById('export-storage-btn');
    const importStorageBtn = document.getElementById('import-storage-btn');
    const importStorageInput = document.getElementById('import-storage-input');

    exportStorageBtn.addEventListener('click', handleExportStorage);
    importStorageBtn.addEventListener('click', () => importStorageInput.click());
    importStorageInput.addEventListener('change', handleImportStorage);
}

// Handle export storage
function handleExportStorage() {
    try {
        // Get all localStorage data
        const storageData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            storageData[key] = localStorage.getItem(key);
        }

        // Create a blob with the data
        const dataStr = JSON.stringify(storageData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `leetcoach-settings-${timestamp}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('Settings exported successfully');
    } catch (error) {
        console.error('Error exporting settings:', error);
        alert('Failed to export settings. Please try again.');
    }
}

// Handle import storage
function handleImportStorage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Confirm with user before overwriting
            const confirmMessage = 'This will replace all your current settings and projects. Are you sure you want to continue?';
            if (!confirm(confirmMessage)) {
                // Reset file input
                event.target.value = '';
                return;
            }

            // Clear existing localStorage
            localStorage.clear();

            // Import all data
            for (const key in importedData) {
                if (importedData.hasOwnProperty(key)) {
                    localStorage.setItem(key, importedData[key]);
                }
            }

            console.log('Settings imported successfully');
            alert('Settings imported successfully! The page will now reload.');
            
            // Reload the page to apply all settings
            location.reload();
        } catch (error) {
            console.error('Error importing settings:', error);
            alert('Failed to import settings. Please make sure the file is valid.');
            event.target.value = '';
        }
    };

    reader.onerror = function() {
        console.error('Error reading file');
        alert('Failed to read the file. Please try again.');
        event.target.value = '';
    };

    reader.readAsText(file);
}

// Handle theme button click
function handleThemeButtonClick(event) {
    const clickedBtn = event.currentTarget;
    const selectedTheme = clickedBtn.getAttribute('data-theme');
    
    // Update active state
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');
    
    // Apply theme
    document.body.setAttribute('data-theme', selectedTheme);
    updateMonacoTheme(selectedTheme);
    
    // Save theme preference using storage
    storage.set('preferences:theme', selectedTheme);
}

// Update theme selector options
function updateThemeSelector() {
    // No longer needed with button-based theme selector
}

// Handle theme change
function handleThemeChange(event) {
    const selectedTheme = event.target.value;
    document.body.setAttribute('data-theme', selectedTheme);
    updateMonacoTheme(selectedTheme);
    
    // Save theme preference using storage
    storage.set('preferences:theme', selectedTheme);
}

// Update Monaco Editor theme
function updateMonacoTheme(theme) {
    if (monacoEditor) {
        const monacoTheme = monacoThemes[theme] || 'vs-dark';
        monaco.editor.setTheme(monacoTheme);
    }
}

// Handle language button click
function handleLanguageButtonClick(event) {
    const clickedBtn = event.currentTarget;
    const selectedLanguage = clickedBtn.getAttribute('data-language');
    
    // Save current code before switching
    if (monacoEditor) {
        const currentLanguageBtn = document.querySelector('.language-btn.active');
        const oldLanguage = currentLanguageBtn ? currentLanguageBtn.getAttribute('data-language') : 'csharp';
        const currentCode = monacoEditor.getValue();
        storage.set(`project:${currentProject}:${oldLanguage}:code`, currentCode);
    }
    
    // Update active state
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');
    
    // Save language preference
    storage.set('preferences:language', selectedLanguage);
    
    // Change Monaco Editor language and load code
    if (monacoEditor) {
        monaco.editor.setModelLanguage(monacoEditor.getModel(), selectedLanguage);
        
        // Try to load saved code for this language
        const savedCode = storage.get(`project:${currentProject}:${selectedLanguage}:code`);
        if (savedCode) {
            monacoEditor.setValue(savedCode);
        } else {
            loadCodeTemplate(currentProject, selectedLanguage);
        }
    }
}

// Handle language change (legacy - kept for compatibility)
function handleLanguageChange(event) {
    const selectedLanguage = event.target.value;
    if (monacoEditor) {
        monaco.editor.setModelLanguage(monacoEditor.getModel(), selectedLanguage);
        loadCodeTemplate(currentProject, selectedLanguage);
    }
}

// Handle project click
function handleProjectClick(event) {
    const projectItem = event.currentTarget;
    const projectId = projectItem.getAttribute('data-project');
    
    // Update active state
    document.querySelectorAll('.project-item').forEach(item => {
        item.classList.remove('active');
    });
    projectItem.classList.add('active');
    
    // Load project first
    loadProject(projectId);
    
    // Save current code before switching projects
    if (monacoEditor && currentProject) {
        const activeLanguageBtn = document.querySelector('.language-btn.active');
        const currentLanguage = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
        const currentCode = monacoEditor.getValue();
        storage.set(`project:${currentProject}:${currentLanguage}:code`, currentCode);
    }
    
    // Save last active project
    storage.set('preferences:lastProject', projectId);
}

// Load project
function loadProject(projectId) {
    currentProject = projectId;
    const activeLanguageBtn = document.querySelector('.language-btn.active');
    const currentLanguage = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
    
    // Try to load saved code from storage
    const savedCode = storage.get(`project:${projectId}:${currentLanguage}:code`);
    if (savedCode && monacoEditor) {
        monacoEditor.setValue(savedCode);
    } else {
        loadCodeTemplate(projectId, currentLanguage);
    }
    
    // Load saved chat history
    loadChatHistory(projectId);
    
    // Update project metadata
    updateProjectMetadata(projectId);
}

// Load code template
function loadCodeTemplate(projectId, language) {
    if (monacoEditor && codeTemplates[projectId] && codeTemplates[projectId][language]) {
        monacoEditor.setValue(codeTemplates[projectId][language]);
    } else if (monacoEditor) {
        // Default template if specific template not found
        monacoEditor.setValue(`// ${projectId} - ${language}\n// Start coding here...\n`);
    }
}

// Handle send message
function handleSendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Check if LLM is configured
    try {
        llm._get();
    } catch (error) {
        const outputDiv = document.getElementById('markdown-output');
        const errorHtml = `
            <div style="background: #f44336; color: white; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                <strong>Error:</strong> ${escapeHtml(error.message)}
            </div>
        `;
        outputDiv.innerHTML += errorHtml;
        return;
    }
    
    isLLMResponding = true;
    updateButtonStates();
    
    // Clear input
    userInput.value = '';
    
    // Get current code from editor
    const currentCode = monacoEditor ? monacoEditor.getValue() : '';
    const activeLanguageBtn = document.querySelector('.language-btn.active');
    const currentLanguage = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
    
    // Call real LLM
    sendLLMMessage(message, currentCode, currentLanguage);
}

// Send message to LLM
async function sendLLMMessage(userMessage, code, language) {
    const outputDiv = document.getElementById('markdown-output');
    
    // Clear output and show loading indicator
    outputDiv.innerHTML = `
        <div class="llm-thinking">
            <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>Thinking...</p>
        </div>
    `;
    
    // Save to LLM chat history
    saveLLMChatMessage(currentProject, 'user', userMessage);
    
    // Scroll to bottom
    outputDiv.scrollTop = outputDiv.scrollHeight;
    
    try {
        // Create abort controller for this request
        currentAbortController = new AbortController();
        
        // Get LLM instance
        const llmInstance = llm._get();
        
        // Get chat history
        const chatHistory = getLLMChatHistory(currentProject);
        
        // Call LLM
        const response = await llmInstance.chat(chatHistory);
        
        // Check if request was aborted
        if (currentAbortController.signal.aborted) {
            return;
        }
        
        // Parse markdown to HTML
        let parsedContent = response;
        try {
            if (typeof marked !== 'undefined') {
                parsedContent = marked.parse ? marked.parse(response) : marked(response);
            } else {
                console.warn('marked.js not available, using simple parser');
                parsedContent = simpleMarkdownParse(response);
            }
        } catch (e) {
            console.error('Error parsing markdown:', e);
            parsedContent = simpleMarkdownParse(response);
        }
        
        // Add assistant message to output
        const assistantMessageHtml = `
            <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                ${parsedContent}
            </div>
        `;
        
        outputDiv.innerHTML = assistantMessageHtml;
        
        // Render math expressions with KaTeX
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(outputDiv, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
        
        // Save to LLM chat history
        saveLLMChatMessage(currentProject, 'assistant', response);
        
        // Scroll to bottom
        outputDiv.scrollTop = outputDiv.scrollHeight;
        
    } catch (error) {
        console.error('LLM Error:', error);
        
        // Check if request was aborted
        if (currentAbortController && currentAbortController.signal.aborted) {
            const stoppedHtml = `
                <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px; border-left: 3px solid orange;">
                    <em>Response stopped by user.</em>
                </div>
            `;
            outputDiv.innerHTML = stoppedHtml;
        } else {
            const errorHtml = `
                <div style="background: #f44336; color: white; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                    <strong>Error:</strong> ${escapeHtml(error.message)}
                </div>
            `;
            outputDiv.innerHTML = errorHtml;
        }
    } finally {
        isLLMResponding = false;
        updateButtonStates();
        currentAbortController = null;
    }
}

// Handle stop message
function handleStopMessage() {
    if (currentAbortController) {
        currentAbortController.abort();
    }
    isLLMResponding = false;
    updateButtonStates();
}

// Handle clear output
function handleClearOutput() {
    document.getElementById('markdown-output').innerHTML = '';
    // Clear the LLM chat history
    if (currentProject) {
        clearLLMChatHistory(currentProject);
    }
}

// Handle sidebar toggle
function handleSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    isSidebarCollapsed = !isSidebarCollapsed;
    
    if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
    
    // Save sidebar state using storage
    storage.set('preferences:sidebarCollapsed', isSidebarCollapsed);
    
    // Trigger Monaco Editor layout update after animation
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 300);
}

// Handle sidebar expand
function handleSidebarExpand() {
    const sidebar = document.getElementById('sidebar');
    isSidebarCollapsed = false;
    sidebar.classList.remove('collapsed');
    
    // Save sidebar state using storage
    storage.set('preferences:sidebarCollapsed', false);
    
    // Trigger Monaco Editor layout update after animation
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 300);
}

// Helper function to get all project IDs with metadata
function getAllProjectIds() {
    // Get the list of all registered project IDs
    // We maintain a master list of project IDs in storage
    const projectIds = storage.get('meta:projectIds') || [];
    return projectIds.filter(id => id && id !== 'null');
}

// Helper function to register a project ID
function registerProjectId(projectId) {
    if (!projectId || projectId === 'null') return;
    
    const projectIds = storage.get('meta:projectIds') || [];
    if (!projectIds.includes(projectId)) {
        projectIds.push(projectId);
        storage.set('meta:projectIds', projectIds);
    }
}

// Handle refresh projects
function handleRefreshProjects() {
    const refreshBtn = document.getElementById('refresh-projects');
    
    // Add spinning animation
    refreshBtn.classList.add('spinning');
    
    // Get all project IDs
    const projectIds = getAllProjectIds();
    const projects = [];
    
    // Build projects array from metadata
    for (const projectId of projectIds) {
        const metadata = storage.get(`project:${projectId}:metadata`);
        if (metadata) {
            projects.push({ 
                id: projectId, 
                name: metadata.name || projectId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                difficulty: metadata.difficulty || 'medium',
                lastAccessed: metadata.lastAccessed
            });
        }
    }
    
    // Sort by lastAccessed (most recent first)
    projects.sort((a, b) => {
        const dateA = a.lastAccessed ? new Date(a.lastAccessed) : new Date(0);
        const dateB = b.lastAccessed ? new Date(b.lastAccessed) : new Date(0);
        return dateB - dateA;
    });
    
    // Rebuild project list UI
    populateProjectListUI(projects);
    
    // Remove spinning class after animation completes
    setTimeout(() => {
        refreshBtn.classList.remove('spinning');
    }, 600);
    
    console.log('[Refresh] Project list refreshed with', projects.length, 'projects');
}

// Populate project list UI
function populateProjectListUI(projects) {
    const projectList = document.querySelector('.project-list');
    if (!projectList) return;
    
    // Remember current active project
    const activeProject = currentProject;
    
    // Clear existing list
    projectList.innerHTML = '';
    
    // Add projects
    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        if (project.id === activeProject) {
            projectItem.classList.add('active');
        }
        projectItem.setAttribute('data-project', project.id);
        
        const projectName = document.createElement('span');
        projectName.className = 'project-name';
        projectName.textContent = project.name;
        
        const projectInfo = document.createElement('div');
        projectInfo.className = 'project-info';
        
        const projectDifficulty = document.createElement('span');
        projectDifficulty.className = `project-difficulty ${project.difficulty}`;
        projectDifficulty.textContent = project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'project-delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Delete project';
        deleteBtn.setAttribute('data-project-id', project.id);
        deleteBtn.setAttribute('data-project-name', project.name);
        
        // Attach delete handler
        deleteBtn.addEventListener('click', handleDeleteProjectClick);
        
        projectInfo.appendChild(projectDifficulty);
        projectInfo.appendChild(deleteBtn);
        
        projectItem.appendChild(projectName);
        projectItem.appendChild(projectInfo);
        
        // Re-attach click handler
        projectItem.addEventListener('click', handleProjectClick);
        
        projectList.appendChild(projectItem);
    });
    
    // Update help button blinking state
    updateHelpButtonBlinkState(projects.length === 0);
}

// Update help button blink state based on whether there are projects
function updateHelpButtonBlinkState(shouldBlink) {
    const helpBtn = document.getElementById('chat-help-btn');
    if (helpBtn) {
        if (shouldBlink) {
            helpBtn.classList.add('blink');
        } else {
            helpBtn.classList.remove('blink');
        }
    }
}

// Update button states
function updateButtonStates() {
    const sendBtn = document.getElementById('send-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    sendBtn.disabled = isLLMResponding;
    stopBtn.disabled = !isLLMResponding;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle window resize for Monaco Editor
window.addEventListener('resize', function() {
    if (monacoEditor) {
        // Delay layout update to ensure smooth resize
        setTimeout(() => {
            monacoEditor.layout();
        }, 100);
    }
});

// Handle panel collapse/expand
function handlePanelCollapse(panelType) {
    // Don't collapse if any panel is maximized
    if (maximizedPanel) return;
    
    const panels = {
        editor: document.querySelector('.editor-panel'),
        output: document.querySelector('.output-panel'),
        input: document.querySelector('.input-panel')
    };
    
    const panel = panels[panelType];
    if (!panel) return;
    
    const state = panelStates[panelType];
    
    if (state.collapsed) {
        // Expand panel
        panel.classList.remove('panel-collapsed');
        
        // For input panel, clear inline height style to let it use flex: 1
        if (panelType === 'input') {
            panel.style.height = '';
        } else if (state.originalHeight) {
            // Restore original height for editor and output panels
            panel.style.height = state.originalHeight;
        }
        
        state.collapsed = false;
    } else {
        // Collapse panel
        // Save current height before collapsing (not needed for input panel since it uses flex)
        if (panelType !== 'input') {
            const currentHeight = panel.offsetHeight;
            state.originalHeight = currentHeight + 'px';
        }
        
        panel.classList.add('panel-collapsed');
        state.collapsed = true;
    }
    
    // Trigger Monaco Editor layout update after animation
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 300);
}

// Handle maximize panel
function handleMaximizePanel(panelType) {
    const editorPanel = document.querySelector('.editor-panel');
    const outputPanel = document.querySelector('.output-panel');
    const inputPanel = document.querySelector('.input-panel');
    
    let targetPanel;
    if (panelType === 'editor') {
        targetPanel = editorPanel;
    } else if (panelType === 'output') {
        targetPanel = outputPanel;
    } else if (panelType === 'input') {
        targetPanel = inputPanel;
    }
    
    // Toggle maximized state
    if (targetPanel.classList.contains('maximized')) {
        // Restore
        targetPanel.classList.remove('maximized');
        maximizedPanel = null;
    } else {
        // Maximize - first remove from any other panel
        editorPanel.classList.remove('maximized');
        outputPanel.classList.remove('maximized');
        inputPanel.classList.remove('maximized');
        
        // Then maximize the target panel
        targetPanel.classList.add('maximized');
        maximizedPanel = panelType;
    }
    
    // Trigger Monaco Editor layout update after animation
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 100);
}

// Auto-collapse sidebar on small screens
window.addEventListener('resize', function() {
    const isSmallScreen = window.innerWidth < 768;
    const sidebar = document.getElementById('sidebar');
    
    if (isSmallScreen && !isSidebarCollapsed) {
        // Auto-collapse on small screens
        handleSidebarToggle();
    }
});

// Panel Resizing Functionality
function initPanelResize() {
    const resizeHandles = document.querySelectorAll('.resize-handle');
    
    resizeHandles.forEach(handle => {
        let isResizing = false;
        let startY = 0;
        let startHeight1 = 0;
        let startHeight2 = 0;
        let panel1, panel2;
        
        handle.addEventListener('mousedown', (e) => {
            // Don't resize if any panel is maximized
            if (maximizedPanel) return;
            
            isResizing = true;
            startY = e.clientY;
            
            const resizeType = handle.getAttribute('data-resize');
            
            if (resizeType === 'editor-output') {
                panel1 = document.querySelector('.editor-panel');
                panel2 = document.querySelector('.output-panel');
            } else if (resizeType === 'output-input') {
                panel1 = document.querySelector('.output-panel');
                panel2 = document.querySelector('.input-panel');
            }
            
            startHeight1 = panel1.offsetHeight;
            startHeight2 = panel2.offsetHeight;
            
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const deltaY = e.clientY - startY;
            const newHeight1 = startHeight1 + deltaY;
            const newHeight2 = startHeight2 - deltaY;
            
            // Check minimum heights
            if (newHeight1 >= 100 && newHeight2 >= 100) {
                panel1.style.height = newHeight1 + 'px';
                panel2.style.height = newHeight2 + 'px';
                
                // Trigger Monaco Editor layout update
                if (monacoEditor && panel1.classList.contains('editor-panel')) {
                    monacoEditor.layout();
                }
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                
                // Save panel heights to storage
                const editorPanel = document.querySelector('.editor-panel');
                const outputPanel = document.querySelector('.output-panel');
                const inputPanel = document.querySelector('.input-panel');
                
                storage.set('preferences:panelHeights', {
                    editor: editorPanel.offsetHeight,
                    output: outputPanel.offsetHeight,
                    input: inputPanel.offsetHeight
                });
            }
        });
    });
}

// Initialize resize functionality after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPanelResize);
} else {
    initPanelResize();
}

// Load chat history for a project
function loadChatHistory(projectId) {
    const outputDiv = document.getElementById('markdown-output');
    
    // Get LLM chat history
    const llmHistory = getLLMChatHistory(projectId);
    
    if (llmHistory.length === 0) {
        outputDiv.innerHTML = '';
        return;
    }
    
    // Find the last assistant message
    let lastAssistantMessage = null;
    
    // Iterate backwards to find the last assistant message
    for (let i = llmHistory.length - 1; i >= 0; i--) {
        if (llmHistory[i].role === 'assistant') {
            lastAssistantMessage = llmHistory[i].content;
            break;
        }
    }
    
    // Build the HTML output
    let html = '';
    
    if (lastAssistantMessage) {
        // Parse markdown to HTML
        let parsedContent = lastAssistantMessage;
        try {
            if (typeof marked !== 'undefined') {
                parsedContent = marked.parse ? marked.parse(lastAssistantMessage) : marked(lastAssistantMessage);
            } else {
                parsedContent = simpleMarkdownParse(lastAssistantMessage);
            }
        } catch (e) {
            console.error('Error parsing markdown:', e);
            parsedContent = simpleMarkdownParse(lastAssistantMessage);
        }
        
        html += `
            <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                ${parsedContent}
            </div>
        `;
    }
    
    outputDiv.innerHTML = html;
    
    // Render math expressions with KaTeX
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(outputDiv, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

// Get LLM chat history (role/content format for LLM API)
function getLLMChatHistory(projectId) {
    const history = storage.get(`project:${projectId}:llmChatHistory`) || [];
    return history;
}

// Make system prompt for LLM.
function makeLLMSystemPrompt(projectId) {
    let prompt = "You are LeetPrep Coach, a friendly conversational interview coach that helps users solve LeetCode questions step-by-step. Behave like a technical mentor tutoring software engineers.\nFollow this multi-turn workflow every time:\n\n1. Pick a random LeetCode problem. Provide: • Problem number and title\n• Quick statement\n• A link to a reference site\n\n\n2. Wait for user confirmation before moving forward.\n\n\n3. Guide them through structured steps:\n\n\n\nStep 1: Understand the problem\n\nStep 2: Example input/output\n\nStep 3: Ask the user to restate the goal\n\nStep 4: Time + space complexity discussion\n\nStep 5: Coding\n\nStep 6: Interview-style review & feedback\n\n4. Always ask questions to encourage user participation. Do not complete full solutions before they attempt.\n\n\n\nStyle rules:\n\nFriendly, energetic tone with emojis\n\nUse bullet points and short paragraphs\n\nOccasionally promote coaching services (fictional placeholder URLs OK)\n\nAcknowledge and reinforce correct reasoning\n\nHelp fix mistakes gently with guiding questions\n\nAlways continue the session until the user explicitly ends the interaction.\nAlways remember the conversation context.";
    prompt += "\n\nCurrent Project ID: " + projectId;
    prompt += "\nMetadata: " + JSON.stringify(storage.get(`project:${projectId}:metadata`) || {});
    return prompt;
}

// Save message to LLM chat history
function saveLLMChatMessage(projectId, role, content) {
    const history = getLLMChatHistory(projectId);

    if (history.length === 0 && role !== 'system') {
        // Add system prompt at the beginning if history is empty
        const systemPrompt = makeLLMSystemPrompt(projectId);
        history.push({ role: 'system', content: systemPrompt });
    }

    history.push({ role, content });
    storage.set(`project:${projectId}:llmChatHistory`, history);
}

// Clear LLM chat history
function clearLLMChatHistory(projectId) {
    storage.remove(`project:${projectId}:llmChatHistory`);
}

// Update project metadata
function updateProjectMetadata(projectId) {
    // Register the project ID
    registerProjectId(projectId);
    
    const metadata = storage.get(`project:${projectId}:metadata`) || {};
    metadata.lastAccessed = new Date().toISOString();
    if (!metadata.firstAccessed) {
        metadata.firstAccessed = metadata.lastAccessed;
    }
    
    // Add project name and difficulty from config
    if (projectConfig[projectId]) {
        metadata.name = projectConfig[projectId].name;
        metadata.difficulty = projectConfig[projectId].difficulty;
    }
    
    storage.set(`project:${projectId}:metadata`, metadata);
}

// Mark project as completed
function markProjectCompleted(projectId, completed = true) {
    const metadata = storage.get(`project:${projectId}:metadata`) || {};
    metadata.completed = completed;
    metadata.completedAt = completed ? new Date().toISOString() : null;
    storage.set(`project:${projectId}:metadata`, metadata);
}

// Get project statistics
function getProjectStats(projectId) {
    const metadata = storage.get(`project:${projectId}:metadata`) || {};
    // Get the count of chat messages from LLM chat history
    const llmHistory = getLLMChatHistory(projectId);
    const chatMessageCount = llmHistory.length;
    
    return {
        lastAccessed: metadata.lastAccessed,
        firstAccessed: metadata.firstAccessed,
        completed: metadata.completed || false,
        completedAt: metadata.completedAt,
        chatMessageCount: chatMessageCount
    };
}

// Handle add project button click
function handleAddProjectClick() {
    const dialogOverlay = document.getElementById('project-dialog-overlay');
    const dialogInput = document.getElementById('project-dialog-input');
    
    // Clear previous input
    dialogInput.value = '';
    
    // Reset dialog state
    isDialogLLMResponding = false;
    updateDialogButtonStates();
    
    // Show dialog
    dialogOverlay.classList.add('active');
    
    // Focus on textarea
    setTimeout(() => dialogInput.focus(), 100);
}

// Handle close dialog
function handleCloseDialog() {
    // Stop any ongoing LLM request
    if (dialogAbortController) {
        dialogAbortController.abort();
        dialogAbortController = null;
    }
    
    isDialogLLMResponding = false;
    updateDialogButtonStates();
    
    const dialogOverlay = document.getElementById('project-dialog-overlay');
    dialogOverlay.classList.remove('active');
}

// Handle dialog send button
async function handleDialogSend() {
    const dialogInput = document.getElementById('project-dialog-input');
    const message = dialogInput.value.trim();
    
    if (!message) {
        alert('Please enter project details');
        return;
    }
    
    // Check if LLM is configured
    try {
        llm._get();
    } catch (error) {
        alert(error.message);
        return;
    }
    
    // Set responding state
    isDialogLLMResponding = true;
    updateDialogButtonStates();
    
    // Add to LLM output
    const outputDiv = document.getElementById('markdown-output');
    const dialogMessageHtml = `
        <div style="background: var(--accent-color); color: var(--accent-text); padding: 8px 12px; border-radius: 6px; margin-bottom: 16px;">
            <strong>New Project Request:</strong> ${escapeHtml(message)}
        </div>
    `;
    outputDiv.innerHTML += dialogMessageHtml;
    
    // Show loading indicator
    const loadingHtml = `
        <div class="llm-thinking">
            <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>Creating project...</p>
        </div>
    `;
    outputDiv.innerHTML += loadingHtml;
    outputDiv.scrollTop = outputDiv.scrollHeight;
    
    try {
        // Create abort controller for this request
        dialogAbortController = new AbortController();
        
        // Get LLM instance
        const llmInstance = llm._get();
        
        // Build prompt for structured project creation
        const prompt = `You are a helpful assistant that helps create LeetCode-style coding projects. Based on the user's request, generate a project with the following information:

User request: "${message}"

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just the JSON):
{
  "name": "Problem Name",
  "difficulty": "Easy|Medium|Hard",
  "pythonCode": "Python boilerplate code here",
  "csharpCode": "C# boilerplate code here"
}

Guidelines:
- name: Should be a clear, concise problem name (e.g., "Two Sum", "Reverse Linked List")
- difficulty: Must be exactly one of: Easy, Medium, or Hard
- pythonCode: Complete Python function/class template with docstrings and proper formatting
- csharpCode: Complete C# class/method template with proper formatting
- Both code templates should include comments indicating where the solution should be written
- Make the boilerplate code appropriate for the problem difficulty and type

Return ONLY the JSON object, nothing else.`;
        
        // Call LLM
        const response = await llmInstance.answer(prompt);
        
        // Check if request was aborted
        if (dialogAbortController.signal.aborted) {
            return;
        }
        
        // Parse the JSON response
        const projectData = parseProjectJSON(response);
        
        if (!projectData) {
            throw new Error('Failed to parse project data from LLM response');
        }
        
        // Create the project
        const projectId = createProjectFromData(projectData);
        
        // Show success message
        const successHtml = `
            <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; border-left: 3px solid #4caf50; margin-bottom: 16px;">
                <strong style="color: #4caf50;">Success!</strong>
                <p>Created project: <strong>${escapeHtml(projectData.name)}</strong> [${escapeHtml(projectData.difficulty)}]</p>
            </div>
        `;
        
        // Remove loading indicator
        const thinkingDiv = outputDiv.querySelector('.llm-thinking');
        if (thinkingDiv) {
            thinkingDiv.remove();
        }
        
        outputDiv.innerHTML += successHtml;
        outputDiv.scrollTop = outputDiv.scrollHeight;
        
        // Refresh project list
        handleRefreshProjects();
        
        // Select and load the new project
        setTimeout(() => {
            const projectItem = document.querySelector(`.project-item[data-project="${projectId}"]`);
            if (projectItem) {
                projectItem.click();
            }
        }, 100);
        
        // Clear and close dialog
        dialogInput.value = '';
        handleCloseDialog();
        
    } catch (error) {
        console.error('Dialog LLM Error:', error);
        
        // Remove loading indicator
        const thinkingDiv = outputDiv.querySelector('.llm-thinking');
        if (thinkingDiv) {
            thinkingDiv.remove();
        }
        
        // Check if request was aborted
        if (!dialogAbortController || !dialogAbortController.signal.aborted) {
            const errorHtml = `
                <div style="background: #f44336; color: white; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                    <strong>Error:</strong> ${escapeHtml(error.message)}
                </div>
            `;
            outputDiv.innerHTML += errorHtml;
            outputDiv.scrollTop = outputDiv.scrollHeight;
            
            alert(`Error creating project: ${error.message}`);
        }
    } finally {
        isDialogLLMResponding = false;
        updateDialogButtonStates();
        dialogAbortController = null;
    }
}

// Handle dialog stop button
function handleDialogStop() {
    // Abort the current request
    if (dialogAbortController) {
        dialogAbortController.abort();
        dialogAbortController = null;
    }
    
    isDialogLLMResponding = false;
    updateDialogButtonStates();
}

// Handle dialog random button
async function handleDialogRandom() {
    const dialogInput = document.getElementById('project-dialog-input');
    const hint = dialogInput.value.trim();
    
    // Check if LLM is configured
    try {
        llm._get();
    } catch (error) {
        alert(error.message);
        return;
    }
    
    // Set responding state
    isDialogLLMResponding = true;
    updateDialogButtonStates();
    
    try {
        // Create abort controller for this request
        dialogAbortController = new AbortController();
        
        // Get LLM instance
        const llmInstance = llm._get();
        
        // Build prompt based on hint
        let prompt = "You are a helpful assistant that suggests LeetCode problems. ";
        if (hint) {
            prompt += `Based on this hint: "${hint}", suggest a random LeetCode problem. `;
        } else {
            prompt += "Suggest a random LeetCode problem. ";
        }
        prompt += "Return ONLY the problem in this exact format: '<number>. <name> [<difficulty>]' where difficulty is Easy, Medium, or Hard. Example: '1. Two Sum [Easy]' or '42. Trapping Rain Water [Hard]'. Do not include any other text.";
        
        // Call LLM
        const response = await llmInstance.answer(prompt);
        
        // Check if request was aborted
        if (dialogAbortController.signal.aborted) {
            return;
        }
        
        // Extract the problem info from response (clean up any extra text)
        const cleanedResponse = response.trim().split('\n')[0]; // Take first line only
        
        // Set the response in the input
        dialogInput.value = cleanedResponse;
        
    } catch (error) {
        console.error('Dialog LLM Error:', error);
        
        // Check if request was aborted
        if (!dialogAbortController || !dialogAbortController.signal.aborted) {
            alert(`Error getting random problem: ${error.message}`);
        }
    } finally {
        isDialogLLMResponding = false;
        updateDialogButtonStates();
        dialogAbortController = null;
    }
}

// Handle delete project button click
let projectToDelete = null;

function handleDeleteProjectClick(event) {
    event.stopPropagation(); // Prevent project selection when clicking delete
    
    const deleteBtn = event.currentTarget;
    const projectId = deleteBtn.getAttribute('data-project-id');
    const projectName = deleteBtn.getAttribute('data-project-name');
    
    // Store project to delete
    projectToDelete = projectId;
    
    // Update dialog content
    const projectNameElement = document.getElementById('delete-dialog-project-name');
    projectNameElement.textContent = projectName;
    
    // Show delete dialog
    const deleteDialogOverlay = document.getElementById('delete-dialog-overlay');
    deleteDialogOverlay.classList.add('active');
}

// Handle close delete dialog
function handleCloseDeleteDialog() {
    const deleteDialogOverlay = document.getElementById('delete-dialog-overlay');
    deleteDialogOverlay.classList.remove('active');
    projectToDelete = null;
}

// Handle confirm delete
function handleConfirmDelete() {
    if (!projectToDelete) return;
    
    // Delete project from storage
    deleteProject(projectToDelete);
    
    // Close dialog
    handleCloseDeleteDialog();
    
    // Refresh project list
    handleRefreshProjects();
    
    // If the deleted project was active, clear the editor
    if (currentProject === projectToDelete) {
        currentProject = null;
        if (monacoEditor) {
            monacoEditor.setValue('');
        }
        document.getElementById('markdown-output').innerHTML = '';
        
        // Deselect all projects
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
    }
}

// Delete project from storage
function deleteProject(projectId) {
    if (!projectId || projectId === 'null') return;
    
    console.log(`[Delete] Deleting project: ${projectId}`);
    
    // Get all project IDs
    const projectIds = storage.get('meta:projectIds') || [];
    
    // Remove from project list
    const updatedProjectIds = projectIds.filter(id => id !== projectId);
    storage.set('meta:projectIds', updatedProjectIds);
    
    // Delete all project-related data
    storage.remove(`project:${projectId}:metadata`);
    storage.remove(`project:${projectId}:llmChatHistory`);
    
    // Delete code for all languages
    const languages = ['python', 'csharp', 'javascript', 'java', 'cpp'];
    languages.forEach(lang => {
        storage.remove(`project:${projectId}:${lang}:code`);
        storage.remove(`project:${projectId}:${lang}:lastSave`);
    });
    
    console.log(`[Delete] Project ${projectId} deleted successfully`);
}

// ===== CLARIFY DIALOG HANDLERS =====
let clarifyChatHistory = [];
let isClarifyResponding = false;
let clarifyAbortController = null;

// Handle clarify button click
function handleClarifyClick() {
    const clarifyDialogOverlay = document.getElementById('clarify-dialog-overlay');
    clarifyDialogOverlay.classList.add('active');
    
    // Load previous chat history without system messages into temporary chat history
    if (currentProject) {
        const mainHistory = getLLMChatHistory(currentProject);
        // Filter out system messages and copy to clarify history
        clarifyChatHistory = mainHistory.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        // Display the loaded history
        displayClarifyHistory();
    }
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('clarify-input').focus();
    }, 100);
}

// Handle close clarify dialog
function handleCloseClarifyDialog() {
    const clarifyDialogOverlay = document.getElementById('clarify-dialog-overlay');
    clarifyDialogOverlay.classList.remove('active');
    
    // Dispose of temporary chat history
    clarifyChatHistory = [];
    
    // Cancel any ongoing request
    if (clarifyAbortController) {
        clarifyAbortController.abort();
        clarifyAbortController = null;
    }
    
    // Reset responding state
    isClarifyResponding = false;
    updateClarifyButtonStates();
    
    // Clear the display
    const chatHistoryDiv = document.getElementById('clarify-chat-history');
    chatHistoryDiv.innerHTML = `
        <div class="clarify-welcome">
            <p>Ask questions to clarify the LLM output. This chat is independent from the main conversation.</p>
        </div>
    `;
}

// Handle clarify send
async function handleClarifySend() {
    const clarifyInput = document.getElementById('clarify-input');
    const message = clarifyInput.value.trim();
    
    if (!message) {
        return;
    }
    
    // Check if LLM is configured
    try {
        llm._get();
    } catch (error) {
        alert(error.message);
        return;
    }
    
    // Disable send button and enable stop button
    isClarifyResponding = true;
    updateClarifyButtonStates();
    
    // Add user message to chat history
    addClarifyMessage('user', message);
    
    // Clear input
    clarifyInput.value = '';
    
    // Send to LLM
    await sendClarifyLLMMessage(message);
}

// Send message to LLM for clarify dialog
async function sendClarifyLLMMessage(userMessage) {
    try {
        // Create abort controller for this request
        clarifyAbortController = new AbortController();
        
        // Get LLM instance
        const llmInstance = llm._get();
        
        // Call LLM with current clarify chat history
        const response = await llmInstance.chat(clarifyChatHistory);
        
        // Check if request was aborted
        if (clarifyAbortController.signal.aborted) {
            return;
        }
        
        // Add assistant response
        isClarifyResponding = false;
        updateClarifyButtonStates();
        addClarifyMessage('assistant', response);
        
    } catch (error) {
        console.error('Clarify LLM Error:', error);
        
        isClarifyResponding = false;
        updateClarifyButtonStates();
        
        // Check if request was aborted
        if (clarifyAbortController && clarifyAbortController.signal.aborted) {
            addClarifyMessage('assistant', '(Response stopped by user)', true);
        } else {
            addClarifyMessage('assistant', `Error: ${error.message}`, true);
        }
    } finally {
        clarifyAbortController = null;
    }
}

// Handle clarify stop
function handleClarifyStop() {
    // Abort the current request
    if (clarifyAbortController) {
        clarifyAbortController.abort();
        clarifyAbortController = null;
    }
    
    isClarifyResponding = false;
    updateClarifyButtonStates();
    
    // Add stopped message
    addClarifyMessage('assistant', '(Response stopped by user)', true);
}

// Handle clear clarify history
function handleClarifyClearHistory() {
    if (clarifyChatHistory.length === 0) return;
    
    if (confirm('Clear all chat history in this dialog?')) {
        clarifyChatHistory = [];
        const chatHistoryDiv = document.getElementById('clarify-chat-history');
        chatHistoryDiv.innerHTML = `
            <div class="clarify-welcome">
                <p>Ask questions to clarify the LLM output. This chat is independent from the main conversation.</p>
            </div>
        `;
    }
}

// Display clarify history
function displayClarifyHistory() {
    const chatHistoryDiv = document.getElementById('clarify-chat-history');
    
    // Clear existing content
    chatHistoryDiv.innerHTML = '';
    
    if (clarifyChatHistory.length === 0) {
        chatHistoryDiv.innerHTML = `
            <div class="clarify-welcome">
                <p>Ask questions to clarify the LLM output. This chat is independent from the main conversation.</p>
            </div>
        `;
        return;
    }
    
    // Display each message
    clarifyChatHistory.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `clarify-message ${msg.role}`;
        
        const roleLabel = msg.role === 'user' ? 'You' : 'Assistant';
        let messageContent = msg.content;
        
        // Parse markdown for assistant messages
        if (msg.role === 'assistant') {
            try {
                if (typeof marked !== 'undefined') {
                    messageContent = marked.parse ? marked.parse(msg.content) : marked(msg.content);
                } else {
                    messageContent = simpleMarkdownParse(msg.content);
                }
            } catch (e) {
                console.error('Error parsing markdown:', e);
                messageContent = simpleMarkdownParse(msg.content);
            }
        } else {
            messageContent = escapeHtml(msg.content);
        }
        
        messageDiv.innerHTML = `
            <strong>${roleLabel}</strong>
            <p>${messageContent}</p>
        `;
        
        // Render math expressions with KaTeX for assistant messages
        if (msg.role === 'assistant' && typeof renderMathInElement !== 'undefined') {
            renderMathInElement(messageDiv, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
        
        chatHistoryDiv.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

// Add message to clarify chat
function addClarifyMessage(role, content, isSystemMessage = false) {
    const chatHistoryDiv = document.getElementById('clarify-chat-history');
    
    // Remove welcome message if it exists
    const welcomeMsg = chatHistoryDiv.querySelector('.clarify-welcome');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `clarify-message ${role}`;
    
    if (isSystemMessage) {
        messageDiv.innerHTML = `<p style="font-style: italic; opacity: 0.8;">${escapeHtml(content)}</p>`;
    } else {
        const roleLabel = role === 'user' ? 'You' : 'Assistant';
        let messageContent = content;
        
        // Parse markdown for assistant messages
        if (role === 'assistant') {
            try {
                if (typeof marked !== 'undefined') {
                    messageContent = marked.parse ? marked.parse(content) : marked(content);
                } else {
                    messageContent = simpleMarkdownParse(content);
                }
            } catch (e) {
                console.error('Error parsing markdown:', e);
                messageContent = simpleMarkdownParse(content);
            }
        } else {
            messageContent = escapeHtml(content);
        }
        
        messageDiv.innerHTML = `
            <strong>${roleLabel}</strong>
            <p>${messageContent}</p>
        `;
        
        // Render math expressions with KaTeX for assistant messages
        if (role === 'assistant' && typeof renderMathInElement !== 'undefined') {
            renderMathInElement(messageDiv, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    }
    
    chatHistoryDiv.appendChild(messageDiv);
    
    // Store in history
    if (!isSystemMessage) {
        clarifyChatHistory.push({ role, content });
    }
    
    // Scroll to bottom
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

// Update clarify button states
function updateClarifyButtonStates() {
    const sendBtn = document.getElementById('clarify-send-btn');
    const stopBtn = document.getElementById('clarify-stop-btn');
    
    if (isClarifyResponding) {
        sendBtn.disabled = true;
        stopBtn.disabled = false;
        stopBtn.classList.add('responding');
    } else {
        sendBtn.disabled = false;
        stopBtn.disabled = true;
        stopBtn.classList.remove('responding');
    }
}

// Update dialog button states
function updateDialogButtonStates() {
    const stopBtn = document.getElementById('dialog-stop-btn');
    const randomBtn = document.getElementById('dialog-random-btn');
    
    if (isDialogLLMResponding) {
        stopBtn.disabled = false;
        stopBtn.classList.add('responding');
        randomBtn.disabled = true;
    } else {
        stopBtn.disabled = true;
        stopBtn.classList.remove('responding');
        randomBtn.disabled = false;
    }
}

// Parse project JSON from LLM response with forgiveness
function parseProjectJSON(response) {
    try {
        // Remove markdown code blocks if present
        let cleanedResponse = response.trim();
        
        // Remove ```json or ``` markers
        cleanedResponse = cleanedResponse.replace(/^```json?\s*/i, '');
        cleanedResponse = cleanedResponse.replace(/\s*```\s*$/, '');
        cleanedResponse = cleanedResponse.trim();
        
        // Try to find JSON object in the response
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResponse = jsonMatch[0];
        }
        
        // Parse the JSON
        const data = JSON.parse(cleanedResponse);
        
        // Validate required fields
        if (!data.name || typeof data.name !== 'string') {
            throw new Error('Missing or invalid "name" field');
        }
        
        if (!data.difficulty || !['Easy', 'Medium', 'Hard'].includes(data.difficulty)) {
            // Try to fix common variations
            const diffLower = (data.difficulty || '').toLowerCase();
            if (diffLower === 'easy') data.difficulty = 'Easy';
            else if (diffLower === 'medium') data.difficulty = 'Medium';
            else if (diffLower === 'hard') data.difficulty = 'Hard';
            else {
                // Default to Medium if invalid
                console.warn('Invalid difficulty, defaulting to Medium');
                data.difficulty = 'Medium';
            }
        }
        
        // Ensure code fields exist (use defaults if missing)
        if (!data.pythonCode || typeof data.pythonCode !== 'string') {
            console.warn('Missing pythonCode, using default template');
            data.pythonCode = `def solution():\n    """\n    ${data.name}\n    """\n    # Your solution here\n    pass`;
        }
        
        if (!data.csharpCode || typeof data.csharpCode !== 'string') {
            console.warn('Missing csharpCode, using default template');
            data.csharpCode = `public class Solution {\n    // ${data.name}\n    public void Solve() {\n        // Your solution here\n        \n    }\n}`;
        }
        
        return {
            name: data.name.trim(),
            difficulty: data.difficulty,
            pythonCode: data.pythonCode,
            csharpCode: data.csharpCode
        };
        
    } catch (error) {
        console.error('Error parsing project JSON:', error);
        console.error('Response was:', response);
        return null;
    }
}

// Create project from parsed data
function createProjectFromData(projectData) {
    // Generate project ID from name
    const projectId = projectData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    
    // Check if project already exists
    const existingIds = getAllProjectIds();
    let finalProjectId = projectId;
    let counter = 1;
    while (existingIds.includes(finalProjectId)) {
        finalProjectId = `${projectId}-${counter}`;
        counter++;
    }
    
    // Register the project
    registerProjectId(finalProjectId);
    
    // Store project metadata
    const metadata = {
        name: projectData.name,
        difficulty: projectData.difficulty.toLowerCase(),
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        completed: false
    };
    storage.set(`project:${finalProjectId}:metadata`, metadata);
    
    // Store boilerplate code for both languages
    storage.set(`project:${finalProjectId}:python:code`, projectData.pythonCode);
    storage.set(`project:${finalProjectId}:csharp:code`, projectData.csharpCode);
    
    // Initialize empty chat history
    storage.set(`project:${finalProjectId}:llmChatHistory`, []);
    
    console.log(`[Project Created] ${finalProjectId}:`, metadata);
    
    return finalProjectId;
}

// Simulate dialog response
function simulateDialogResponse(message) {
    const outputDiv = document.getElementById('markdown-output');
    
    const responseHtml = `
        <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; border-left: 3px solid var(--accent-color); margin-bottom: 16px;">
            <strong style="color: var(--accent-color);">Assistant:</strong>
            <p>I've received your project request: "${escapeHtml(message)}"</p>
            <p>This feature would allow you to create custom projects. Implementation pending.</p>
        </div>
    `;
    
    outputDiv.innerHTML += responseHtml;
    
    // Scroll to bottom
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

// Handle editor send button click
function handleEditorSendClick() {
    if (!monacoEditor) return;
    
    const code = monacoEditor.getValue();
    const activeLanguageBtn = document.querySelector('.language-btn.active');
    const language = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
    
    if (!code.trim()) {
        alert('Please write some code first');
        return;
    }
    
    // Check if LLM is configured
    try {
        llm._get();
    } catch (error) {
        const outputDiv = document.getElementById('markdown-output');
        const errorHtml = `
            <div style="background: #f44336; color: white; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                <strong>Error:</strong> ${escapeHtml(error.message)}
            </div>
        `;
        outputDiv.innerHTML += errorHtml;
        return;
    }
    
    // Get user input or use default message
    const userInput = document.getElementById('user-input');
    let message = userInput.value.trim();
    
    if (!message) {
        message = "Please review my code and provide feedback.";
    }
    
    // Build the complete message with code included
    const fullMessage = `${message}\n\nHere's my code in ${language}:\n\`\`\`${language}\n${code}\n\`\`\``;
    
    // Clear user input
    userInput.value = '';
    
    // Send to real LLM
    sendLLMMessage(fullMessage, code, language);
}

// Handle open LLM help dialog
function handleOpenLlmHelpDialog() {
    const llmHelpDialogOverlay = document.getElementById('llm-help-dialog-overlay');
    llmHelpDialogOverlay.classList.add('active');
}

// Handle close LLM help dialog
function handleCloseLlmHelpDialog() {
    const llmHelpDialogOverlay = document.getElementById('llm-help-dialog-overlay');
    llmHelpDialogOverlay.classList.remove('active');
}

// Export functions for debugging (optional)
window.LeetCoach = {
    monacoEditor,
    storage,
    loadProject,
    handleThemeChange: (theme) => {
        document.body.setAttribute('data-theme', theme);
        updateMonacoTheme(theme);
    },
    getProjectStats,
    markProjectCompleted,
    // Clear all storage (for debugging)
    clearAllData: () => {
        if (confirm('Are you sure you want to clear all saved data?')) {
            storage.data = {};
            console.log('All data cleared!');
            location.reload();
        }
    },
    // Export current data (for debugging)
    exportData: () => {
        console.log('Current storage data:', storage.data);
        return storage.data;
    },
    // Test markdown rendering
    testMarkdown: () => {
        const testMd = '## Test Header\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n```javascript\nconst x = 5;\n```';
        const outputDiv = document.getElementById('markdown-output');
        
        try {
            let parsed;
            if (typeof marked !== 'undefined') {
                // Use marked.js if available
                parsed = marked.parse ? marked.parse(testMd) : marked(testMd);
                console.log('Using marked.js for parsing');
            } else {
                // Use fallback parser
                console.warn('Marked.js is not loaded, using simple parser fallback');
                parsed = simpleMarkdownParse(testMd);
            }
            
            outputDiv.innerHTML = `<div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px;">${parsed}</div>`;
            console.log('Markdown test successful!');
            console.log('Parsed HTML:', parsed);
        } catch (e) {
            console.error('Markdown test failed:', e);
            outputDiv.innerHTML = `<div style="color: red; padding: 12px;">Error: ${e.message}</div>`;
        }
    }
};