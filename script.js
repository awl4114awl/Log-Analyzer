const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('new_log', (log) => {
    allLogs.push(log);
    filterLogs();
});

document.getElementById('file-input').addEventListener('change', handleFileUpload);
document.getElementById('start-button').addEventListener('click', startLogAnalysis);
document.getElementById('clear-button').addEventListener('click', clearLogs);
document.getElementById('download-button').addEventListener('click', downloadLogs);
document.getElementById('search-input').addEventListener('input', filterLogs);
document.getElementById('filter-select').addEventListener('change', filterLogs);

let allLogs = [];
let logs = [];

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const text = await file.text();
        if (file.name.endsWith('.csv')) {
            logs = parseCSVLogs(text);
        } else if (file.name.endsWith('.log') || file.name.endsWith('.txt')) {
            logs = parseApacheOrNginxLogs(text);
        }
    }
}

function parseCSVLogs(text) {
    const lines = text.split('\n');
    return lines.slice(1).map(line => {
        const [timestamp, level, message] = line.split(',');
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            console.error(`Invalid date: ${timestamp}`);
            return null;
        }
        return { timestamp: date, level, message };
    }).filter(log => log !== null);
}

function parseApacheOrNginxLogs(text) {
    const lines = text.split('\n');
    return lines.map(line => {
        const match = line.match(/(\S+) - (\S+) \[(.*?)\] "(.*?)" (\d{3}) (\d+)/);
        if (match) {
            const [_, ip, user, timestamp, request, status, size] = match;
            const date = parseApacheTimestamp(timestamp);
            if (!date) {
                console.error(`Invalid date: ${timestamp}`);
                return null;
            }
            const level = status.startsWith('2') ? 'INFO' : status.startsWith('4') || status.startsWith('5') ? 'ERROR' : 'INFO';
            return { timestamp: date, level, message: `${request} (${status})` };
        }
        return null;
    }).filter(log => log !== null);
}

function parseApacheTimestamp(timestamp) {
    const months = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12'
    };
    const match = timestamp.match(/(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) (\+|\-)(\d{2})(\d{2})/);
    if (match) {
        const [_, day, month, year, hour, minute, second, sign, offsetHour, offsetMinute] = match;
        const formattedTimestamp = `${year}-${months[month]}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
        return new Date(formattedTimestamp);
    }
    return null;
}

function startLogAnalysis() {
    allLogs = logs;
    filterLogs();
}

function clearLogs() {
    allLogs = [];
    logs = [];
    document.getElementById('file-input').value = '';
    document.getElementById('search-input').value = '';
    document.getElementById('filter-select').value = '';
    displayLogs([]);
}

function displayLogs(logs) {
    const outputDiv = document.getElementById('log-output');
    outputDiv.innerHTML = '';
    logs.forEach(log => {
        const logDiv = document.createElement('div');
        logDiv.classList.add('log');
        logDiv.classList.add(log.level);
        logDiv.innerHTML = `
            <p><strong>${log.timestamp.toISOString()} [${log.level}]</strong>: ${log.message}</p>
        `;
        outputDiv.appendChild(logDiv);
    });
}

function filterLogs() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filterSelect = document.getElementById('filter-select').value;

    const filteredLogs = allLogs.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchInput);
        const matchesFilter = filterSelect === '' || log.level === filterSelect;
        return matchesSearch && matchesFilter;
    });

    displayLogs(filteredLogs);
}

function downloadLogs() {
    const logData = allLogs.map(log => `${log.timestamp.toISOString()} [${log.level}] ${log.message}`).join('\n');
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
