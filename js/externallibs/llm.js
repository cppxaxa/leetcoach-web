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

class Llm {
    constructor(storage) {
        this.storage = storage;

        let type = this.storage.get('setting:llm_type');
        this.type = type;
    }

    setType(type) {
        this.type = type;
        this.llm = this._get();
    }

    initSettingPlaceholders() {
        if (this.storage.get('setting:gemini_api_key') == null) {
            this.storage.set('setting:gemini_api_key', '');
        }

        if (this.storage.get('setting:llm_type') == null) {
            this.storage.set('setting:llm_type', 'gemini');
        }
    }

    _get() {
        if (this.type == 'gemini') {
            let key = this.storage.get('setting:gemini_api_key');
            if (!key) {
                throw new Error('Gemini API key is not set in settings.');
            }
            return new GeminiLLM(key);
        }
    }
}
