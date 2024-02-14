function toggleExtension() {
    // Get the checkbox element
    const checkbox = document.getElementById('toggle');

    // Check if the checkbox is checked
    if (checkbox.checked) {
        // Enable the extension by sending a message to the content script
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { action: 'enableExtension' });
        });
    } else {
        // Disable the extension by sending a message to the content script
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { action: 'disableExtension' });
        });
    }
}

// Add event listener to the checkbox
document.getElementById('toggle').addEventListener('change', toggleExtension);

