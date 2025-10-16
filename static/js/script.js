// static/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('run-sim-btn');
    const resultsContainer = document.getElementById('results-container');
    let utilizationChart = null;

    // Set default Chart.js styles for dark theme
    Chart.defaults.color = '#9ca3af';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

    runButton.addEventListener('click', async () => {
        runButton.disabled = true;
        // This is the loading state that needs the 'animate-spin' class
        runButton.innerHTML = `
            <svg class="animate-spin" style="width:20px; height:20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity: 0.75;"></path>
            </svg>
            Running...`;
        
        try {
            const response = await fetch('/run_simulation');
            const data = await response.json();
            
            updateSummary(data.utilization.raw, data.rejected_requests);
            populateTable('incoming-requests-tbody', data.incoming_requests, ['user', 'cpu', 'mem', 'bw', 'priority', 'ratio']);
            populateTable('allocated-requests-tbody', data.allocated_requests, ['user', 'cpu', 'mem', 'bw']);
            createOrUpdateChart(data.utilization); 
            
            resultsContainer.classList.add('visible');
        } catch (error) {
            console.error("Failed to run simulation:", error);
            alert("An error occurred. Check the console for details.");
        } finally {
            // This correctly restores the button after the simulation
            runButton.disabled = false;
            runButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z"></path></svg>
                Run Simulation Again`;
        }
    });

    const updateSummary = (utilizationRaw, rejected) => {
        document.getElementById('cpu-summary').textContent = `${utilizationRaw.used.cpu} / ${utilizationRaw.total.cpu}`;
        document.getElementById('mem-summary').textContent = `${utilizationRaw.used.mem} / ${utilizationRaw.total.mem}`;
        document.getElementById('bw-summary').textContent = `${utilizationRaw.used.bw} / ${utilizationRaw.total.bw}`;
        
        const rejectedList = document.getElementById('rejected-users-list');
        rejectedList.innerHTML = '';
        if (rejected.length > 0) {
            rejected.forEach(user => {
                const tag = document.createElement('span');
                tag.className = 'user-tag';
                tag.textContent = user;
                rejectedList.appendChild(tag);
            });
        } else {
            const p = document.createElement('p');
            p.className = 'placeholder-text';
            p.textContent = 'None';
            rejectedList.appendChild(p);
        }
    };

    const populateTable = (tbodyId, data, columns) => {
        const tableBody = document.getElementById(tbodyId);
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = tableBody.insertRow();
            columns.forEach(col => {
                const cell = row.insertCell();
                let value = item[col];
                if (col === 'ratio') value = parseFloat(value).toFixed(4);
                cell.textContent = value;
            });
        });
    };

    const createOrUpdateChart = (utilization) => {
        const ctx = document.getElementById('utilization-chart').getContext('2d');
        if (utilizationChart) utilizationChart.destroy();
        
        const labels = ['CPU', 'Memory', 'Bandwidth'];
        const percentData = utilization.percent.used;
        const rawData = utilization.raw;

        utilizationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Used',
                    data: [percentData.cpu, percentData.mem, percentData.bw],
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                    rawValues: [
                        `${rawData.used.cpu} / ${rawData.total.cpu}`,
                        `${rawData.used.mem} / ${rawData.total.mem}`,
                        `${rawData.used.bw} / ${rawData.total.bw}`
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) { return value + '%'; }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#f9fafb',
                        bodyColor: '#d1d5db',
                        padding: 10,
                        cornerRadius: 8,
                        boxPadding: 4,
                        callbacks: {
                            label: function(context) {
                                const percentage = context.parsed.y.toFixed(1);
                                const raw = context.dataset.rawValues[context.dataIndex];
                                return `Utilization: ${percentage}% (${raw})`;
                            }
                        }
                    }
                }
            }
        });
    };
});