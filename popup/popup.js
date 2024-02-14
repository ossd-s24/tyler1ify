// Get the checkbox element
const checkbox = document.getElementById('toggle');
const label = document.getElementById('switch-label');

function toggleExtension() {
    // Check if the checkbox is checked
    if (checkbox.checked) {
        label.innerHTML = 'Disable Tyler1ify';
        // Enable the extension by sending a message to the content script
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { action: 'enableExtension' });
        });
    } else {
        label.innerHTML = 'Enable Tyler1ify';
        // Disable the extension by sending a message to the content script
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { action: 'disableExtension' });
        });
    }
}

// Add event listener to the checkbox
document.getElementById('toggle').addEventListener('change', toggleExtension);

if (checkbox.checked) {
    label.innerHTML = 'Disable Tyler1ify';
} else {
    label.innerHTML = 'Enable Tyler1ify';
}