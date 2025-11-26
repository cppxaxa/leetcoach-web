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
    editor: { collapsed: false, originalHeight: null, wasCollapsedBeforeMaximize: false },
    output: { collapsed: false, originalHeight: null, wasCollapsedBeforeMaximize: false },
    input: { collapsed: false, originalHeight: null, wasCollapsedBeforeMaximize: false }
};

// LLM chat state
let currentAbortController = null;
let dialogAbortController = null;
let isDialogLLMResponding = false;
let isDraftInProgress = false;

// Auto-save configuration
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
let autoSaveTimer = null;

// Parse markdown with marked.js
function parseMarkdown(markdown) {
    if (typeof marked !== 'undefined' && marked.parse) {
        try {
            return marked.parse(markdown);
        } catch (e) {
            console.error('marked.js error:', e);
            return simpleMarkdownParse(markdown);
        }
    }
    return simpleMarkdownParse(markdown);
}

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

// Detect if the device is mobile
window.isMobile = function(){
  // Check multiple mobile indicators for comprehensive detection
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for touch support and pointer type
  const hasTouchScreen = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (navigator.msMaxTouchPoints > 0);
  
  // Check hover capability (mobile devices typically can't hover)
  const noHover = window.matchMedia("(any-hover:none)").matches;
  
  // Check pointer coarseness (touch screens have coarse pointers)
  const coarsePointer = window.matchMedia("(pointer:coarse)").matches;
  
  // Check user agent string for mobile patterns
  const mobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
  
  // Check screen width (common mobile breakpoint)
  const narrowScreen = window.matchMedia("(max-width: 768px)").matches;
  
  // Device is mobile if it has touch + (no hover OR coarse pointer OR mobile UA OR narrow screen)
  return hasTouchScreen && (noHover || coarsePointer || mobileUserAgent || narrowScreen);
};

// Theme configurations for Monaco Editor
const monacoThemes = {
    'dark': 'vs-dark',
    'light': 'vs'
};

// Check if currently in mobile view mode (based on user preference)
function isInMobileView() {
    const viewMode = storage.get('setting:view_mode');
    return viewMode === 'mobile';
}

// Helper function to render KaTeX math expressions
function renderKaTeX(element, retryCount = 0) {
    const maxRetries = 50; // Max 5 seconds (50 * 100ms)
    
    // Wait for both katex and auto-render to be loaded
    if (typeof renderMathInElement !== 'undefined') {
        try {
            renderMathInElement(element, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        } catch (e) {
            console.warn('KaTeX rendering error:', e);
        }
    } else if (retryCount < maxRetries) {
        // Wait for KaTeX to load, but with a retry limit
        setTimeout(() => renderKaTeX(element, retryCount + 1), 100);
    } else {
        console.warn('KaTeX failed to load after maximum retries');
    }
}

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

    // Set LLM type from saved preference or default to 'mlcaiwebllm'
    const savedLlmType = storage.get('setting:llm_type') || 'mlcaiwebllm';
    llm.setType(savedLlmType);

    // Update LLM button active state
    document.querySelectorAll('.llm-btn').forEach(btn => {
        if (btn.getAttribute('data-llm-type') === savedLlmType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Initialize view mode from storage or device detection
    let savedViewMode = storage.get('setting:view_mode');
    if (!savedViewMode) {
        // First time - initialize based on device type
        savedViewMode = window.isMobile() ? 'mobile' : 'desktop';
        storage.set('setting:view_mode', savedViewMode);
    }
    
    // Apply the view mode
    applyViewMode(savedViewMode);

    // Update view mode button active state
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        if (btn.getAttribute('data-view-mode') === savedViewMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

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
    
    // Initialize mobile-specific behavior
    initializeMobileMode();
    
    // Initialize default projects on first launch
    initializeDefaultProjects();
    
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
        
        // Auto-load first project if available (after Monaco is ready)
        autoLoadFirstProject();
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

    // Draft button
    const draftBtn = document.getElementById('draft-btn');
    draftBtn.addEventListener('click', handleDraftMessage);

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

    // Pop Out button
    const popOutBtn = document.getElementById('pop-out-btn');
    popOutBtn.addEventListener('click', handlePopOutClick);

    // Dry Run dialog buttons
    const dryRunBtn = document.getElementById('dry-run-btn');
    const dryRunDialogCloseBtn = document.getElementById('dry-run-dialog-close-btn');
    const dryRunEditBtn = document.getElementById('dry-run-edit-btn');
    const dryRunRestartBtn = document.getElementById('dry-run-restart-btn');
    const dryRunRotateBtn = document.getElementById('dry-run-rotate-btn');
    const dryRunMaximizeBtn = document.getElementById('dry-run-maximize-btn');
    const dryRunDialogOverlay = document.getElementById('dry-run-dialog-overlay');
    const dryRunIframe = document.getElementById('dry-run-iframe');

    dryRunBtn.addEventListener('click', handleDryRunClick);
    dryRunDialogCloseBtn.addEventListener('click', handleCloseDryRunDialog);
    dryRunEditBtn.addEventListener('click', handleDryRunEdit);
    dryRunRestartBtn.addEventListener('click', handleDryRunRestart);
    dryRunRotateBtn.addEventListener('click', handleDryRunRotate);
    dryRunMaximizeBtn.addEventListener('click', handleDryRunMaximize);
    
    // Close dry run dialog when clicking overlay
    dryRunDialogOverlay.addEventListener('click', function(e) {
        if (e.target === dryRunDialogOverlay) {
            handleCloseDryRunDialog();
        }
    });

    // Not Implemented dialog buttons
    const notImplementedDialogCloseBtn = document.getElementById('not-implemented-dialog-close-btn');
    const notImplementedOkBtn = document.getElementById('not-implemented-ok-btn');
    const notImplementedDialogOverlay = document.getElementById('not-implemented-dialog-overlay');

    notImplementedDialogCloseBtn.addEventListener('click', handleCloseNotImplementedDialog);
    notImplementedOkBtn.addEventListener('click', handleCloseNotImplementedDialog);
    
    // Close not implemented dialog when clicking overlay
    notImplementedDialogOverlay.addEventListener('click', function(e) {
        if (e.target === notImplementedDialogOverlay) {
            handleCloseNotImplementedDialog();
        }
    });

    // Settings dialog buttons
    const settingsBtn = document.getElementById('settings-btn');
    const settingsDialogCloseBtn = document.getElementById('settings-dialog-close-btn');
    const settingsOkBtn = document.getElementById('settings-ok-btn');
    const settingsCancelBtn = document.getElementById('settings-cancel-btn');
    const settingsDialogOverlay = document.getElementById('settings-dialog-overlay');

    settingsBtn.addEventListener('click', handleOpenSettingsDialog);
    settingsDialogCloseBtn.addEventListener('click', handleCloseSettingsDialog);
    settingsOkBtn.addEventListener('click', handleSaveSettings);
    settingsCancelBtn.addEventListener('click', handleCloseSettingsDialog);
    
    // Close settings dialog when clicking overlay
    settingsDialogOverlay.addEventListener('click', function(e) {
        if (e.target === settingsDialogOverlay) {
            handleCloseSettingsDialog();
        }
    });

    // LLM type selector buttons
    const llmBtns = document.querySelectorAll('.llm-btn');
    llmBtns.forEach(btn => {
        btn.addEventListener('click', handleLlmButtonClick);
    });

    // View mode selector buttons
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', handleViewModeButtonClick);
    });

    // API Keys dialog buttons
    const settingsKeysBtn = document.getElementById('settings-keys-btn');
    const settingsResetLayoutBtn = document.getElementById('settings-reset-layout-btn');
    const keysDialogCloseBtn = document.getElementById('keys-dialog-close-btn');
    const keysSaveBtn = document.getElementById('keys-save-btn');
    const keysCancelBtn = document.getElementById('keys-cancel-btn');
    const keysDialogOverlay = document.getElementById('keys-dialog-overlay');
    const toggleGeminiKeyBtn = document.getElementById('toggle-gemini-key');

    settingsKeysBtn.addEventListener('click', handleOpenKeysDialog);
    settingsResetLayoutBtn.addEventListener('click', handleHardLayoutReset);
    keysDialogCloseBtn.addEventListener('click', handleCloseKeysDialog);
    keysSaveBtn.addEventListener('click', handleSaveKeys);
    keysCancelBtn.addEventListener('click', handleCloseKeysDialog);
    toggleGeminiKeyBtn.addEventListener('click', handleToggleGeminiKeyVisibility);
    
    // Close keys dialog when clicking overlay
    keysDialogOverlay.addEventListener('click', function(e) {
        if (e.target === keysDialogOverlay) {
            handleCloseKeysDialog();
        }
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

    // Library dialog buttons
    const dialogLibraryBtn = document.getElementById('dialog-library-btn');
    const libraryDialogCloseBtn = document.getElementById('library-dialog-close-btn');
    const libraryOpenBtn = document.getElementById('library-open-btn');
    const libraryCancelBtn = document.getElementById('library-cancel-btn');
    const libraryDialogOverlay = document.getElementById('library-dialog-overlay');

    dialogLibraryBtn.addEventListener('click', handleOpenLibraryDialog);
    libraryDialogCloseBtn.addEventListener('click', handleCloseLibraryDialog);
    libraryOpenBtn.addEventListener('click', handleLibraryOpen);
    libraryCancelBtn.addEventListener('click', handleCloseLibraryDialog);
    
    // Close library dialog when clicking overlay
    libraryDialogOverlay.addEventListener('click', function(e) {
        if (e.target === libraryDialogOverlay) {
            handleCloseLibraryDialog();
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
    
    // Auto-collapse sidebar in mobile mode
    if (isInMobileView() && !isSidebarCollapsed) {
        handleSidebarToggle();
    }
    
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
        const parsedContent = parseMarkdown(response);
        console.log('Parsed HTML preview:', parsedContent.substring(0, 500));
        
        // Add assistant message to output
        const assistantMessageHtml = `
            <div class="markdown-content" style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                ${parsedContent}
            </div>
        `;
        
        outputDiv.innerHTML = assistantMessageHtml;
        
        // Render math expressions with KaTeX
        renderKaTeX(outputDiv);
        
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

// Handle draft message
function handleDraftMessage() {
    // Get the last assistant message from LLM chat history
    if (!currentProject) {
        return;
    }
    
    const llmHistory = getLLMChatHistory(currentProject);
    
    // Find the last assistant message
    let lastAssistantMessage = null;
    for (let i = llmHistory.length - 1; i >= 0; i--) {
        if (llmHistory[i].role === 'assistant') {
            lastAssistantMessage = llmHistory[i].content;
            break;
        }
    }
    
    if (!lastAssistantMessage) {
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
    
    isDraftInProgress = true;
    updateButtonStates();
    
    // Create a draft prompt that asks the assistant to answer based on the last output
    const draftPrompt = `Based on the following information, please provide a concise response:\n\n${lastAssistantMessage}`;
    
    // Get current code from editor
    const currentCode = monacoEditor ? monacoEditor.getValue() : '';
    const activeLanguageBtn = document.querySelector('.language-btn.active');
    const currentLanguage = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
    
    // Call LLM to generate draft
    sendDraftMessage(draftPrompt, currentCode, currentLanguage);
}

// Send draft message to LLM
async function sendDraftMessage(draftPrompt, code, language) {
    const userInput = document.getElementById('user-input');
    
    try {
        // Create abort controller for this request
        currentAbortController = new AbortController();
        
        // Get LLM instance
        const llmInstance = llm._get();
        
        // Create a temporary chat history for the draft
        const draftHistory = [
            { role: 'system', content: 'You are a helpful assistant that provides draft answers to questions. Provide clear, concise responses in plain text without markdown formatting. You respond only with the main content without any meta-comments. Some blacklisted meta-comments are e.g. Here is a concise response: etc.' },
            { role: 'user', content: draftPrompt }
        ];
        
        // Call LLM
        const response = await llmInstance.chat(draftHistory);
        
        // Check if request was aborted
        if (currentAbortController.signal.aborted) {
            return;
        }
        
        // Populate the chat input box with the draft response
        userInput.value = response.trim();
        
        // In mobile view, keep the input panel collapsed - don't auto-expand or focus
        if (!isInMobileView()) {
            // Only focus in desktop view
            userInput.focus();
        } else {
            // In mobile view, just populate the value without focusing
            // This prevents Android keyboard from appearing and causing layout issues
            console.log('[Draft] Response populated in mobile view - tap input panel to expand');
        }
        
    } catch (error) {
        console.error('LLM Error:', error);
        
        // Check if request was aborted
        if (currentAbortController && currentAbortController.signal.aborted) {
            // Do nothing on abort
        } else {
            // Show error in output window
            const outputDiv = document.getElementById('markdown-output');
            const errorHtml = `
                <div style="background: #f44336; color: white; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                    <strong>Draft Error:</strong> ${escapeHtml(error.message)}
                </div>
            `;
            outputDiv.innerHTML += errorHtml;
        }
    } finally {
        isDraftInProgress = false;
        updateButtonStates();
        currentAbortController = null;
    }
}

// Handle clear output
function handleClearOutput() {
    document.getElementById('markdown-output').innerHTML = '';
    // Clear the LLM chat history
    if (currentProject) {
        clearLLMChatHistory(currentProject);
    }
    // Update button states after clearing output
    updateButtonStates();
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

// Initialize default projects if storage is empty (first-time setup)
function initializeDefaultProjects() {
    const projectIds = storage.get('meta:projectIds');
    
    // Check if this is the first time (no projects exist)
    if (!projectIds || projectIds.length === 0) {
        console.log('[Init] First-time setup detected. Loading default projects...');
        
        const now = new Date().toISOString();
        
        // Default project 1: Two Sum
        const twoSumMetadata = {
            name: "Two Sum",
            difficulty: "easy",
            firstAccessed: now,
            lastAccessed: now
        };
        storage.set('project:two-sum:metadata', twoSumMetadata);
        storage.set('project:two-sum:python:code', `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your solution here
    pass`);
        storage.set('project:two-sum:csharp:code', `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Your solution here
        
    }
}`);
        storage.set('project:two-sum:llmChatHistory', [
            {
                role: "system",
                content: `You are LeetPrep Coach, a friendly conversational interview coach that helps users solve LeetCode questions step-by-step. Behave like a technical mentor tutoring software engineers.
Follow this multi-turn workflow every time:

1. Pick a random LeetCode problem. Provide: • Problem number and title
• Quick statement
• A link to a reference site


2. Wait for user confirmation before moving forward.


3. Guide them through structured steps:



Step 1: Understand the problem

Step 2: Example input/output

Step 3: Ask the user to restate the goal

Step 4: Time + space complexity discussion

Step 5: Coding

Step 6: Interview-style review & feedback

4. Always ask questions to encourage user participation. Do not complete full solutions before they attempt.



Style rules:

Friendly, energetic tone with emojis

Use bullet points and short paragraphs

Occasionally promote coaching services (fictional placeholder URLs OK)

Acknowledge and reinforce correct reasoning

Help fix mistakes gently with guiding questions

Always continue the session until the user explicitly ends the interaction.
Always remember the conversation context.

Current Project ID: two-sum
Metadata: ${JSON.stringify(twoSumMetadata)}`
            },
            {
                role: "user",
                content: "hello"
            },
            {
                role: "assistant",
                content: `Hey there! Welcome to LeetPrep Coaching! I see you're ready to tackle a classic LeetCode challenge. That high-energy focus is exactly what we need! 🚀

We are going to start with a fundamental problem that every software engineer should master:

### 🌟 Problem 1: Two Sum

*   **Quick Statement:** Given an array of integers (\`nums\`) and an integer target, return the indices of the two numbers such that they add up to the target.
*   **Difficulty:** Easy
*   **Reference:** Check out the details here (placeholder link): \`https://leetprep.coach/two-sum\`

Ready to jump in and start crushing this one? Let me know when you are confirmed and ready for Step 1! 👍`
            }
        ]);
        
        // Default project 2: Longest Increasing Subsequence
        const lisMetadata = {
            name: "Longest Increasing Subsequence",
            difficulty: "medium",
            createdAt: now,
            lastAccessed: now,
            completed: false,
            firstAccessed: now
        };
        storage.set('project:longest-increasing-subsequence:metadata', lisMetadata);
        storage.set('project:longest-increasing-subsequence:python:code', `from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        """
        Given an integer array nums, return the length of the longest strictly 
        increasing subsequence.
        
        This problem can be solved using Dynamic Programming in O(N^2) or 
        an optimized method (Patience Sorting/Binary Search) in O(N log N).
        
        :param nums: The array of integers.
        :return: The length of the LIS.
        """
        # Write your solution here
        
        # Tip: For the O(N^2) DP approach, initialize an array \`dp\` where 
        # dp[i] is the length of the LIS ending at index i.
        
        pass`);
        storage.set('project:longest-increasing-subsequence:csharp:code', `using System;
using System.Collections.Generic;

public class Solution {
    /// <summary>
    /// Given an integer array nums, return the length of the longest strictly 
    /// increasing subsequence (LIS).
    /// </summary>
    /// <param name="nums">The input array of integers.</param>
    /// <returns>The length of the LIS.</returns>
    public int LengthOfLIS(int[] nums) {
        // Write your solution here
        
        /*
        // Standard O(N^2) Dynamic Programming approach template:
        if (nums == null || nums.Length == 0) return 0;
        int n = nums.Length;
        int[] dp = new int[n];
        int maxLen = 0;

        for (int i = 0; i < n; i++)
        {
            dp[i] = 1;
            // Logic to update dp[i] based on previous elements
            maxLen = Math.Max(maxLen, dp[i]);
        }
        return maxLen;
        */
        
        return 0; 
    }
}`);
        storage.set('project:longest-increasing-subsequence:llmChatHistory', [
            {
                role: "system",
                content: `You are LeetPrep Coach, a friendly conversational interview coach that helps users solve LeetCode questions step-by-step. Behave like a technical mentor tutoring software engineers.
Follow this multi-turn workflow every time:

1. Pick a random LeetCode problem. Provide: • Problem number and title
• Quick statement
• A link to a reference site


2. Wait for user confirmation before moving forward.


3. Guide them through structured steps:



Step 1: Understand the problem

Step 2: Example input/output

Step 3: Ask the user to restate the goal

Step 4: Time + space complexity discussion

Step 5: Coding

Step 6: Interview-style review & feedback

4. Always ask questions to encourage user participation. Do not complete full solutions before they attempt.



Style rules:

Friendly, energetic tone with emojis

Use bullet points and short paragraphs

Occasionally promote coaching services (fictional placeholder URLs OK)

Acknowledge and reinforce correct reasoning

Help fix mistakes gently with guiding questions

Always continue the session until the user explicitly ends the interaction.
Always remember the conversation context.

Current Project ID: longest-increasing-subsequence
Metadata: ${JSON.stringify(lisMetadata)}`
            },
            {
                role: "user",
                content: "hello"
            },
            {
                role: "assistant",
                content: `Hey there! I'm LeetPrep Coach, ready to tackle some tricky algorithms with you! 🚀 We're going to boost your interview skills today.

Based on our current project log, let's dive into a classic Dynamic Programming problem:

### Problem Focus:

*   **Problem Number & Title:** 300. Longest Increasing Subsequence
*   **Quick Statement:** Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.
*   **Reference Link:** Check out the details here if you want a quick peek: [https://leetcode.com/problems/longest-increasing-subsequence/](https://leetcode.com/problems/longest-increasing-subsequence/)

Ready to warm up your DP muscles and jump into Step 1: Understanding the Problem? 👍`
            }
        ]);
        
        // Register both projects
        storage.set('meta:projectIds', ['two-sum', 'longest-increasing-subsequence']);
        
        console.log('[Init] Default projects initialized: Two Sum, Longest Increasing Subsequence');
    }
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

// Auto-load first project when Monaco Editor is ready
function autoLoadFirstProject() {
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
    
    // Auto-load first project if no project is currently loaded and projects exist
    if (!currentProject && projects.length > 0) {
        const firstProject = projects[0];
        loadProject(firstProject.id);
        
        // Update active state in UI
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            if (item.getAttribute('data-project') === firstProject.id) {
                item.classList.add('active');
            }
        });
        
        console.log('[Auto-load] First project loaded:', firstProject.id);
    }
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
    
    // Also update add project button
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        if (shouldBlink) {
            addProjectBtn.classList.add('blink');
        } else {
            addProjectBtn.classList.remove('blink');
        }
    }
    
    // Also update storage buttons (export and import)
    const exportBtn = document.getElementById('export-storage-btn');
    if (exportBtn) {
        if (shouldBlink) {
            exportBtn.classList.add('blink');
        } else {
            exportBtn.classList.remove('blink');
        }
    }
    
    const importBtn = document.getElementById('import-storage-btn');
    if (importBtn) {
        if (shouldBlink) {
            importBtn.classList.add('blink');
        } else {
            importBtn.classList.remove('blink');
        }
    }
}

// Update button states
function updateButtonStates() {
    const sendBtn = document.getElementById('send-btn');
    const stopBtn = document.getElementById('stop-btn');
    const draftBtn = document.getElementById('draft-btn');
    
    sendBtn.disabled = isLLMResponding;
    stopBtn.disabled = !isLLMResponding;
    
    // Check if there's a last assistant message for the draft button
    let hasAssistantMessage = false;
    if (currentProject) {
        const llmHistory = getLLMChatHistory(currentProject);
        // Check if there's at least one assistant message
        for (let i = llmHistory.length - 1; i >= 0; i--) {
            if (llmHistory[i].role === 'assistant') {
                hasAssistantMessage = true;
                break;
            }
        }
    }
    
    // Disable draft button if no assistant message or if draft is in progress
    draftBtn.disabled = isDraftInProgress || !hasAssistantMessage;
    
    // Add or remove blinking class for draft button
    if (isDraftInProgress) {
        draftBtn.classList.add('drafting');
    } else {
        draftBtn.classList.remove('drafting');
    }
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
        
        // In mobile view, ensure main-content container maintains proper constraints
        if (isInMobileView()) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.overflow = 'hidden';
                mainContent.style.position = 'relative';
                
                // Ensure all panels stay within bounds
                Object.values(panels).forEach(p => {
                    if (p) {
                        p.style.position = 'relative';
                        p.style.top = '0';
                        p.style.transform = 'none';
                    }
                });
            }
        }
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

// Apply view mode (mobile or desktop)
function applyViewMode(viewMode) {
    const isMobileView = viewMode === 'mobile';
    
    if (isMobileView) {
        // Add mobile class to body for CSS targeting
        document.body.classList.add('mobile-mode');
        
        // Collapse editor panel by default on mobile
        const editorPanel = document.querySelector('.editor-panel');
        if (editorPanel && !panelStates.editor.collapsed) {
            // Save current height before collapsing
            const currentHeight = editorPanel.offsetHeight;
            panelStates.editor.originalHeight = currentHeight + 'px';
            
            editorPanel.classList.add('panel-collapsed');
            panelStates.editor.collapsed = true;
        }
        
        // Ensure Details (output) panel is expanded
        const outputPanel = document.querySelector('.output-panel');
        const inputPanel = document.querySelector('.input-panel');
        
        if (outputPanel && panelStates.output.collapsed) {
            outputPanel.classList.remove('panel-collapsed');
            if (panelStates.output.originalHeight) {
                outputPanel.style.height = panelStates.output.originalHeight;
            }
            panelStates.output.collapsed = false;
        }
        
        // Collapse Chat (input) panel by default on mobile
        if (inputPanel && !panelStates.input.collapsed) {
            // Save current height before collapsing
            const currentHeight = inputPanel.offsetHeight;
            panelStates.input.originalHeight = currentHeight + 'px';
            
            inputPanel.classList.add('panel-collapsed');
            panelStates.input.collapsed = true;
        }
        
        // Collapse sidebar by default on mobile if not already collapsed
        if (!isSidebarCollapsed) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.add('collapsed');
                isSidebarCollapsed = true;
            }
        }
    } else {
        // Desktop view - remove mobile class
        document.body.classList.remove('mobile-mode');
        
        // Expand editor panel if it was collapsed
        const editorPanel = document.querySelector('.editor-panel');
        if (editorPanel && panelStates.editor.collapsed) {
            editorPanel.classList.remove('panel-collapsed');
            if (panelStates.editor.originalHeight) {
                editorPanel.style.height = panelStates.editor.originalHeight;
            }
            panelStates.editor.collapsed = false;
        }
        
        // Expand input panel if it was collapsed
        const inputPanel = document.querySelector('.input-panel');
        if (inputPanel && panelStates.input.collapsed) {
            inputPanel.classList.remove('panel-collapsed');
            if (panelStates.input.originalHeight) {
                inputPanel.style.height = panelStates.input.originalHeight;
            }
            panelStates.input.collapsed = false;
        }
        
        // Expand sidebar if it was collapsed
        if (isSidebarCollapsed) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('collapsed');
                isSidebarCollapsed = false;
            }
        }
    }
    
    // Trigger Monaco Editor layout update
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 300);
}

// Initialize mobile-specific behavior (deprecated - use applyViewMode instead)
function initializeMobileMode() {
    // Get view mode from storage
    const viewMode = storage.get('setting:view_mode');
    if (viewMode) {
        // Use stored preference
        applyViewMode(viewMode);
    } else if (window.isMobile()) {
        // Fallback to device detection if no preference set
        applyViewMode('mobile');
    }
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
        
        // If in mobile mode and it's the editor, restore collapsed state if it was collapsed before
        if (isInMobileView() && panelType === 'editor' && panelStates.editor.wasCollapsedBeforeMaximize) {
            targetPanel.classList.add('panel-collapsed');
            panelStates.editor.collapsed = true;
            panelStates.editor.wasCollapsedBeforeMaximize = false;
        }
    } else {
        // If panel is collapsed, expand it before maximizing
        if (targetPanel.classList.contains('panel-collapsed')) {
            targetPanel.classList.remove('panel-collapsed');
            if (panelStates[panelType]) {
                panelStates[panelType].wasCollapsedBeforeMaximize = true;
                panelStates[panelType].collapsed = false;
            }
        }
        
        // Maximize - first remove from any other panel
        editorPanel.classList.remove('maximized');
        outputPanel.classList.remove('maximized');
        inputPanel.classList.remove('maximized');
        
        // Then maximize the target panel
        targetPanel.classList.add('maximized');
        maximizedPanel = panelType;
    }
    
    // Trigger Monaco Editor layout update after animation
    // Use multiple updates to ensure it works in mobile mode
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 50);
    
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 150);
    
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 350);
}

// Auto-collapse sidebar on small screens
window.addEventListener('resize', function() {
    const isSmallScreen = window.innerWidth < 768;
    const sidebar = document.getElementById('sidebar');
    
    // Don't auto-collapse on desktop mode
    if (isInMobileView() && isSmallScreen && !isSidebarCollapsed) {
        // Auto-collapse on small screens in mobile mode
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
        
        // Touch support for mobile devices
        handle.addEventListener('touchstart', (e) => {
            // Don't resize if any panel is maximized
            if (maximizedPanel) return;
            
            isResizing = true;
            startY = e.touches[0].clientY;
            
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
        
        // Touch move support for mobile devices
        document.addEventListener('touchmove', (e) => {
            if (!isResizing) return;
            
            const deltaY = e.touches[0].clientY - startY;
            const newHeight1 = startHeight1 + deltaY;
            const newHeight2 = startHeight2 - deltaY;
            
            // Check minimum heights (larger for mobile)
            const minHeight = isInMobileView() ? 150 : 100;
            if (newHeight1 >= minHeight && newHeight2 >= minHeight) {
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
        
        // Touch end support for mobile devices
        document.addEventListener('touchend', () => {
            if (isResizing) {
                isResizing = false;
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
        const parsedContent = parseMarkdown(lastAssistantMessage);
        
        html += `
            <div class="markdown-content" style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                ${parsedContent}
            </div>
        `;
    }
    
    outputDiv.innerHTML = html;
    
    // Render math expressions with KaTeX
    renderKaTeX(outputDiv);
    
    // Update button states after loading chat history
    updateButtonStates();
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
    
    // Auto-collapse sidebar in mobile mode
    if (isInMobileView() && !isSidebarCollapsed) {
        handleSidebarToggle();
    }
    
    // Clear previous input
    dialogInput.value = '';
    
    // Reset dialog state
    isDialogLLMResponding = false;
    updateDialogButtonStates();
    
    // Show dialog
    dialogOverlay.classList.add('active');
    
    // Only auto-focus on desktop (not on mobile to prevent keyboard popup)
    if (!isMobile()) {
        setTimeout(() => dialogInput.focus(), 100);
    }
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

// Generate Python boilerplate code
async function generatePythonBoilerplate(problemName, llmInstance) {
    const prompt = `Generate Python boilerplate code for a LeetCode problem called "${problemName}". 
Return ONLY the Python code, no explanation, no markdown code blocks.
Include a function/class definition with docstring and a comment showing where to write the solution.
The code should not have the solution, and only the boilerplate structure with a pass statement.
Example format:
def problemName(param):
    """
    :type param: type
    :rtype: type
    """
    # Your solution here
    pass`;
    
    try {
        const response = await llmInstance.answer(prompt);
        // Clean up any markdown code blocks if present
        let cleanCode = response.trim();
        cleanCode = cleanCode.replace(/^```python\s*/m, '').replace(/^```\s*$/m, '').trim();
        return cleanCode || `# ${problemName}\n# TODO: Implement your solution here\n`;
    } catch (error) {
        console.error('[Python Boilerplate] Error:', error);
        return `# ${problemName}\n# TODO: Implement your solution here\n`;
    }
}

// Generate C# boilerplate code
async function generateCSharpBoilerplate(problemName, llmInstance) {
    const prompt = `Generate C# boilerplate code for a LeetCode problem called "${problemName}".
Return ONLY the C# code, no explanation, no markdown code blocks.
Include a Solution class with a method and a comment showing where to write the solution.
The code should not have the solution, and only the boilerplate structure with the comment '// Your solution here'.
Example format:
public class Solution {
    public ReturnType MethodName(ParamType param) {
        // Your solution here
        
    }
}`;
    
    try {
        const response = await llmInstance.answer(prompt);
        // Clean up any markdown code blocks if present
        let cleanCode = response.trim();
        cleanCode = cleanCode.replace(/^```csharp\s*/m, '').replace(/^```c#\s*/m, '').replace(/^```\s*$/m, '').trim();
        return cleanCode || `// ${problemName}\nclass Program\n{\n    static void Main()\n    {\n        // TODO: Implement your solution here\n    }\n}`;
    } catch (error) {
        console.error('[C# Boilerplate] Error:', error);
        return `// ${problemName}\nclass Program\n{\n    static void Main()\n    {\n        // TODO: Implement your solution here\n    }\n}`;
    }
}

// Progress Dialog Functions
function showProgressDialog() {
    const progressOverlay = document.getElementById('progress-dialog-overlay');
    if (progressOverlay) {
        // Reset all steps
        const steps = progressOverlay.querySelectorAll('.progress-step');
        steps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
        progressOverlay.classList.add('active');
    }
}

function hideProgressDialog() {
    const progressOverlay = document.getElementById('progress-dialog-overlay');
    if (progressOverlay) {
        progressOverlay.classList.remove('active');
    }
}

function updateProgressStep(stepNumber, status, description) {
    const progressOverlay = document.getElementById('progress-dialog-overlay');
    if (!progressOverlay) return;
    
    const step = progressOverlay.querySelector(`.progress-step[data-step="${stepNumber}"]`);
    if (!step) return;
    
    // Update description if provided
    if (description) {
        const descElement = step.querySelector('.step-description');
        if (descElement) {
            descElement.textContent = description;
        }
    }
    
    // Update status
    if (status === 'active') {
        step.classList.add('active');
        step.classList.remove('completed');
    } else if (status === 'completed') {
        step.classList.remove('active');
        step.classList.add('completed');
    }
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
    
    // Show progress dialog
    showProgressDialog();
    
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
        // Step 1: Processing request
        updateProgressStep(1, 'active', 'Analyzing problem requirements...');
        
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
            hideProgressDialog();
            return;
        }
        
        // Complete step 1
        updateProgressStep(1, 'completed', 'Requirements analyzed');
        
        // Parse the JSON response
        let projectData = parseProjectJSON(response);
        
        if (!projectData) {
            // First attempt failed - try simpler prompt
            console.log('[Project Creation] First attempt failed, trying simpler prompt...');
            
            // Update loading indicator
            const thinkingDiv = outputDiv.querySelector('.llm-thinking p');
            if (thinkingDiv) {
                thinkingDiv.textContent = 'Retrying with simpler format...';
            }
            
            // Simpler prompt - just name and difficulty
            const simplePrompt = `Based on this request: "${message}"

Generate a LeetCode problem. Return ONLY a JSON object with this structure (no markdown, no code blocks):
{
  "name": "Problem Name",
  "difficulty": "Easy|Medium|Hard"
}

The difficulty must be exactly one of: Easy, Medium, or Hard.
Return ONLY the JSON, nothing else.`;
            
            const simpleResponse = await llmInstance.answer(simplePrompt);
            
            // Check if request was aborted
            if (dialogAbortController.signal.aborted) {
                hideProgressDialog();
                return;
            }
            
            // Parse the simple response
            projectData = parseProjectJSON(simpleResponse);
        
            // If parsing failed, try repairing the JSON and parsing again
            if (!projectData) {
                console.log('[Project Creation] Initial parse failed, attempting JSON repair...');
                const repairedResponse = repairJSON(response);
                if (repairedResponse !== response) {
                    console.log('[Project Creation] JSON repaired, retrying parse...');
                    projectData = parseProjectJSON(repairedResponse);
                }
            }
            
            if (!projectData) {
                throw new Error('Failed to parse project data from LLM response');
            }
            
            // Step 2: Generate Python boilerplate
            updateProgressStep(2, 'active', 'Creating Python template...');
            console.log('[Project Creation] Generating Python boilerplate...');
            thinkingDiv.textContent = 'Generating Python code template...';
            projectData.pythonCode = await generatePythonBoilerplate(projectData.name, llmInstance);
            updateProgressStep(2, 'completed', 'Python template created');
            
            // Step 3: Generate C# boilerplate
            updateProgressStep(3, 'active', 'Creating C# template...');
            console.log('[Project Creation] Generating C# boilerplate...');
            thinkingDiv.textContent = 'Generating C# code template...';
            projectData.csharpCode = await generateCSharpBoilerplate(projectData.name, llmInstance);
            updateProgressStep(3, 'completed', 'C# template created');
        } else {
            // First parse succeeded - mark steps 2 and 3 as completed quickly
            updateProgressStep(2, 'active', 'Python template included...');
            await new Promise(resolve => setTimeout(resolve, 200));
            updateProgressStep(2, 'completed', 'Python template ready');
            
            updateProgressStep(3, 'active', 'C# template included...');
            await new Promise(resolve => setTimeout(resolve, 200));
            updateProgressStep(3, 'completed', 'C# template ready');
        }
        
        // Honor the project name if available.
        const metaName = document.getElementById('project-dialog-meta-name');
        // Remove icons/symbols (e.g., emojis, stars) and trim whitespace
        const projectName = metaName.value.replace(/[\p{Emoji}\p{Symbol}\p{Punctuation}\u2600-\u27BF\uFE0F]/gu, '').trim();

        if (projectName && projectName.length > 0) {
            projectData.name = projectName;
        }

        // Step 4: Finalize project
        updateProgressStep(4, 'active', 'Setting up project structure...');
        
        // Create the project
        const projectId = createProjectFromData(projectData);
        
        updateProgressStep(4, 'completed', 'Project created successfully');
        
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
        
        // Wait a bit to show completed state, then hide progress dialog
        setTimeout(() => {
            hideProgressDialog();
        }, 1000);
        
        // Select and load the new project
        setTimeout(() => {
            const projectItem = document.querySelector(`.project-item[data-project="${projectId}"]`);
            if (projectItem) {
                projectItem.click();
            }
        }, 1100);
        
        // Clear and close dialog
        dialogInput.value = '';
        handleCloseDialog();
        
    } catch (error) {
        console.error('Dialog LLM Error:', error);
        
        // Hide progress dialog
        hideProgressDialog();
        
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
    
    // Hide progress dialog
    hideProgressDialog();
    
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

// ===== POP OUT HANDLER =====
function handlePopOutClick() {
    if (!currentProject) {
        return;
    }
    
    const llmHistory = getLLMChatHistory(currentProject);
    
    // Find the last assistant message
    let lastAssistantMessage = null;
    for (let i = llmHistory.length - 1; i >= 0; i--) {
        if (llmHistory[i].role === 'assistant') {
            lastAssistantMessage = llmHistory[i].content;
            break;
        }
    }
    
    if (!lastAssistantMessage) {
        alert('No assistant message found to display.');
        return;
    }
    
    // Get current theme
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    
    // Escape the content for JavaScript string
    const escapedContent = lastAssistantMessage
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
    
    // Create the HTML content with theme support
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
<title>Complexity Analysis Render</title>

<!-- KaTeX for Math Rendering -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
        onload="renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ]
        });"></script>

<!-- Google Fonts for Bionic Reading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;400;500;700&family=Montserrat:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- Marked.js for Markdown -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<!-- Optional: Highlight.js for code blocks -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/default.min.css">
<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/highlight.min.js"></script>

<style>
  :root {
    --base-font-size: 16px;
    --scale-factor: 1;
    --content-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  /* Light Theme (Default) */
  body[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8f8f8;
    --text-primary: #333333;
    --text-secondary: #666666;
    --border-color: #ddd;
    --code-bg: #f5f5f5;
    --control-bg: white;
    --control-border: #007acc;
    --control-text: #007acc;
    --control-hover-bg: #f0f0f0;
    --control-active-bg: #007acc;
    --control-active-text: white;
    --table-header-bg: #f5f5f5;
    --table-header-text: #333333;
  }
  
  /* Dark Theme */
  body[data-theme="dark"] {
    --bg-primary: #1e1e1e;
    --bg-secondary: #252526;
    --text-primary: #d4d4d4;
    --text-secondary: #858585;
    --border-color: #2d2d30;
    --code-bg: #1e1e1e;
    --control-bg: #2d2d30;
    --control-border: #0e639c;
    --control-text: #d4d4d4;
    --control-hover-bg: #3e3e42;
    --control-active-bg: #0e639c;
    --control-active-text: #ffffff;
    --table-header-bg: #2d2d30;
    --table-header-text: #d4d4d4;
  }
  
  body {
    font-family: var(--content-font);
    max-width: 100%;
    margin: 0;
    padding: 16px;
    line-height: 1.6;
    font-size: calc(var(--base-font-size) * var(--scale-factor));
    box-sizing: border-box;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  * {
    box-sizing: border-box;
  }
  
  /* Control Panel */
  #control-panel {
    background: var(--control-bg);
    padding: 10px;
    border-bottom: 2px solid var(--border-color);
    display: flex;
    gap: 0;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .control-btn {
    padding: 8px 16px;
    border: 1px solid var(--control-border);
    background: var(--control-bg);
    color: var(--control-text);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    touch-action: manipulation;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  
  .control-btn:hover {
    background: var(--control-hover-bg);
  }
  
  .control-btn:active {
    background: var(--control-active-bg);
    color: var(--control-active-text);
  }
  
  .control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Grouped font control buttons */
  .font-first,
  .font-middle,
  .font-last {
    border-radius: 0;
    margin-left: -1px;
  }
  
  .font-first {
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  .font-last {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  .font-first:hover,
  .font-middle:hover,
  .font-last:hover {
    z-index: 1;
    position: relative;
  }
  
  #font-size-display {
    padding: 8px 12px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-radius: 4px;
    font-size: 14px;
    min-width: 60px;
    text-align: center;
    border: 1px solid var(--border-color);
  }
  
  .theme-toggle-btn {
    padding: 8px 16px;
    border: 1px solid var(--control-border);
    background: var(--control-bg);
    color: var(--control-text);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    touch-action: manipulation;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  
  .theme-toggle-btn:hover {
    background: var(--control-hover-bg);
  }
  
  /* Content Area */
  #content {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  
  #content h1, #content h2, #content h3, #content h4 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  #content h3 {
    font-size: 1.3em;
  }
  
  #content h4 {
    font-size: 1.1em;
  }
  
  #content p {
    margin: 0.8em 0;
  }
  
  #content ul, #content ol {
    padding-left: 1.5em;
  }
  
  #content li {
    margin: 0.5em 0;
  }
  
  pre {
    padding: 12px;
    background: #f5f5f5;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.9em;
    max-width: 100%;
  }
  
  code {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  
  /* Table responsiveness */
  table {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-collapse: collapse;
    margin: 1em 0;
  }
  
  table thead {
    background: var(--table-header-bg);
  }
  
  table th {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    text-align: left;
    min-width: 80px;
    font-size: 0.9em;
    background: var(--table-header-bg);
    color: var(--table-header-text);
    font-weight: 600;
  }
  
  table td {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    text-align: left;
    min-width: 80px;
    font-size: 0.9em;
  }
  
  /* Math rendering */
  .katex {
    font-size: 1em;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .katex-display {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5em 0;
  }
  
  /* Bionic reading styles */
  body.bionic-mode {
    --content-font: 'Raleway', 'Montserrat', 'Roboto', 'Segoe UI', system-ui, sans-serif;
  }
  
  body.bionic-mode #content {
    font-family: var(--content-font);
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 1.75;
  }
  
  .bionic-word {
    font-weight: 600;
  }
  
  body.bionic-mode .bionic-word {
    font-weight: 600;
  }
  
  .fixation-btn {
    padding: 8px 16px;
    border: 1px solid var(--control-border);
    background: var(--control-bg);
    color: var(--control-text);
    border-radius: 0;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
    touch-action: manipulation;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, color 0.2s ease;
    margin-left: -1px;
  }
  
  .fixation-btn:first-of-type {
    margin-left: 0;
  }
  
  .fixation-first {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  .fixation-last {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  .fixation-btn:hover {
    background: var(--control-hover-bg);
    z-index: 1;
    position: relative;
  }
  
  .fixation-btn.active {
    background: var(--control-active-bg);
    color: var(--control-active-text);
    z-index: 2;
    position: relative;
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    :root {
      --base-font-size: 16px;
    }
    
    body {
      padding: 12px;
    }
    
    #control-panel {
      margin-bottom: 12px;
      padding: 8px;
    }
    
    pre {
      font-size: 0.85em;
      padding: 8px;
    }
    
    table th, table td {
      padding: 6px 8px;
      font-size: 0.85em;
      min-width: 60px;
    }
  }
  
  @media (max-width: 480px) {
    :root {
      --base-font-size: 15px;
    }
    
    .control-btn {
      padding: 6px 12px;
      font-size: 13px;
    }
    
    #font-size-display {
      font-size: 13px;
      padding: 6px 10px;
    }
  }
  
</style>
</head>

<body data-theme="${currentTheme}">
<div id="control-panel">
  <button class="control-btn font-first" id="decrease-font" title="Decrease font size">T-</button>
  <button class="control-btn font-middle" id="reset-font" title="Reset font size">
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>
  </button>
  <button class="control-btn font-last" id="increase-font" title="Increase font size">T+</button>
  <button class="theme-toggle-btn" id="theme-toggle" title="Toggle dark/light mode" style="margin-left: 8px;">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" id="theme-icon">
      <!-- Sun icon (light mode) -->
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
    </svg>
  </button>
  <div style="display: flex; align-items: center; gap: 0; margin-left: 8px;">
    <button class="fixation-btn fixation-first" data-fixation="0">F0</button>
    <button class="fixation-btn fixation-middle" data-fixation="1">F1</button>
    <button class="fixation-btn fixation-middle" data-fixation="2">F2</button>
    <button class="fixation-btn fixation-middle" data-fixation="3">F3</button>
    <button class="fixation-btn fixation-middle" data-fixation="4">F4</button>
    <button class="fixation-btn fixation-last" data-fixation="5">F5</button>
  </div>
</div>
<div id="content"></div>

<script>
  // Example: Insert Markdown content and render
  const markdownText = '${escapedContent}';

  let originalHTML = marked.parse(markdownText);
  document.getElementById("content").innerHTML = originalHTML;
  
  // Highlight code blocks after DOM is ready
  if (typeof hljs !== 'undefined') {
    setTimeout(() => {
      hljs.highlightAll();
    }, 10);
  }
  
  // Render math initially
  if (window.renderMathInElement) {
    renderMathInElement(document.getElementById('content'), {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ]
    });
  }
  
  // Font size control
  let scaleFactor = 1;
  const minScale = 0.7;
  const maxScale = 2.0;
  const step = 0.1;
  
  function updateFontSize() {
    document.documentElement.style.setProperty('--scale-factor', scaleFactor);
    
    // Save to localStorage
    try {
      localStorage.setItem('fontScale', scaleFactor);
    } catch (e) {
      console.log('localStorage not available');
    }
  }
  
  // Load saved font size
  try {
    const saved = localStorage.getItem('fontScale');
    if (saved) {
      scaleFactor = parseFloat(saved);
      updateFontSize();
    }
  } catch (e) {
    console.log('localStorage not available');
  }
  
  document.getElementById('increase-font').addEventListener('click', () => {
    if (scaleFactor < maxScale) {
      scaleFactor = Math.min(maxScale, scaleFactor + step);
      updateFontSize();
    }
  });
  
  document.getElementById('decrease-font').addEventListener('click', () => {
    if (scaleFactor > minScale) {
      scaleFactor = Math.max(minScale, scaleFactor - step);
      updateFontSize();
    }
  });
  
  document.getElementById('reset-font').addEventListener('click', () => {
    scaleFactor = 1;
    updateFontSize();
  });
  
  // Theme toggle functionality
  const sunIcon = '<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>';
  const moonIcon = '<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>';
  
  // Load saved theme
  let currentTheme = '${currentTheme}';
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      currentTheme = savedTheme;
      document.body.setAttribute('data-theme', currentTheme);
      updateThemeIcon();
    }
  } catch (e) {
    console.log('localStorage not available');
  }
  
  function updateThemeIcon() {
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const theme = body.getAttribute('data-theme');
    
    if (theme === 'dark') {
      themeIcon.innerHTML = moonIcon;
    } else {
      themeIcon.innerHTML = sunIcon;
    }
  }
  
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    updateThemeIcon();
    
    // Save to localStorage
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.log('localStorage not available');
    }
  });
  
  // Force viewport rendering on mobile devices
  // This ensures the viewport meta tag is properly applied
  function ensureProperViewport() {
    // Trigger a reflow to ensure viewport is recognized
    document.body.style.opacity = '0.99';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 10);
  }
  
  // Run on load
  if (window.innerWidth < 768) {
    ensureProperViewport();
  }
  
  // Bionic reading functionality
  let currentFixation = 0;
  let mathRendered = false;
  
  // Load saved fixation level and apply after math is rendered
  try {
    const savedFixation = localStorage.getItem('bionicFixation');
    if (savedFixation !== null) {
      currentFixation = parseInt(savedFixation);
      updateFixationButtons();
    }
  } catch (e) {
    console.log('localStorage not available');
  }
  
  // Wait for KaTeX auto-render and highlight.js to complete, then apply bionic reading if needed
  setTimeout(() => {
    mathRendered = true;
    if (currentFixation > 0) {
      applyBionicReading(currentFixation);
    }
  }, 300);
  
  function updateFixationButtons() {
    document.querySelectorAll('.fixation-btn').forEach(btn => {
      const fixation = parseInt(btn.getAttribute('data-fixation'));
      if (fixation === currentFixation) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  function applyBionicReading(fixationLevel) {
    const contentDiv = document.getElementById('content');
    
    // Reset to original first
    contentDiv.innerHTML = originalHTML;
    
    // Render math first
    if (window.renderMathInElement) {
      renderMathInElement(contentDiv, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ]
      });
    }
    
    if (fixationLevel === 0) {
      // Remove bionic mode class
      document.body.classList.remove('bionic-mode');
      return;
    }
    
    // Add bionic mode class for font switching
    document.body.classList.add('bionic-mode');
    
    // Apply bionic reading to text nodes after math is rendered
    processTextNodes(contentDiv, fixationLevel);
  }
  
  function processTextNodes(element, fixationLevel) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip if parent is code, pre, or katex rendered elements
          let parent = node.parentElement;
          while (parent && parent !== element) {
            const tagName = parent.tagName;
            if (['CODE', 'PRE', 'SCRIPT', 'STYLE', 'MATH', 'SVG'].includes(tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            // Skip KaTeX rendered content
            if (parent.classList && (parent.classList.contains('katex') || 
                parent.classList.contains('katex-mathml') ||
                parent.classList.contains('katex-html'))) {
              return NodeFilter.FILTER_REJECT;
            }
            parent = parent.parentElement;
          }
          
          // Only accept non-empty text nodes
          return node.textContent.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );
    
    const nodesToProcess = [];
    let node;
    while (node = walker.nextNode()) {
      nodesToProcess.push(node);
    }
    
    // Process collected nodes
    nodesToProcess.forEach(textNode => {
      const text = textNode.textContent;
      const bionicHTML = convertToBionic(text, fixationLevel);
      
      if (bionicHTML !== text) {
        const span = document.createElement('span');
        span.innerHTML = bionicHTML;
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
  }
  
  function convertToBionic(text, fixationLevel) {
    // Split by spaces but preserve the spaces
    const parts = text.split(/(\\s+)/);
    
    return parts.map(part => {
      // If it's whitespace, return as-is
      if (/^\\s+$/.test(part)) {
        return part;
      }
      
      // If it's a word, apply bionic reading
      if (part.length > 0) {
        return makeBionicWord(part, fixationLevel);
      }
      
      return part;
    }).join('');
  }
  
  function makeBionicWord(word, fixationLevel) {
    // Check if word contains emoticons/emojis - if so, return as-is
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2602}\u{2603}\u{2604}\u{260E}\u{2611}\u{2614}\u{2615}\u{2618}\u{2620}\u{2622}\u{2623}\u{2626}\u{262A}\u{262E}\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}\u{2666}\u{2668}\u{267B}\u{267E}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}\u{269C}\u{26A0}\u{26A1}\u{26A7}\u{26AA}\u{26AB}\u{26B0}\u{26B1}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26C8}\u{26CE}\u{26CF}\u{26D1}\u{26D3}\u{26D4}\u{26E9}\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}]/u;
    
    if (emojiRegex.test(word)) {
      return word;
    }
    
    const len = word.length;
    
    // Don't process very short words or single characters
    if (len <= 1) {
      return word;
    }
    
    // Calculate how many characters to bold based on fixation level
    let boldCount;
    
    if (len <= 3) {
      boldCount = fixationLevel >= 3 ? 1 : 0;
    } else if (len <= 5) {
      boldCount = Math.min(Math.ceil(fixationLevel / 2), len - 1);
    } else {
      // For longer words, scale based on fixation level
      const ratio = 0.1 + (fixationLevel * 0.1); // 10% to 60%
      boldCount = Math.max(1, Math.min(Math.ceil(len * ratio), len - 1));
    }
    
    if (boldCount === 0) {
      return word;
    }
    
    const boldPart = word.substring(0, boldCount);
    const normalPart = word.substring(boldCount);
    
    return '<strong class="bionic-word">' + boldPart + '</strong>' + normalPart;
  }
  
  // Fixation button event listeners
  document.querySelectorAll('.fixation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fixation = parseInt(btn.getAttribute('data-fixation'));
      
      currentFixation = fixation;
      
      updateFixationButtons();
      applyBionicReading(currentFixation);
      
      // Save to localStorage
      try {
        localStorage.setItem('bionicFixation', currentFixation);
      } catch (e) {
        console.log('localStorage not available');
      }
    });
  });
</script>


</body>
</html>`;
    
    // Open a new maximized window without browser controls
    const newWindow = window.open('', '_blank', 'menubar=no,toolbar=no,location=no,status=no');
    
    if (newWindow) {
        // Maximize the window
        newWindow.moveTo(0, 0);
        newWindow.resizeTo(screen.availWidth, screen.availHeight);
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    } else {
        alert('Pop-up was blocked. Please allow pop-ups for this site.');
    }
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
            messageContent = parseMarkdown(msg.content);
        } else {
            messageContent = escapeHtml(msg.content);
        }
        
        messageDiv.innerHTML = `
            <strong>${roleLabel}</strong>
            <p>${messageContent}</p>
        `;
        
        // Render math expressions with KaTeX for assistant messages
        if (msg.role === 'assistant') {
            renderKaTeX(messageDiv);
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
            messageContent = parseMarkdown(content);
        } else {
            messageContent = escapeHtml(content);
        }
        
        messageDiv.innerHTML = `
            <strong>${roleLabel}</strong>
            <p>${messageContent}</p>
        `;
        
        // Render math expressions with KaTeX for assistant messages
        if (role === 'assistant') {
            renderKaTeX(messageDiv);
        }
    }
    
    chatHistoryDiv.appendChild(messageDiv);
    
    // Save to clarify chat history (exclude system messages)
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

// ===== DRY RUN DIALOG HANDLERS =====
let isDryRunMaximized = false;
let dryRunRotationAngle = 0;

// Convert project name to hyphen-based format
function toHyphenCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Handle dry run button click
function handleDryRunClick() {
    if (!currentProject) {
        alert('Please select a project first.');
        return;
    }
    
    const dryRunDialogOverlay = document.getElementById('dry-run-dialog-overlay');
    const dryRunIframe = document.getElementById('dry-run-iframe');
    const dryRunError = document.getElementById('dry-run-error');
    
    // Get current host URL
    const hostUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
    
    // Convert project name to hyphen-based format
    const hyphenProjectName = toHyphenCase(currentProject);
    
    // Construct the URL
    const dryRunUrl = `${hostUrl}/projects/${hyphenProjectName}/dryrun.html`;
    
    // Reset iframe and error visibility
    dryRunIframe.style.display = 'block';
    dryRunError.style.display = 'none';
    
    // Restore rotation angle from storage
    dryRunRotationAngle = parseInt(storage.get('preferences:dryrunorientation') || '0', 10);
    dryRunIframe.style.transform = `rotate(${dryRunRotationAngle}deg)`;
    
    // Load the iframe
    dryRunIframe.src = dryRunUrl;
    
    // Handle iframe load error
    dryRunIframe.onerror = function() {
        dryRunIframe.style.display = 'none';
        dryRunError.style.display = 'flex';
    };
    
    // Check if iframe loaded successfully after a timeout
    setTimeout(() => {
        try {
            // Try to access iframe document to check if it loaded
            const iframeDoc = dryRunIframe.contentDocument || dryRunIframe.contentWindow.document;
            if (!iframeDoc || iframeDoc.body.innerHTML === '') {
                dryRunIframe.style.display = 'none';
                dryRunError.style.display = 'flex';
            }
        } catch (e) {
            // Cross-origin or access denied - assume it loaded successfully
            console.log('Cannot access iframe content, assuming it loaded');
        }
    }, 2000);
    
    // Show dialog
    dryRunDialogOverlay.classList.add('active');
    
    // Maximize dialog on show
    const dryRunDialog = document.querySelector('.dry-run-dialog');
    isDryRunMaximized = true;
    dryRunDialog.classList.add('maximized');
}

// Handle close dry run dialog
function handleCloseDryRunDialog() {
    const dryRunDialogOverlay = document.getElementById('dry-run-dialog-overlay');
    const dryRunIframe = document.getElementById('dry-run-iframe');
    const dryRunDialog = document.querySelector('.dry-run-dialog');
    
    dryRunDialogOverlay.classList.remove('active');
    
    // Reset iframe
    dryRunIframe.src = '';
    
    // Reset rotation
    dryRunRotationAngle = 0;
    dryRunIframe.style.transform = 'rotate(0deg)';
    
    // Reset maximize state
    if (isDryRunMaximized) {
        isDryRunMaximized = false;
        dryRunDialog.classList.remove('maximized');
    }
    
    // Reopen library dialog if it was open before
    if (window.libraryDialogWasOpen) {
        window.libraryDialogWasOpen = false;
        const libraryDialogOverlay = document.getElementById('library-dialog-overlay');
        libraryDialogOverlay.classList.add('active');
    }
}

// Handle dry run edit button
function handleDryRunEdit() {
    if (currentProject) {
        // Open repl.html in a new tab with the project name as a query parameter
        window.open(`repl.html?projectname=${currentProject}`, '_blank');
    }
}

// Handle dry run restart button
function handleDryRunRestart() {
    const dryRunIframe = document.getElementById('dry-run-iframe');
    const dryRunError = document.getElementById('dry-run-error');
    
    // Reset error display
    dryRunError.style.display = 'none';
    dryRunIframe.style.display = 'block';
    
    // Reload iframe by re-setting src
    const currentSrc = dryRunIframe.src;
    dryRunIframe.src = '';
    setTimeout(() => {
        dryRunIframe.src = currentSrc;
    }, 10);
}

// Handle dry run rotate button
function handleDryRunRotate() {
    const dryRunIframe = document.getElementById('dry-run-iframe');
    
    // Rotate by 90 degrees
    dryRunRotationAngle = (dryRunRotationAngle + 90) % 360;
    dryRunIframe.style.transform = `rotate(${dryRunRotationAngle}deg)`;
    
    // Save to storage
    storage.set('preferences:dryrunorientation', dryRunRotationAngle.toString());
}

// Handle dry run maximize button
function handleDryRunMaximize() {
    const dryRunDialog = document.querySelector('.dry-run-dialog');
    
    isDryRunMaximized = !isDryRunMaximized;
    
    if (isDryRunMaximized) {
        dryRunDialog.classList.add('maximized');
    } else {
        dryRunDialog.classList.remove('maximized');
    }
}

// ===== NOT IMPLEMENTED DIALOG HANDLERS =====

// Handle close not implemented dialog
function handleCloseNotImplementedDialog() {
    const notImplementedDialogOverlay = document.getElementById('not-implemented-dialog-overlay');
    notImplementedDialogOverlay.classList.remove('active');
}

// ===== SETTINGS DIALOG HANDLERS =====

// Handle open settings dialog
function handleOpenSettingsDialog() {
    const settingsDialogOverlay = document.getElementById('settings-dialog-overlay');
    
    // Get current view mode from storage
    const currentViewMode = storage.get('setting:view_mode') || 'desktop';
    
    // Auto-collapse sidebar in mobile mode
    if (currentViewMode === 'mobile' && !isSidebarCollapsed) {
        handleSidebarToggle();
    }
    
    settingsDialogOverlay.classList.add('active');
    
    // Load current LLM type
    const currentLlmType = storage.get('setting:llm_type') || 'mlcaiwebllm';
    
    // Update active state of LLM buttons
    document.querySelectorAll('.llm-btn').forEach(btn => {
        const llmType = btn.getAttribute('data-llm-type');
        if (llmType === currentLlmType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update active state of view mode buttons
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        const viewMode = btn.getAttribute('data-view-mode');
        if (viewMode === currentViewMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Handle close settings dialog
function handleCloseSettingsDialog() {
    const settingsDialogOverlay = document.getElementById('settings-dialog-overlay');
    settingsDialogOverlay.classList.remove('active');
}

// Handle LLM button click
function handleLlmButtonClick(event) {
    const clickedBtn = event.currentTarget;
    const selectedLlmType = clickedBtn.getAttribute('data-llm-type');
    
    // Update active state
    document.querySelectorAll('.llm-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');
}

// Handle view mode button click
function handleViewModeButtonClick(event) {
    const clickedBtn = event.currentTarget;
    const selectedViewMode = clickedBtn.getAttribute('data-view-mode');
    
    // Update active state
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');
}

// Handle save settings
function handleSaveSettings() {
    // Get selected LLM type
    const activeLlmBtn = document.querySelector('.llm-btn.active');
    if (activeLlmBtn) {
        const selectedLlmType = activeLlmBtn.getAttribute('data-llm-type');
        
        // Save to storage
        storage.set('setting:llm_type', selectedLlmType);
        
        // Update LLM instance
        llm.setType(selectedLlmType);
        
        console.log(`[Settings] LLM type changed to: ${selectedLlmType}`);
    }
    
    // Get selected view mode
    const activeViewModeBtn = document.querySelector('.view-mode-btn.active');
    if (activeViewModeBtn) {
        const selectedViewMode = activeViewModeBtn.getAttribute('data-view-mode');
        const currentViewMode = storage.get('setting:view_mode');
        
        // Only apply changes if view mode changed
        if (selectedViewMode !== currentViewMode) {
            // Save to storage
            storage.set('setting:view_mode', selectedViewMode);
            
            // Apply the view mode
            applyViewMode(selectedViewMode);
            
            console.log(`[Settings] View mode changed to: ${selectedViewMode}`);
        }
    }
    
    // Close dialog
    handleCloseSettingsDialog();
}

// ===== API KEYS DIALOG HANDLERS =====

// Handle open API keys dialog
function handleOpenKeysDialog() {
    const keysDialogOverlay = document.getElementById('keys-dialog-overlay');
    const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
    
    // Load current API key from storage
    const currentGeminiKey = storage.get('setting:gemini_api_key') || '';
    geminiApiKeyInput.value = currentGeminiKey;
    
    // Show the dialog
    keysDialogOverlay.classList.add('active');
}

// Handle close API keys dialog
function handleCloseKeysDialog() {
    const keysDialogOverlay = document.getElementById('keys-dialog-overlay');
    keysDialogOverlay.classList.remove('active');
}

// Handle save API keys
function handleSaveKeys() {
    const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
    const geminiApiKey = geminiApiKeyInput.value.trim();
    
    // Save to storage
    storage.set('setting:gemini_api_key', geminiApiKey);
    
    console.log('[API Keys] Gemini API key saved');
    
    // Close dialog
    handleCloseKeysDialog();
}

// Handle toggle Gemini key visibility
function handleToggleGeminiKeyVisibility() {
    const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
    const toggleBtn = document.getElementById('toggle-gemini-key');
    
    if (geminiApiKeyInput.type === 'password') {
        geminiApiKeyInput.type = 'text';
        toggleBtn.innerHTML = `
            <svg class="eye-slash-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
            </svg>
        `;
    } else {
        geminiApiKeyInput.type = 'password';
        toggleBtn.innerHTML = `
            <svg class="eye-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
        `;
    }
}

// Handle hard layout reset
function handleHardLayoutReset() {
    // Confirm with the user before proceeding
    const confirmed = confirm('This will reset all layout preferences (panel heights, sidebar state, and view mode) for both mobile and desktop views. Do you want to continue?');
    
    if (!confirmed) {
        return;
    }
    
    // Remove all layout-related storage keys
    storage.remove('preferences:panelHeights');
    storage.remove('preferences:sidebarCollapsed');
    
    // Get DOM elements
    const editorPanel = document.querySelector('.editor-panel');
    const outputPanel = document.querySelector('.output-panel');
    const inputPanel = document.querySelector('.input-panel');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Force remove ALL possible CSS classes that could affect layout
    if (editorPanel) {
        editorPanel.classList.remove('panel-collapsed', 'maximized');
        editorPanel.style.cssText = ''; // Clear all inline styles
        editorPanel.removeAttribute('style');
    }
    
    if (outputPanel) {
        outputPanel.classList.remove('panel-collapsed', 'maximized');
        outputPanel.style.cssText = '';
        outputPanel.removeAttribute('style');
    }
    
    if (inputPanel) {
        inputPanel.classList.remove('panel-collapsed', 'maximized');
        inputPanel.style.cssText = '';
        inputPanel.removeAttribute('style');
    }
    
    if (mainContent) {
        mainContent.style.cssText = '';
        mainContent.removeAttribute('style');
        // Critical: Ensure main-content stays within viewport
        mainContent.style.position = 'relative';
        mainContent.style.overflow = 'hidden';
    }
    
    // Reset in-memory panel states
    maximizedPanel = null;
    panelStates = {
        editor: { collapsed: false, originalHeight: null, wasCollapsedBeforeMaximize: false },
        output: { collapsed: false, originalHeight: null, wasCollapsedBeforeMaximize: false },
        input: { collapsed: false, originalHeight: null, wasCollapsedBeforeMaximize: false }
    };
    
    // Reset sidebar state
    isSidebarCollapsed = false;
    if (sidebar) {
        sidebar.classList.remove('collapsed');
        sidebar.style.cssText = '';
        sidebar.removeAttribute('style');
    }
    
    // Reset body classes
    document.body.classList.remove('mobile-mode');
    
    // Reset view mode to device default
    const defaultViewMode = window.isMobile() ? 'mobile' : 'desktop';
    storage.set('setting:view_mode', defaultViewMode);
    
    // Apply the view mode (this will set correct classes and states)
    applyViewMode(defaultViewMode);
    
    // Update view mode buttons in settings dialog
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        const viewMode = btn.getAttribute('data-view-mode');
        if (viewMode === defaultViewMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Force Monaco Editor to relayout after a short delay
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
        
        // Double-check and force visibility and positioning on all panels
        if (editorPanel) {
            editorPanel.style.display = '';
            editorPanel.style.height = '';
            editorPanel.style.minHeight = '';
            editorPanel.style.maxHeight = '';
            editorPanel.style.flex = '';
            editorPanel.style.position = 'relative';
            editorPanel.style.top = '0';
            editorPanel.style.transform = 'none';
        }
        
        // Ensure all panels are visible and properly positioned
        [editorPanel, outputPanel, inputPanel].forEach(panel => {
            if (panel) {
                panel.style.display = '';
                panel.style.visibility = 'visible';
                panel.style.opacity = '1';
                panel.style.position = 'relative';
                panel.style.top = '0';
                panel.style.bottom = '0';
                panel.style.transform = 'none';
                panel.style.marginTop = '';
                panel.style.marginBottom = '';
            }
        });
        
        // Ensure main-content container is properly bounded
        if (mainContent) {
            mainContent.style.position = 'relative';
            mainContent.style.overflow = 'hidden';
            mainContent.style.height = '100%';
            mainContent.style.minHeight = '0';
        }
    }, 100);
    
    // Additional forced layout after Monaco layout
    setTimeout(() => {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }, 400);
    
    console.log('[Settings] Hard layout reset completed - session updated without reload');
    alert('Layout has been reset to defaults.');
    
    // Close the settings dialog
    handleCloseSettingsDialog();
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

// Repair malformed JSON
function repairJSON(jsonString) {
    let cleaned = jsonString.trim();
    
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/^```json?\s*/i, '');
    cleaned = cleaned.replace(/\s*```\s*$/i, '');
    cleaned = cleaned.trim();
    
    // Try to find JSON object in the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }
    
    // Count opening and closing braces
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    
    // If starts with { but missing closing braces
    if (cleaned.startsWith('{') && openBraces > closeBraces) {
        const missing = openBraces - closeBraces;
        console.log(`[JSON Repair] Adding ${missing} missing closing brace(s)`);
        cleaned += '}'.repeat(missing);
    }
    
    // Try to fix trailing commas before closing braces
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    
    // Try to fix unescaped quotes in string values (basic attempt)
    // This is a simple heuristic and may not work for all cases
    try {
        // Test if it parses now
        JSON.parse(cleaned);
        return cleaned;
    } catch (e) {
        // If still fails, try removing trailing incomplete key-value pairs
        const lastCommaIndex = cleaned.lastIndexOf(',');
        if (lastCommaIndex > 0) {
            const beforeComma = cleaned.substring(0, lastCommaIndex);
            const afterComma = cleaned.substring(lastCommaIndex + 1).trim();
            
            // Check if what comes after the comma looks incomplete (no colon)
            if (afterComma && !afterComma.includes(':')) {
                console.log('[JSON Repair] Removing incomplete trailing entry');
                cleaned = beforeComma + '\n}';
            }
        }
    }
    
    return cleaned;
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
            console.warn('Missing pythonCode, will use default template');
            data.pythonCode = null; // Will be filled with simple boilerplate by caller
        }
        
        if (!data.csharpCode || typeof data.csharpCode !== 'string') {
            console.warn('Missing csharpCode, will use default template');
            data.csharpCode = null; // Will be filled with simple boilerplate by caller
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
    const pythonCode = projectData.pythonCode || `# ${projectData.name}\n# TODO: Implement your solution here\n`;
    const csharpCode = projectData.csharpCode || `// ${projectData.name}\nclass Program\n{\n    static void Main()\n    {\n        // TODO: Implement your solution here\n    }\n}`;
    
    storage.set(`project:${finalProjectId}:python:code`, pythonCode);
    storage.set(`project:${finalProjectId}:csharp:code`, csharpCode);
    
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

// Library dialog state
let selectedLibraryItem = null;

// Handle open library dialog
function handleOpenLibraryDialog() {
    const libraryDialogOverlay = document.getElementById('library-dialog-overlay');
    libraryDialogOverlay.classList.add('active');
    
    // Always rebuild the tree
    buildLibraryTree();
    
    // Reset selection
    selectedLibraryItem = null;
    updateLibraryOpenButton();
}

// Handle close library dialog
function handleCloseLibraryDialog() {
    const libraryDialogOverlay = document.getElementById('library-dialog-overlay');
    libraryDialogOverlay.classList.remove('active');
    selectedLibraryItem = null;
    updateLibraryOpenButton();
}

// Handle library open button
function handleLibraryOpen() {
    if (!selectedLibraryItem) return;
    
    // Get the problem name
    const problemName = selectedLibraryItem.name;

    // Get the problem description
    const description = selectedLibraryItem.description;
    
    // Put it in the Add New Project textarea
    const dialogInput = document.getElementById('project-dialog-input');
    dialogInput.value = `${problemName}\n\n${description}`;
    
    // Populate the meta input tags.
    const metaName = document.getElementById('project-dialog-meta-name');
    metaName.value = problemName;

    // Close library dialog
    handleCloseLibraryDialog();
}

// Update library open button state
function updateLibraryOpenButton() {
    const openBtn = document.getElementById('library-open-btn');
    openBtn.disabled = !selectedLibraryItem;
}

// Build library tree structure
function buildLibraryTree() {
    const libraryExplorer = document.getElementById('library-explorer');
    libraryExplorer.innerHTML = '';
    
    // Check if problemLibrary exists
    if (typeof window.problemLibrary === 'undefined') {
        console.error('problemLibrary is not defined!');
        libraryExplorer.innerHTML = '<div style="padding: 20px; color: var(--text-secondary);">Error: Library data not loaded</div>';
        return;
    }
    
    // Build tree from problemLibrary
    Object.keys(window.problemLibrary).forEach(rootName => {
        const rootItem = createTreeFolder(rootName, window.problemLibrary[rootName], 0);
        libraryExplorer.appendChild(rootItem);
    });
}

// Create a tree folder element
function createTreeFolder(name, content, level) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'tree-item';
    
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'tree-node folder';
    nodeDiv.style.paddingLeft = `${level * 12}px`;
    
    // Toggle arrow
    const toggle = document.createElement('span');
    toggle.className = 'tree-toggle';
    toggle.innerHTML = `<svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4z"/></svg>`;
    
    // Folder icon - improved with closed/open state
    const icon = document.createElement('span');
    icon.className = 'tree-icon';
    icon.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M.54 3.87L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
    </svg>`;
    
    // Label
    const label = document.createElement('span');
    label.className = 'tree-label';
    label.textContent = name;
    
    nodeDiv.appendChild(toggle);
    nodeDiv.appendChild(icon);
    nodeDiv.appendChild(label);
    
    // Children container
    const childrenDiv = document.createElement('div');
    childrenDiv.className = 'tree-children';
    
    // Add children
    Object.keys(content).forEach(childName => {
        const childContent = content[childName];
        
        if (typeof childContent === 'string') {
            // This is a file (problem)
            const fileItem = createTreeFile(childName, childContent, level + 1);
            childrenDiv.appendChild(fileItem);
        } else {
            // This is a folder (category)
            const folderItem = createTreeFolder(childName, childContent, level + 1);
            childrenDiv.appendChild(folderItem);
        }
    });
    
    itemDiv.appendChild(nodeDiv);
    itemDiv.appendChild(childrenDiv);
    
    // Toggle functionality
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle.classList.toggle('expanded');
        childrenDiv.classList.toggle('expanded');
    });
    
    // Expand on folder click
    nodeDiv.addEventListener('click', () => {
        toggle.classList.toggle('expanded');
        childrenDiv.classList.toggle('expanded');
    });
    
    return itemDiv;
}

// Helper function to check if a dry run exists for a problem
function getDryRunPath(problemName) {
    // Check if the problem name has a star emoji (indicates animation available)
    if (!problemName.includes('⭐')) {
        return null;
    }
    
    // Remove star emoji and trim
    const cleanName = problemName.replace(/\s*⭐\s*/g, '').trim();
    // Convert to kebab-case for folder name
    const folderName = cleanName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
    
    return `projects/${folderName}/dryrun.html`;
}

// Create a tree file element
function createTreeFile(name, description, level) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'tree-item';
    
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'tree-node file';
    nodeDiv.style.paddingLeft = `${level * 12 + 20}px`;
    
    // File icon - improved document icon with corner fold
    const icon = document.createElement('span');
    icon.className = 'tree-icon';
    icon.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z"/>
    </svg>`;
    
    // Label
    const label = document.createElement('span');
    label.className = 'tree-label';
    label.textContent = name;
    
    nodeDiv.appendChild(icon);
    nodeDiv.appendChild(label);
    
    // Check if this problem has a dry run animation
    const dryRunPath = getDryRunPath(name);
    if (dryRunPath) {
        // Add a preview button
        const previewBtn = document.createElement('button');
        previewBtn.className = 'tree-preview-btn';
        previewBtn.title = 'Preview Animation';
        previewBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
        </svg>`;
        
        previewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDryRunPreview(dryRunPath);
        });
        
        nodeDiv.appendChild(previewBtn);
    }
    
    // Click handler for file selection
    nodeDiv.addEventListener('click', () => {
        // Remove previous selection
        document.querySelectorAll('.tree-node.selected').forEach(node => {
            node.classList.remove('selected');
        });
        
        // Add selection to this node
        nodeDiv.classList.add('selected');
        
        // Store selected item
        selectedLibraryItem = {
            name: name,
            description: description
        };
        
        updateLibraryOpenButton();
    });
    
    itemDiv.appendChild(nodeDiv);
    
    return itemDiv;
}

// Open dry run preview from library
function openDryRunPreview(dryRunPath) {
    const dryRunDialogOverlay = document.getElementById('dry-run-dialog-overlay');
    const dryRunIframe = document.getElementById('dry-run-iframe');
    const dryRunError = document.getElementById('dry-run-error');
    
    // Store the current state (library dialog is open)
    window.libraryDialogWasOpen = true;
    
    // Hide library dialog
    const libraryDialogOverlay = document.getElementById('library-dialog-overlay');
    libraryDialogOverlay.classList.remove('active');
    
    // Show dry run dialog
    dryRunIframe.src = dryRunPath;
    dryRunIframe.style.display = 'block';
    dryRunError.style.display = 'none';
    dryRunDialogOverlay.classList.add('active');
    
    // Maximize dialog on show
    const dryRunDialog = document.querySelector('.dry-run-dialog');
    isDryRunMaximized = true;
    dryRunDialog.classList.add('maximized');
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
            const parsed = parseMarkdown(testMd);
            console.log('Using marked.js for parsing');
            
            outputDiv.innerHTML = `<div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px;">${parsed}</div>`;
            console.log('Markdown test successful!');
            console.log('Parsed HTML:', parsed);
        } catch (e) {
            console.error('Markdown test failed:', e);
            outputDiv.innerHTML = `<div style="color: red; padding: 12px;">Error: ${e.message}</div>`;
        }
    }
};