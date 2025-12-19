document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    
    modeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        document.querySelector('.directory').classList.toggle('dark-mode');
    });
});