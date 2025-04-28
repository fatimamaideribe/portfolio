document.addEventListener('DOMContentLoaded', function() {
    // Terminal functionality
    const commandInput = document.getElementById('command-input');
    const terminalBody = document.querySelector('.terminal-body');
    const terminalOutput = document.querySelector('.terminal-output');
    const terminalContainer = document.querySelector('.terminal-container');
    const clock = document.getElementById('clock');
    
    // Terminal window controls
    const minimizeBtn = document.querySelector('.minimize');
    const maximizeBtn = document.querySelector('.maximize');
    const closeBtn = document.querySelector('.close');

    minimizeBtn.addEventListener('click', () => {
        terminalContainer.style.height = '40px';
        terminalBody.style.display = 'none';
    });

    maximizeBtn.addEventListener('click', () => {
        if (terminalContainer.style.height === '40px') {
            terminalContainer.style.height = '300px';
            terminalBody.style.display = 'block';
        } else {
            terminalContainer.style.width = '100%';
            terminalContainer.style.height = '100%';
            terminalContainer.style.top = '0';
            terminalContainer.style.left = '0';
        }
    });

    closeBtn.addEventListener('click', () => {
        terminalContainer.style.display = 'none';
    });

    // Update clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Command handling
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            processCommand(command);
            this.value = '';
        }
    });

    function processCommand(command) {
        terminalOutput.innerHTML += `\n> ${command}\n`;

        switch(command) {
            case 'help':
                terminalOutput.innerHTML += `
Available commands:
  help       - Display this help menu
  about      - Show information about me
  projects   - View my project portfolio
  skills     - List my technical skills
  contact    - Display contact information
  clear      - Clear the terminal screen
  folders    - Show available folders
  create     - Create a new sticky note
  matrix     - Enter the Matrix
  ls         - List directory contents
  cd         - Change directory
  cat        - Display file contents
  sudo       - Nice try, you're not root 😏
  
Try to find hidden commands for easter eggs!`;
                break;
            case 'about':
                openModal('about-modal');
                terminalOutput.innerHTML += 'Opening about information...\n';
                break;
            case 'projects':
                openModal('projects-modal');
                terminalOutput.innerHTML += 'Loading project portfolio...\n';
                break;
            case 'skills':
                openModal('skills-modal');
                terminalOutput.innerHTML += 'Displaying skills and expertise...\n';
                break;
            case 'contact':
                openModal('contact-modal');
                terminalOutput.innerHTML += 'Opening contact information...\n';
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'folders':
                terminalOutput.innerHTML += `
Available folders:
  Projects   - My portfolio of work
  About Me   - Personal information
  Skills     - Technical capabilities
  Contact    - Ways to reach me
  Snake*Search - Interactive A* pathfinding demo`;
                break;
            case 'create':
                createStickyNote();
                terminalOutput.innerHTML += 'Created a new sticky note!\n';
                break;
            case 'matrix':
                terminalOutput.innerHTML += 'Entering the Matrix...\n';
                document.body.classList.add('matrix-mode');
                setTimeout(() => {
                    document.body.classList.remove('matrix-mode');
                    terminalOutput.innerHTML += 'Matrix session ended. Reality restored.\n';
                }, 5000);
                break;
            case 'ls':
                terminalOutput.innerHTML += `
Desktop contents:
  📂 Projects
  📂 About Me
  📂 Skills
  📂 Contact
  📂 Snake*Search
  📝 Welcome Note
  📝 Easter Eggs Note`;
                break;
            case 'cd':
                terminalOutput.innerHTML += 'Usage: cd [directory]\n';
                break;
            case 'cat':
                terminalOutput.innerHTML += 'Usage: cat [filename]\n';
                break;
            case 'sudo':
                terminalOutput.innerHTML += 'Nice try, you\'re not root 😏\n';
                break;
            case 'hello':
            case 'hi':
                terminalOutput.innerHTML += 'Hello there! Nice to meet you. Type "help" to see what I can do.\n';
                break;
            case '42':
                terminalOutput.innerHTML += 'Yes, that is indeed the answer to life, the universe, and everything.\n';
                break;
            case 'coffee':
                terminalOutput.innerHTML += `
        ( (
         ) )
      .........
      |       |]
      \\       /
       \`-----'
                        
Error: Coffee machine not found. Please insert coin to continue.\n`;
                break;
            default:
                terminalOutput.innerHTML += `Command not found: ${command}. Type "help" for available commands.\n`;
        }
        
        // Scroll to the bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Modal functionality
    const overlay = document.querySelector('.overlay');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    function openModal(modalId) {
        // Hide all modals first
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Show the overlay
        overlay.style.display = 'block';
        
        // Show the requested modal
        document.getElementById(modalId).style.display = 'block';
    }
    
    function closeAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        overlay.style.display = 'none';
    }
    
    // Attach close events
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeAllModals();
        }
    });

    // Folder click handlers
    const folders = document.querySelectorAll('.folder');
    folders.forEach(folder => {
        folder.addEventListener('click', function() {
            const folderId = this.getAttribute('data-folder');
            openModal(folderId + '-modal');
        });
    });

    // Sticky note functionality
    function createStickyNote() {
        const note = document.createElement('div');
        note.className = 'sticky-note';
        note.style.top = Math.random() * 300 + 'px';
        note.style.left = Math.random() * 500 + 'px';
        const header = document.createElement('div');
        header.className = 'sticky-note-header';
        
        const title = document.createElement('span');
        title.textContent = 'New Note';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'delete-note';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', function() {
            note.remove();
        });
        
        const content = document.createElement('div');
        content.className = 'sticky-note-content';
        content.contentEditable = true;
        content.textContent = 'Click to edit this note...';
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        note.appendChild(header);
        note.appendChild(content);
        
        document.querySelector('.folder-area').appendChild(note);
        makeDraggable(note);
    }
    
    // Make existing notes draggable
    const stickyNotes = document.querySelectorAll('.sticky-note');
    stickyNotes.forEach(note => {
        makeDraggable(note);
        
        // Add delete functionality
        note.querySelector('.delete-note').addEventListener('click', function() {
            note.remove();
        });
    });
    
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.querySelector('.sticky-note-header').addEventListener('mousedown', dragMouseDown);
        
        function dragMouseDown(e) {
            e.preventDefault();
            // Get mouse position
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }

        function elementDrag(e) {
            e.preventDefault();
            // Calculate new position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Stop tracking mouse movements
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        }
    }

    // Initial focus on terminal input
    commandInput.focus();
    
    // Focus terminal input when clicking anywhere in terminal
    terminalBody.addEventListener('click', function() {
        commandInput.focus();
    });

    // Notebook functionality
    const notebook = document.querySelector('.notebook');
    const notebookContent = document.querySelector('.page-content');

    // Make notebook content editable
    notebookContent.addEventListener('click', () => {
        notebookContent.focus();
    });

    // Save notebook content
    function saveNotebookContent() {
        localStorage.setItem('notebookContent', notebookContent.innerHTML);
    }

    // Load notebook content
    function loadNotebookContent() {
        const savedContent = localStorage.getItem('notebookContent');
        if (savedContent) {
            notebookContent.innerHTML = savedContent;
        }
    }

    // Auto-save every 30 seconds
    setInterval(saveNotebookContent, 30000);

    // Load saved content on page load
    loadNotebookContent();

    // Update calendar widget
    function updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        
        if (dateElement) dateElement.textContent = dateStr;
        if (timeElement) timeElement.textContent = timeStr;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Weather Widget functionality
    function updateWeather() {
        // In a real implementation, you would fetch from a weather API
        const icons = ['☀️', '⛅', '🌧️', '❄️', '🌩️'];
        const temps = [18, 22, 24, 19, 21];
        const weatherData = {
            icon: icons[Math.floor(Math.random() * icons.length)],
            temp: temps[Math.floor(Math.random() * temps.length)],
            high: Math.floor(Math.random() * 5) + 23,
            low: Math.floor(Math.random() * 5) + 15,
            humidity: Math.floor(Math.random() * 30) + 50
        };
        
        document.querySelector('.weather-icon').textContent = weatherData.icon;
        document.querySelector('.weather-temp').textContent = `${weatherData.temp}°C`;
        document.querySelector('.weather-details span:first-child').textContent = 
            `H: ${weatherData.high}° L: ${weatherData.low}°`;
        document.querySelector('.weather-details span:last-child').textContent = 
            `Humidity: ${weatherData.humidity}%`;
    }

    document.querySelector('.refresh-weather').addEventListener('click', updateWeather);
    updateWeather(); // Initial load

    // Add Start Menu functionality
    const startButton = document.querySelector('.start-button');
    let startMenu = null;
    
    function createStartMenu() {
        // Create the start menu if it doesn't exist
        if (!startMenu) {
            startMenu = document.createElement('div');
            startMenu.className = 'start-menu';
            startMenu.style.position = 'fixed';
            startMenu.style.bottom = '40px';
            startMenu.style.left = '10px';
            startMenu.style.width = '250px';
            startMenu.style.backgroundColor = 'rgba(16, 132, 208, 0.95)';
            startMenu.style.border = '1px solid #5aabde';
            startMenu.style.borderRadius = '5px 5px 0 0';
            startMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            startMenu.style.padding = '10px';
            startMenu.style.zIndex = '999';
            startMenu.style.display = 'none';
            
            // Create menu items
            const menuItems = [
                { name: 'About Me', icon: '👤', folder: 'about' },
                { name: 'Projects', icon: '📁', folder: 'projects' },
                { name: 'Skills', icon: '🛠️', folder: 'skills' },
                { name: 'Contact', icon: '📧', folder: 'contact' },
                { name: 'Terminal', icon: '💻', action: 'terminal' }
            ];
            
            menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.style.padding = '8px 10px';
                menuItem.style.margin = '5px 0';
                menuItem.style.borderRadius = '3px';
                menuItem.style.cursor = 'pointer';
                menuItem.style.color = 'white';
                menuItem.style.transition = 'background-color 0.2s';
                menuItem.style.display = 'flex';
                menuItem.style.alignItems = 'center';
                
                const icon = document.createElement('span');
                icon.textContent = item.icon;
                icon.style.marginRight = '10px';
                icon.style.fontSize = '18px';
                
                const text = document.createElement('span');
                text.textContent = item.name;
                text.style.fontFamily = "'Fira Code', monospace";
                
                menuItem.appendChild(icon);
                menuItem.appendChild(text);
                startMenu.appendChild(menuItem);
                
                // Hover effect
                menuItem.addEventListener('mouseover', () => {
                    menuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                });
                
                menuItem.addEventListener('mouseout', () => {
                    menuItem.style.backgroundColor = 'transparent';
                });
                
                // Click actions
                menuItem.addEventListener('click', () => {
                    if (item.folder) {
                        // Find and click the corresponding folder
                        const folder = document.querySelector(`.folder[data-folder="${item.folder}"]`);
                        if (folder) {
                            folder.click();
                            toggleStartMenu(); // Close menu after selection
                        }
                    } else if (item.action === 'terminal') {
                        // Show terminal
                        const terminalContainer = document.querySelector('.terminal-container');
                        if (terminalContainer) {
                            terminalContainer.style.display = 'block';
                            const commandInput = document.getElementById('command-input');
                            if (commandInput) commandInput.focus();
                            toggleStartMenu(); // Close menu after selection
                        }
                    }
                });
            });
            
            // Add a power button at the bottom
            const separator = document.createElement('div');
            separator.style.height = '1px';
            separator.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            separator.style.margin = '10px 0';
            startMenu.appendChild(separator);
            
            const powerItem = document.createElement('div');
            powerItem.style.padding = '8px 10px';
            powerItem.style.margin = '5px 0';
            powerItem.style.borderRadius = '3px';
            powerItem.style.cursor = 'pointer';
            powerItem.style.color = 'white';
            powerItem.style.transition = 'background-color 0.2s';
            powerItem.style.display = 'flex';
            powerItem.style.alignItems = 'center';
            
            const powerIcon = document.createElement('span');
            powerIcon.textContent = '⏻';
            powerIcon.style.marginRight = '10px';
            powerIcon.style.fontSize = '18px';
            powerIcon.style.color = '#FF6B6B';
            
            const powerText = document.createElement('span');
            powerText.textContent = 'Shut Down';
            powerText.style.fontFamily = "'Fira Code', monospace";
            
            powerItem.appendChild(powerIcon);
            powerItem.appendChild(powerText);
            startMenu.appendChild(powerItem);
            
            // Hover effect for power button
            powerItem.addEventListener('mouseover', () => {
                powerItem.style.backgroundColor = 'rgba(255, 107, 107, 0.3)';
            });
            
            powerItem.addEventListener('mouseout', () => {
                powerItem.style.backgroundColor = 'transparent';
            });
            
            // "Shut down" easter egg
            powerItem.addEventListener('click', () => {
                // Create a shutdown screen effect
                const shutdownScreen = document.createElement('div');
                shutdownScreen.style.position = 'fixed';
                shutdownScreen.style.top = '0';
                shutdownScreen.style.left = '0';
                shutdownScreen.style.width = '100%';
                shutdownScreen.style.height = '100%';
                shutdownScreen.style.backgroundColor = '#000033';
                shutdownScreen.style.color = 'white';
                shutdownScreen.style.display = 'flex';
                shutdownScreen.style.flexDirection = 'column';
                shutdownScreen.style.justifyContent = 'center';
                shutdownScreen.style.alignItems = 'center';
                shutdownScreen.style.fontSize = '24px';
                shutdownScreen.style.fontFamily = "'Fira Code', monospace";
                shutdownScreen.style.zIndex = '10000';
                
                shutdownScreen.innerHTML = `
                    <div>Shutting down...</div>
                    <div style="margin-top: 20px; font-size: 16px;">Just kidding! Click anywhere to return.</div>
                `;
                
                document.body.appendChild(shutdownScreen);
                toggleStartMenu(); // Close menu
                
                // Click anywhere to remove
                shutdownScreen.addEventListener('click', () => {
                    shutdownScreen.remove();
                });
            });
            
            document.body.appendChild(startMenu);
        }
    }
    
    function toggleStartMenu() {
        if (!startMenu) {
            createStartMenu();
        }
        
        // Toggle visibility
        if (startMenu.style.display === 'none') {
            startMenu.style.display = 'block';
            startButton.style.background = 'linear-gradient(to bottom, #3b89b9, #5aabde)';
        } else {
            startMenu.style.display = 'none';
            startButton.style.background = 'linear-gradient(to bottom, #5aabde, #3b89b9)';
        }
    }
    
    // Add click event to start button
    if (startButton) {
        startButton.addEventListener('click', toggleStartMenu);
        
        // Close start menu when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (startMenu && startMenu.style.display !== 'none' && 
                !startMenu.contains(e.target) && 
                !startButton.contains(e.target)) {
                toggleStartMenu();
            }
        });
    }
});