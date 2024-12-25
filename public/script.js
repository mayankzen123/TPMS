// Fetch and display server info
async function fetchServerInfo() {
    try {
        const response = await fetch('/server-info');
        const serverInfo = await response.json();
        document.getElementById('server-info').innerHTML = `
            <div>Server is running on port ${serverInfo.port}</div>
            <div>Local: ${serverInfo.local}</div>
            <div>On Your Network: ${serverInfo.network}</div>
        `;
    } catch (error) {
        console.error('Error fetching server info:', error);
    }
}

// Fetch server info when page loads
fetchServerInfo();

document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = `
            <div style="background-color: #d4edda; color: #155724; padding: 1rem;">
                ${JSON.stringify(result, null, 2)}
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response').innerHTML = `
            <div style="background-color: #f8d7da; color: #721c24; padding: 1rem;">
                Error sending data
            </div>
        `;
    }
});