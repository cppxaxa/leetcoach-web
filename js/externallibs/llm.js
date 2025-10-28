/* Don't edit */

/**
 * Interface for LLM implementations
 */
class ILLM {
    /**
     * Get a response from a simple prompt
     * @param {string} prompt - The prompt to send
     * @returns {Promise<string>} The LLM response
     */
    async answer(prompt) {
        throw new Error('Method "answer" must be implemented');
    }

    /**
     * Get a response from chat history
     * @param {Array} chatHistory - Array of chat messages
     * @returns {Promise<string>} The LLM response
     */
    async chat(chatHistory) {
        throw new Error('Method "chat" must be implemented');
    }

    /**
     * Get a response from chat history with system prompt
     * @param {string} system - System prompt
     * @param {Array} chatHistory - Array of chat messages
     * @returns {Promise<string>} The LLM response
     */
    async chatEx(system, chatHistory) {
        throw new Error('Method "chatEx" must be implemented');
    }

    /**
     * Get a response from a prompt with system prompt
     * @param {string} system - System prompt
     * @param {string} prompt - The prompt to send
     * @returns {Promise<string>} The LLM response
     */
    async answerEx(system, prompt) {
        throw new Error('Method "answerEx" must be implemented');
    }
}

class GeminiLLM extends ILLM {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
    }

    /**
     * Get a response from a simple prompt
     */
    async answer(prompt) {
        const contents = this._buildContentsFromPrompt(prompt);
        return await this._sendRequest(contents);
    }

    /**
     * Get a response from chat history
     */
    async chat(chatHistory) {
        const contents = this._buildContentsFromChatHistory(chatHistory);
        return await this._sendRequest(contents);
    }

    /**
     * Get a response from chat history with system prompt
     */
    async chatEx(system, chatHistory) {
        const contents = this._buildContentsFromChatHistory(chatHistory, system);
        return await this._sendRequest(contents);
    }

    /**
     * Get a response from a prompt with system prompt
     */
    async answerEx(system, prompt) {
        const contents = this._buildContentsFromPrompt(prompt, system);
        return await this._sendRequest(contents);
    }

    _buildContentsFromPrompt(prompt, system = '') {
        const contents = [];
        
        if (system) {
            contents.push({
                parts: [{ text: system }],
                role: 'user'
            });
            contents.push({
                parts: [{ text: 'Understood.' }],
                role: 'model'
            });
        }

        contents.push({
            parts: [{ text: prompt }]
        });

        return contents;
    }

    _buildContentsFromChatHistory(chatHistory, system = '') {
        const contents = [];

        if (system) {
            contents.push({
                parts: [{ text: system }],
                role: 'user'
            });
            contents.push({
                parts: [{ text: 'Understood.' }],
                role: 'model'
            });
        }

        // Convert chat history to Gemini format
        chatHistory.forEach(message => {
            contents.push({
                parts: [{ text: message.content || message.text }],
                role: message.role === 'assistant' ? 'model' : 'user'
            });
        });

        return contents;
    }

    async _sendRequest(contents, retryCount = 3) {
        const url = `${this.baseUrl}?key=${this.apiKey}`;

        const body = JSON.stringify({
            contents: contents
        });

        for (let i = 0; i < retryCount; i++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                });

                if (response.ok) {
                    const data = await response.json();
                    return this._parseResponse(data);
                } else {
                    const errorText = await response.text();
                    console.error(`Gemini API error (${response.status}): ${errorText}`);
                    
                    if (i === retryCount - 1) {
                        throw new Error(`Failed to get response from Gemini: ${response.status} ${errorText}`);
                    }
                }
            } catch (error) {
                console.error(`Failed to send request to Gemini LLM: ${error.message}`);
                
                if (i === retryCount - 1) {
                    throw error;
                }
            }

            // Wait 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    _parseResponse(data) {
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                return candidate.content.parts[0].text;
            }
        }
        throw new Error('Invalid response format from Gemini API');
    }
}

class MLCAIWebLLM extends ILLM {
    constructor() {
        super();
        this.engine = null;
        this.modelId = "Llama-3.2-3B-Instruct-q4f16_1-MLC";
        this.initialized = false;
        this.cancelled = false;
    }

    _showLoadingProgress() {
        const overlay = document.getElementById('model-loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
        
        // Set up cancel button
        const cancelBtn = document.getElementById('model-loading-cancel-btn');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                this.cancelled = true;
                this._hideLoadingProgress();
                this._updateProgress(0, 'Cancelled', 'Model loading was cancelled by user');
            };
        }
    }

    _hideLoadingProgress() {
        const overlay = document.getElementById('model-loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    _updateProgress(progress, text, details) {
        const progressFill = document.getElementById('model-progress-fill');
        const progressText = document.getElementById('model-progress-text');
        const progressDetails = document.getElementById('model-progress-details');
        
        if (progressFill) {
            progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
        }
        if (progressText) {
            progressText.textContent = text || 'Loading...';
        }
        if (progressDetails) {
            progressDetails.textContent = details || '';
        }
    }

    async _ensureInitialized() {
        if (this.initialized) {
            return;
        }

        if (this.cancelled) {
            throw new Error('Model loading was cancelled');
        }

        try {
            // Wait for webllm to be available
            if (typeof webllm === 'undefined') {
                throw new Error('MLC AI WebLLM library not loaded. Please ensure the script is included in your HTML.');
            }

            // Show loading progress
            this._showLoadingProgress();
            this._updateProgress(0, 'Initializing...', 'Starting model download...');

            // Initialize the WebLLM engine
            this.engine = await webllm.CreateMLCEngine(this.modelId, {
                initProgressCallback: (progress) => {
                    if (this.cancelled) {
                        throw new Error('Model loading was cancelled');
                    }
                    
                    console.log('Model loading progress:', progress);
                    
                    // Update the progress UI
                    const percentText = `${(progress.progress * 100).toFixed(1)}%`;
                    this._updateProgress(
                        progress.progress,
                        `${percentText} - ${progress.text}`,
                        `Time elapsed: ${progress.timeElapsed}s`
                    );
                }
            });
            
            this.initialized = true;
            console.log('MLC AI WebLLM initialized successfully');
            
            // Show completion
            this._updateProgress(1, 'Model loaded successfully!', 'Ready to use');
            
            // Hide after a short delay
            setTimeout(() => {
                this._hideLoadingProgress();
            }, 1500);
            
        } catch (error) {
            console.error('Failed to initialize MLC AI WebLLM:', error);
            
            // Show error in progress UI
            this._updateProgress(0, 'Error', error.message);
            
            // Hide after showing error
            setTimeout(() => {
                this._hideLoadingProgress();
            }, 3000);
            
            throw new Error(`Failed to initialize WebLLM: ${error.message}`);
        }
    }

    /**
     * Get a response from a simple prompt
     */
    async answer(prompt) {
        await this._ensureInitialized();
        
        const messages = [
            { role: 'user', content: prompt }
        ];

        return await this._chat(messages);
    }

    /**
     * Get a response from chat history
     */
    async chat(chatHistory) {
        await this._ensureInitialized();
        
        const messages = chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content || msg.text
        }));

        return await this._chat(messages);
    }

    /**
     * Get a response from chat history with system prompt
     */
    async chatEx(system, chatHistory) {
        await this._ensureInitialized();
        
        const messages = [
            { role: 'system', content: system },
            ...chatHistory.map(msg => ({
                role: msg.role,
                content: msg.content || msg.text
            }))
        ];

        return await this._chat(messages);
    }

    /**
     * Get a response from a prompt with system prompt
     */
    async answerEx(system, prompt) {
        await this._ensureInitialized();
        
        const messages = [
            { role: 'system', content: system },
            { role: 'user', content: prompt }
        ];

        return await this._chat(messages);
    }

    async _chat(messages) {
        try {
            const completion = await this.engine.chat.completions.create({
                messages: messages
            });

            if (completion.choices && completion.choices.length > 0) {
                return completion.choices[0].message.content;
            }

            throw new Error('No response from WebLLM');
        } catch (error) {
            console.error('WebLLM chat error:', error);
            throw new Error(`WebLLM chat failed: ${error.message}`);
        }
    }

    /**
     * Clean up resources
     */
    async dispose() {
        if (this.engine) {
            await this.engine.unload();
            this.engine = null;
            this.initialized = false;
        }
    }
}

class Llm {
    constructor(storage) {
        this.storage = storage;
        this.cachedInstance = null;
        this.cachedType = null;
        this.cachedApiKey = null;

        let type = this.storage.get('setting:llm_type');
        this.type = type;
    }

    async setType(type) {
        this.type = type;

        // Dispose of old instance if type changed
        if (this.cachedInstance && this.cachedType !== type) {
            await this._disposeInstance();
        }

        try {
            this.llm = this._get();
        } catch (error) {
            console.error('Failed to honor LLM type:', error);
        }
    }

    initSettingPlaceholders() {
        if (this.storage.get('setting:gemini_api_key') == null) {
            this.storage.set('setting:gemini_api_key', '');
        }

        if (this.storage.get('setting:llm_type') == null) {
            this.storage.set('setting:llm_type', 'gemini');
        }
    }

    async _disposeInstance() {
        if (this.cachedInstance && typeof this.cachedInstance.dispose === 'function') {
            try {
                await this.cachedInstance.dispose();
                console.log('LLM instance disposed successfully');
            } catch (error) {
                console.error('Error disposing LLM instance:', error);
            }
        }
        this.cachedInstance = null;
        this.cachedType = null;
        this.cachedApiKey = null;
    }

    _get() {
        if (this.type == 'gemini') {
            let key = this.storage.get('setting:gemini_api_key');
            if (!key) {
                throw new Error('Gemini API key is not set in settings.');
            }
            
            // Reuse cached instance if type and API key haven't changed
            if (this.cachedInstance && this.cachedType === 'gemini' && this.cachedApiKey === key) {
                return this.cachedInstance;
            }
            
            // Create new instance
            this.cachedInstance = new GeminiLLM(key);
            this.cachedType = 'gemini';
            this.cachedApiKey = key;
            return this.cachedInstance;
            
        } else if (this.type == 'mlcaiwebllm') {
            // Reuse cached instance if type hasn't changed
            if (this.cachedInstance && this.cachedType === 'mlcaiwebllm') {
                return this.cachedInstance;
            }
            
            // Create new instance
            this.cachedInstance = new MLCAIWebLLM();
            this.cachedType = 'mlcaiwebllm';
            this.cachedApiKey = null;
            return this.cachedInstance;
        }
    }
}
