# ☁️ Cloud Resource Allocation Simulator

A web-based application that simulates and visualizes a **greedy resource allocation algorithm** for a cloud computing environment. This project demonstrates how incoming user requests for resources like **CPU**, **Memory**, and **Bandwidth** can be efficiently scheduled and allocated based on a calculated **priority ratio**.

-----

## 🚀 Features

  - 🎨 **Interactive Web Interface**: A sleek, modern, dark-themed UI built with **Flask**, **HTML**, **CSS**, and **JavaScript**.
  - 🔄 **Dynamic Simulation**: Generates **10 random user requests** with varying resource needs and priorities each time the simulation runs.
  - ⚙️ **Greedy Scheduling Algorithm**: Allocates resources to users with the highest **efficiency ratio**.
  - 📊 **Detailed Results Dashboard**: Displays four key panels:
      - **Incoming Requests:** All generated users and their calculated efficiency ratios.
      - **Allocated Requests:** Users who successfully received resources.
      - **Execution Summary:** Total resource usage and a list of rejected users.
      - **Resource Utilization Chart:** A percentage-based bar chart for an at-a-glance understanding of resource utilization.
  - 📱 **Responsive Design**: The interface is optimized for both desktop and mobile browsers.

-----

## 🧩 How It Works

The core of the simulation is the **Greedy Scheduling Algorithm**, which prioritizes requests based on efficiency.

1.  **Request Generation**: When the simulation starts, 10 user `Request` objects are created with random values for CPU, memory, bandwidth, and priority.

2.  **Ratio Calculation**: For each request, an efficiency **ratio** is calculated. A higher ratio indicates a more efficient request (higher priority for fewer resources).

 <img width="811" height="154" alt="image" src="https://github.com/user-attachments/assets/fbf016b8-15ff-4f4f-b43d-703568a2d129" />

3.  **Sorting**: The list of incoming requests is sorted in descending order based on this ratio.

4.  **Allocation**: The `GreedyScheduler` iterates through the sorted list. For each request, it checks if the `ResourceManager` has enough available resources.

      - ✅ **If resources are available**, they are allocated, and the user is added to the "Allocated" list.
      - ❌ **If resources are not available**, the request is denied, and the user is added to the "Rejected" list.

5.  **Visualization**: The backend sends all simulation data to the frontend, which dynamically updates the UI and renders the charts and tables.

-----

## 🧠 Tech Stack

| Layer   | Technology                                   |
| :------ | :------------------------------------------- |
| Backend | **Python** (with **Flask**)                  |
| Frontend| **HTML**, **CSS**, and vanilla **JavaScript**|
| Charts  | **Chart.js** |

-----

## ⚙️ Setup and Installation

To run this project on your local machine, follow these steps:

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/cloud-resource-allocator.git
    cd cloud-resource-allocator
    ```

2.  **Create and Activate a Virtual Environment** (Recommended)

    ```bash
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Dependencies**

    ```bash
    pip install Flask
    ```

4.  **Run the Application**

    ```bash
    python app.py
    ```

5.  **View in Browser**
    Open your browser and navigate to: 👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

-----

## 📁 Project Structure

```
/cloud-resource-allocator/
│
├── app.py                  # Flask backend server
│
├── templates/
│   └── index.html          # Main HTML UI
│
├── static/
│   ├── css/
│   │   └── style.css       # Styling and dark theme
│   └── js/
│       └── script.js       # Frontend logic and API interactions
│
└── README.md               # Project documentation
```

-----

## 🪪 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute it with attribution.
