// Initialize Storage
const storage = new Storage();

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
    
    // Initialize project metadata for all configured projects
    initializeProjectMetadata();
    
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
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Add keyboard shortcut for sidebar toggle (Ctrl+B)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            handleSidebarToggle();
        }
    });
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
    
    isLLMResponding = true;
    updateButtonStates();
    
    // Get current code from editor
    const currentCode = monacoEditor ? monacoEditor.getValue() : '';
    const activeLanguageBtn = document.querySelector('.language-btn.active');
    const currentLanguage = activeLanguageBtn ? activeLanguageBtn.getAttribute('data-language') : 'csharp';
    
    // Simulate LLM response
    simulateLLMResponse(message, currentCode, currentLanguage);
    
    // Clear input
    userInput.value = '';
}

// Handle stop message
function handleStopMessage() {
    isLLMResponding = false;
    updateButtonStates();
    
    // Add stopping message to output
    const outputDiv = document.getElementById('markdown-output');
    outputDiv.innerHTML += '<p><em>Response stopped by user.</em></p>';
}

// Handle clear output
function handleClearOutput() {
    document.getElementById('markdown-output').innerHTML = '';
    // Remove the chat history key entirely (clear the list)
    if (currentProject) {
        storage.remove(`project:${currentProject}:chatHistory`);
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
        
        const projectDifficulty = document.createElement('span');
        projectDifficulty.className = `project-difficulty ${project.difficulty}`;
        projectDifficulty.textContent = project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1);
        
        projectItem.appendChild(projectName);
        projectItem.appendChild(projectDifficulty);
        
        // Re-attach click handler
        projectItem.addEventListener('click', handleProjectClick);
        
        projectList.appendChild(projectItem);
    });
}

// Update button states
function updateButtonStates() {
    const sendBtn = document.getElementById('send-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    sendBtn.disabled = isLLMResponding;
    stopBtn.disabled = !isLLMResponding;
}

// Simulate LLM response
function simulateLLMResponse(userMessage, code, language) {
    const outputDiv = document.getElementById('markdown-output');
    
    // Add user message to output
    const userMessageHtml = `
        <div style="background: var(--accent-color); color: var(--accent-text); padding: 8px 12px; border-radius: 6px; margin-bottom: 16px;">
            <strong>You:</strong> ${escapeHtml(userMessage)}
        </div>
    `;
    
    outputDiv.innerHTML += userMessageHtml;
    saveChatMessage(currentProject, userMessageHtml);
    
    // Simulate typing effect
    const responses = [
        `## Analysis of ${currentProject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}

Let me help you with this problem. Here's my analysis:

### Approach
For this problem, we can use a **hash map** approach to achieve O(n) time complexity.

### Algorithm
1. Create a hash map to store numbers and their indices
2. Iterate through the array
3. For each number, calculate the complement (target - current number)
4. Check if the complement exists in the hash map
5. If found, return the indices

### Code Implementation
\`\`\`${language}
// Optimized solution using hash map
${generateSampleSolution(currentProject, language)}
\`\`\`

### Time Complexity: O(n)
### Space Complexity: O(n)

Would you like me to explain any part of this solution in more detail?`,

        `## Code Review

I've analyzed your current code. Here are some suggestions:

### Strengths ✅
- Good variable naming
- Clear structure

### Improvements 💡
- Consider edge cases (empty array, no solution)
- Add input validation
- Optimize for better performance

### Next Steps
1. Test with sample inputs
2. Handle edge cases
3. Consider alternative approaches

Let me know if you'd like me to help implement any of these improvements!`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
        if (isLLMResponding) {
            // Parse markdown to HTML
            let parsedContent = randomResponse;
            try {
                if (typeof marked !== 'undefined') {
                    // Use marked.js if available
                    parsedContent = marked.parse ? marked.parse(randomResponse) : marked(randomResponse);
                } else {
                    // Fallback to simple parser
                    console.warn('marked.js not available, using simple parser');
                    parsedContent = simpleMarkdownParse(randomResponse);
                }
            } catch (e) {
                console.error('Error parsing markdown:', e);
                // Ultimate fallback to simple parser
                parsedContent = simpleMarkdownParse(randomResponse);
            }
            
            const assistantMessageHtml = `
                <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px; border-left: 3px solid var(--accent-color);">
                    ${parsedContent}
                </div>
            `;
            
            outputDiv.innerHTML += assistantMessageHtml;
            saveChatMessage(currentProject, assistantMessageHtml);
            outputDiv.scrollTop = outputDiv.scrollHeight;
            
            isLLMResponding = false;
            updateButtonStates();
        }
    }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds
}

// Generate sample solution
function generateSampleSolution(projectId, language) {
    const solutions = {
        'two-sum': {
            javascript: `var twoSum = function(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
};`,
            python: `def twoSum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []`
        }
    };
    
    return solutions[projectId]?.[language] || `// Sample solution for ${projectId} in ${language}`;
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
    // Use lrange to get all chat messages
    // Note: We need to get the length first, then use lrange(key, 0, length)
    const historyLength = storage.llen(`project:${projectId}:chatHistory`);
    const history = storage.lrange(`project:${projectId}:chatHistory`, 0, historyLength);
    
    if (history && Array.isArray(history) && history.length > 0) {
        outputDiv.innerHTML = history.join('');
    } else {
        outputDiv.innerHTML = '';
    }
}

// Save chat message to history
function saveChatMessage(projectId, messageHtml) {
    // Use rpush to append message to the end of the chat history
    storage.rpush(`project:${projectId}:chatHistory`, messageHtml);
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

// Initialize project metadata for all configured projects
function initializeProjectMetadata() {
    Object.keys(projectConfig).forEach(projectId => {
        // Register the project ID in our master list
        registerProjectId(projectId);
        
        const existingMetadata = storage.get(`project:${projectId}:metadata`);
        
        // If metadata doesn't exist or is missing name/difficulty, update it
        if (!existingMetadata || !existingMetadata.name || !existingMetadata.difficulty) {
            const metadata = existingMetadata || {};
            metadata.name = projectConfig[projectId].name;
            metadata.difficulty = projectConfig[projectId].difficulty;
            
            // Don't overwrite existing timestamps
            if (!metadata.firstAccessed) {
                metadata.firstAccessed = new Date().toISOString();
            }
            if (!metadata.lastAccessed) {
                metadata.lastAccessed = metadata.firstAccessed;
            }
            
            storage.set(`project:${projectId}:metadata`, metadata);
        }
    });
    
    console.log('[Init] Project metadata initialized for', Object.keys(projectConfig).length, 'projects');
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
    // Use llen to get the count of chat messages
    const chatMessageCount = storage.llen(`project:${projectId}:chatHistory`);
    
    return {
        lastAccessed: metadata.lastAccessed,
        firstAccessed: metadata.firstAccessed,
        completed: metadata.completed || false,
        completedAt: metadata.completedAt,
        chatMessageCount: chatMessageCount
    };
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