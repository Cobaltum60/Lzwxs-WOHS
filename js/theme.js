document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    if (!themeToggle || !themeIcon) return;


    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function setTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    function initTheme() {
        setTheme(darkModeMediaQuery.matches);
    }

    initTheme();

    darkModeMediaQuery.addEventListener('change', (e) => {
        setTheme(e.matches);
    });

    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        themeIcon.style.opacity = 0;
        setTheme(!isDark);
        setTimeout(() => {
            themeIcon.style.opacity = 0.9;
        }, 200);
    });
});