// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set theme based on cookie or system preference
    const savedTheme = getCookie('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('theme-toggle').checked = savedTheme === 'dark';
    } else if (prefersDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-toggle').checked = true;
    }
    
    // Theme toggle event listener
    document.getElementById('theme-toggle').addEventListener('change', function(e) {
        const theme = e.target.checked ? 'dark' : 'light';
        document.getElementById('theme-form').querySelector('input[name="theme"]').value = theme;
        document.getElementById('theme-form').submit();
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
    
    // Initialize tables if they exist
    initializeTables();
    
    // Initialize charts if they exist
    initializeCharts();
    
    // Initialize maps if they exist
    initializeMaps();
    
    // Enhanced filtering for status code
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const value = statusFilter.value;
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(row => {
                const statusCell = row.querySelector('td:nth-child(5) .badge');
                if (!statusCell) return;
                const code = statusCell.textContent.trim();
                if (!value || code.startsWith(value)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Enhanced filtering for severity in dashboard events
    const severityFilter = document.getElementById('severityFilter');
    if (severityFilter) {
        severityFilter.addEventListener('change', function() {
            const value = severityFilter.value;
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(row => {
                const sevCell = row.querySelector('td:nth-child(5) .badge');
                if (!sevCell) return;
                const sev = sevCell.textContent.trim();
                if (!value || sev === value) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Enrich threat map with geolocation data
    enrichThreatMap();
    
    // Dashboard customization logic
    const customizeForm = document.getElementById('dashboard-customize-form');
    if (customizeForm) {
        customizeForm.addEventListener('change', function() {
            document.getElementById('threat-map').parentElement.parentElement.style.display = customizeForm.showThreatMap.checked ? '' : 'none';
            const severityChart = document.getElementById('severityChart');
            if (severityChart) severityChart.parentElement.parentElement.parentElement.style.display = customizeForm.showSeverityChart.checked ? '' : 'none';
            // Events table
            const eventsTable = document.querySelector('.data-table-container');
            if (eventsTable) eventsTable.style.display = customizeForm.showEventsTable.checked ? '' : 'none';
        });
    }
});

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Table functionality
function initializeTables() {
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        // Add sort functionality
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            if (header.dataset.sortable !== 'false') {
                header.addEventListener('click', () => {
                    const isAsc = header.classList.contains('sorted-asc');
                    
                    // Remove sorted classes from all headers
                    headers.forEach(h => {
                        h.classList.remove('sorted-asc', 'sorted-desc');
                    });
                    
                    // Add appropriate sorted class
                    header.classList.add(isAsc ? 'sorted-desc' : 'sorted-asc');
                    
                    // Get column index
                    const columnIndex = Array.from(header.parentNode.children).indexOf(header);
                    
                    // Sort the table
                    sortTable(table, columnIndex, !isAsc);
                });
            }
        });
        
        // Add search functionality
        const tableContainer = table.closest('.data-table-container');
        const searchInput = tableContainer.querySelector('.search-input');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchText = searchInput.value.toLowerCase();
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchText) ? '' : 'none';
                });
            });
        }
        
        // Add expand/collapse functionality for detailed rows
        const expandableRows = table.querySelectorAll('tr[data-expandable="true"]');
        
        expandableRows.forEach(row => {
            row.addEventListener('click', () => {
                row.classList.toggle('expanded');
                
                const detailsId = row.dataset.detailsId;
                if (detailsId) {
                    const detailsRow = document.getElementById(detailsId);
                    if (detailsRow) {
                        detailsRow.style.display = row.classList.contains('expanded') ? 'table-row' : 'none';
                    }
                }
            });
        });
    });
}

// Sort table function
function sortTable(table, columnIndex, asc) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as date
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        
        if (!isNaN(aDate) && !isNaN(bDate)) {
            return asc ? aDate - bDate : bDate - aDate;
        }
        
        // Try to parse as number
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return asc ? aNum - bNum : bNum - aNum;
        }
        
        // Sort as string
        return asc 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
    });
    
    // Reorder rows in the table
    rows.forEach(row => tbody.appendChild(row));
}

// Charts functionality
function initializeCharts() {
    // Implement if Chart.js or other library is available
    console.log('Charts initialization would happen here');
    
    // For this example, we'll create some simple DOM-based charts
    createSeverityDistribution();
    createTimelineChart();
}

function createSeverityDistribution() {
    const severityCharts = document.querySelectorAll('.severity-chart');
    
    severityCharts.forEach(chart => {
        // This would normally use actual data
        // For demo purposes, we're using preset values
        const critical = parseInt(chart.dataset.critical || 5);
        const high = parseInt(chart.dataset.high || 12);
        const medium = parseInt(chart.dataset.medium || 25);
        const low = parseInt(chart.dataset.low || 38);
        const info = parseInt(chart.dataset.info || 20);
        
        const total = critical + high + medium + low + info;
        
        const criticalBar = chart.querySelector('.critical-bar');
        const highBar = chart.querySelector('.high-bar');
        const mediumBar = chart.querySelector('.medium-bar');
        const lowBar = chart.querySelector('.low-bar');
        const infoBar = chart.querySelector('.info-bar');
        
        if (criticalBar) criticalBar.style.width = `${(critical / total) * 100}%`;
        if (highBar) highBar.style.width = `${(high / total) * 100}%`;
        if (mediumBar) mediumBar.style.width = `${(medium / total) * 100}%`;
        if (lowBar) lowBar.style.width = `${(low / total) * 100}%`;
        if (infoBar) infoBar.style.width = `${(info / total) * 100}%`;
    });
}

function createTimelineChart() {
    // This would be implemented with actual data
    console.log('Timeline chart would be created here');
}

// Maps functionality
function initializeMaps() {
    const mapContainers = document.querySelectorAll('.map-container');
    
    if (mapContainers.length > 0) {
        // For this example, we'll create a simple representation
        // In a real app, you would use a mapping library like Leaflet or Google Maps
        
        mapContainers.forEach(container => {
            createSimpleMap(container);
        });
    }
}

function createSimpleMap(container) {
    // Create a simple visual representation
    container.innerHTML = `
        <div style="height: 100%; display: flex; justify-content: center; align-items: center; color: var(--text-muted);">
            <p>Geographic map visualization would appear here.</p>
            <p>This would normally use a mapping library like Leaflet or Google Maps.</p>
        </div>
    `;
}

// Show a toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '❓';
    switch(type) {
        case 'success': icon = '✓'; break;
        case 'error': icon = '✗'; break;
        case 'warning': icon = '⚠'; break;
        case 'info': icon = 'ℹ'; break;
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger reflow for animation
    toast.offsetHeight;
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    });
}

// Loading state helpers
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Demo data fetching function
function fetchData(endpoint, callback) {
    fetch(`/api/data/${endpoint}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            callback(null, data);
        })
        .catch(error => {
            callback(error, null);
        });
}

// Example: Use a free geolocation API (replace with production service as needed)
function fetchGeoInfo(ip, callback) {
    fetch(`https://ipapi.co/${ip}/json/`)
        .then(response => response.json())
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}

// Example: Enrich first IP in access logs with geolocation and show in map
function enrichThreatMap() {
    const mapContainer = document.getElementById('threat-map');
    if (!mapContainer) return;
    // For demo, use first IP from table
    const ipCell = document.querySelector('.data-table tbody tr td:nth-child(2)');
    if (!ipCell) return;
    const ip = ipCell.textContent.trim();
    fetchGeoInfo(ip, (err, geo) => {
        if (err || !geo || !geo.city) {
            mapContainer.innerHTML = '<p>Unable to fetch geolocation data.</p>';
        } else {
            mapContainer.innerHTML = `<p><strong>IP:</strong> ${ip}<br><strong>Location:</strong> ${geo.city}, ${geo.country_name}</p>`;
        }
    });
}