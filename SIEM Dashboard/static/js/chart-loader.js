// Chart.js CDN loader for SIEM Dashboard
// This file loads Chart.js from CDN and provides a helper to create charts

function loadChartJs(callback) {
    if (window.Chart) {
        callback();
        return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
}

// Optionally, add a function to dynamically load other chart libraries in the future
function loadLibrary(url, globalName, callback) {
    if (window[globalName]) {
        callback();
        return;
    }
    var script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

window.loadChartJs = loadChartJs;
