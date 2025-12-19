class MessengerWidget {
    constructor() {
        this.widget = document.createElement('div');
        this.isMinimized = true;
        this.conversations = [];
        this.currentConvo = null;
        this.showingConversationList = true;
        this.conversationListScroll = 0;
        
        this.initialize();
        this.loadMessages();
    }

    initialize() {
        // Widget structure
        this.widget.className = 'messenger-widget widget-minimized';
        this.widget.innerHTML = `
            <div class="widget-minimized">
                <i class="fas fa-envelope"></i>
            </div>
            <div class="widget-expanded" style="display: none">
                <div class="widget-header">
                    <h3>Messenger</h3>
                    <div class="widget-controls">
                        <button class="widget-back" style="display: none">←</button>
                        <button class="widget-maximize"><i class="fas fa-external-link-alt"></i></button>
                        <button class="widget-close">&times;</button>
                    </div>
                </div>
                <div class="widget-body"></div>
            </div>
        `;

        // Cache control elements
        this.backButton = this.widget.querySelector('.widget-back');
        this.maximizeButton = this.widget.querySelector('.widget-maximize');
        this.headerTitle = this.widget.querySelector('.widget-header h3');

        // Event listeners
        this.widget.querySelector('.widget-minimized').addEventListener('click', () => this.toggleView());
        this.widget.querySelector('.widget-close').addEventListener('click', () => this.toggleView());
        this.maximizeButton.addEventListener('click', () => {
            window.location.href = 'messenger/chat_window.html';
        });
        this.backButton.addEventListener('click', () => this.showConversationList());

        document.body.appendChild(this.widget);
    }

    async loadMessages() {
        try {
            const response = await fetch('messenger/messages.json');
            this.conversations = await response.json();
            this.showConversationList();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    showConversationList() {
        // Update header state
        this.backButton.style.display = 'none';
        this.maximizeButton.style.display = 'block';
        this.headerTitle.textContent = 'Messenger';
        this.showingConversationList = true;

        // Render conversations
        const body = this.widget.querySelector('.widget-body');
         body.innerHTML = `
        <ul class="conversation-list">
            ${this.conversations.map(convo => {
                const lastMessage = convo.messages[convo.messages.length - 1];
                return `
                    <li class="conversation-item" data-id="${this.conversations.indexOf(convo)}">
                        <div class="conversation-header">
                            <div class="conversation-participants">${convo.participants.filter(p => p !== 'You').join(', ')}
                            </div>
                            <div class="conversation-time">
                                ${new Date(lastMessage.timestamp).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                })}
                            </div>
                        </div>
                        <div class="conversation-preview">
                            ${lastMessage.text}
                        </div>
                    </li>
                `;
            }).join('')}
        </ul>
    `;

        // Add conversation click handlers
        body.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Save scroll position before leaving list
                this.conversationListScroll = body.scrollTop;
                this.currentConvo = this.conversations[e.currentTarget.dataset.id];
                this.showingConversationList = false;
                this.renderMessages();
                this.backButton.style.display = 'block';
                this.maximizeButton.style.display = 'none';
                this.headerTitle.textContent = 
                    this.currentConvo.participants.filter(p => p !== 'You').join(', ');
            });
        });

        // Restore scroll position after rendering
        body.scrollTop = this.conversationListScroll;
    }

    renderMessages() {
        const body = this.widget.querySelector('.widget-body');
        body.innerHTML = `
            <div class="chat-messages">
                ${this.currentConvo.messages.map(msg => `
                    <div class="chat-message ${msg.sender === 'user' ? 'sender' : 'receiver'}">
                        ${msg.sender !== 'user' ? `
                            <div class="avatar" 
                                 data-name="${msg.sender}"
                                 style="background-image: url('./messenger/${msg.avatar}')">
                            </div>
                        ` : ''}
                        <div class="message-bubble">
                            ${msg.text}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        body.scrollTop = body.scrollHeight;
    }

    toggleView() {
        const wasMinimized = this.isMinimized;
        this.isMinimized = !this.isMinimized;

        // Save scroll position when minimizing from conversation list
        if (!wasMinimized && this.showingConversationList) {
            const body = this.widget.querySelector('.widget-body');
            this.conversationListScroll = body.scrollTop;
        }

        this.widget.querySelector('.widget-minimized').style.display = 
            this.isMinimized ? 'flex' : 'none';
        this.widget.querySelector('.widget-expanded').style.display = 
            this.isMinimized ? 'none' : 'block';
        this.widget.className = `messenger-widget ${this.isMinimized ? 'widget-minimized' : 'widget-expanded'}`;
        
        // Reset to conversation list when expanding if needed
        if (!this.isMinimized && this.showingConversationList) {
            this.showConversationList();
        }
    }
}

// Initialize widget when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new MessengerWidget();
});