document.addEventListener('DOMContentLoaded', () => {
    const heart = document.querySelector('.heart');
    const message = document.querySelector('.message');

    // This function will toggle a class on the message when the heart animates
    heart.addEventListener('animationiteration', () => {
        // We will make the text quickly flash another color during a beat
        if (message.classList.contains('flash-text')) {
            message.classList.remove('flash-text');
        } else {
            message.classList.add('flash-text');
        }
    });

    // Add a temporary CSS rule for the flash-text class (it's simpler here than in the .css file)
    const style = document.createElement('style');
    style.innerHTML = `
        .flash-text {
            color: #ff99c4 !important; /* A lighter pink for the flash */
        }
    `;
    document.head.appendChild(style);
});