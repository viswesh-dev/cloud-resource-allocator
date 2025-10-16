# app.py

from flask import Flask, jsonify, render_template
import random

# --- Your original classes go here ---
class Request:
    def __init__(self, user, cpu, mem, bw, priority):
        self.user = user
        self.cpu = cpu
        self.mem = mem
        self.bw = bw
        self.priority = priority
        # Ratio defines how efficiently this user uses resources
        self.ratio = priority / (cpu + mem + bw)

class ResourceManager:
    def __init__(self, cpu, mem, bw):
        self.total_cpu = cpu
        self.total_mem = mem
        self.total_bw = bw
        self.available_cpu = cpu
        self.available_mem = mem
        self.available_bw = bw

    def allocate(self, req):
        """Allocate resources if available"""
        if (req.cpu <= self.available_cpu and
            req.mem <= self.available_mem and
            req.bw <= self.available_bw):
            
            self.available_cpu -= req.cpu
            self.available_mem -= req.mem
            self.available_bw -= req.bw
            return True
        return False

class GreedyScheduler:
    def __init__(self, resource_manager):
        self.rm = resource_manager
        self.allocated = []
        self.rejected = []

    def schedule(self, requests):
        # Sort requests based on ratio (higher = better)
        requests.sort(key=lambda x: x.ratio, reverse=True)

        for req in requests:
            if self.rm.allocate(req):
                self.allocated.append(req)
            else:
                self.rejected.append(req)
        return self.allocated

# --- Flask App Setup ---
app = Flask(__name__)

# Main route to render the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# API route to run the simulation and return data
# app.py

@app.route('/run_simulation')
def run_simulation():
    # Initialize total resources
    total_cpu = 32
    total_mem = 64
    total_bw = 500
    rm = ResourceManager(cpu=total_cpu, mem=total_mem, bw=total_bw)

    # Generate random user requests
    requests_list = [Request(
        f"User{i}",
        random.randint(2, 8),
        random.randint(4, 16),
        random.randint(20, 100),
        random.randint(1, 5)
    ) for i in range(1, 11)]

    # Run Scheduler
    scheduler = GreedyScheduler(rm)
    scheduler.schedule(requests_list)

    # --- NEW: Calculate Percentage Utilization ---
    used_cpu = total_cpu - rm.available_cpu
    used_mem = total_mem - rm.available_mem
    used_bw = total_bw - rm.available_bw
    
    percent_cpu = (used_cpu / total_cpu) * 100 if total_cpu > 0 else 0
    percent_mem = (used_mem / total_mem) * 100 if total_mem > 0 else 0
    percent_bw = (used_bw / total_bw) * 100 if total_bw > 0 else 0

    # Prepare data for JSON response
    return jsonify({
        'incoming_requests': [vars(r) for r in requests_list],
        'allocated_requests': [vars(r) for r in scheduler.allocated],
        'rejected_requests': [r.user for r in scheduler.rejected],
        'utilization': {
            'raw': { # Keep raw data for tooltips and text display
                'used': {'cpu': used_cpu, 'mem': used_mem, 'bw': used_bw},
                'total': {'cpu': total_cpu, 'mem': total_mem, 'bw': total_bw}
            },
            'percent': { # Send calculated percentages for the chart
                'used': {'cpu': percent_cpu, 'mem': percent_mem, 'bw': percent_bw}
            }
        }
    })

if __name__ == "__main__":
    app.run(debug=True)