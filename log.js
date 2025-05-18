function logAction(action) {
    log.push(action); // Add new messages at the end
    if (log.length > 50) log.shift(); // Remove oldest message if more than 50
    
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = log.map(l => `<p>${l}</p>`).join('');
    
    // Scroll to bottom so newest message is visible
    logDiv.scrollTop = logDiv.scrollHeight;
}