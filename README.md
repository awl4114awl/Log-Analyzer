# Log Analyzer

## Overview

Log Analyzer is a web-based application designed to help you upload, view, filter, and analyze log files. The application supports CSV, Apache, and Nginx log formats, providing a user-friendly interface for managing and understanding log data.

## Features

- **File Upload**: Upload log files in CSV, Apache, or Nginx formats.
- **Search and Filter**: Search logs by keywords and filter by log levels (INFO, ERROR, WARNING, DEBUG).
- **Real-Time Monitoring**: Real-time log updates using WebSockets.
- **Download Logs**: Download the filtered logs as a text file.
- **Log Highlighting**: Different log levels are highlighted with distinct colors.
- **Responsive Design**: User-friendly interface optimized for various screen sizes.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/log-analyzer.git
    cd log-analyzer
    ```

2. Install the dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Run the Flask server:

    ```bash
    python log_analyzer.py
    ```

4. Open your web browser and navigate to the provided URL to access the Log Analyzer.

## Usage

1. **Upload Log Files**: Click on the "Choose File" button to upload your log file.
2. **Start Analysis**: Click the "Start" button to begin log analysis.
3. **Search and Filter**: Use the search input to filter logs by keywords and the dropdown menu to filter by log levels.
4. **Download Logs**: Click the "Download Logs" button to download the filtered logs as a text file.
5. **Clear Logs**: Click the "Clear" button to reset the log view and filters.

## Technologies Used

- **Flask**: Backend framework
- **Socket.IO**: Real-time communication
- **Bootstrap**: Frontend framework for responsive design

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
