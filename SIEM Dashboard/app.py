from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
import json
import os
from datetime import datetime
from models import User, users
from audit_log import log_user_action, get_audit_log

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

# Load data from JSON files
def load_data(file_name):
    with open(os.path.join('static', 'data', f'{file_name}.json'), 'r') as f:
        return json.load(f)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = users.get(username)
        if user and user.password == password:
            login_user(user)
            return redirect(url_for('index'))
        return render_template('login.html', error='Invalid credentials')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/')
@login_required
def index():
    return render_template('dashboard.html', active_page='dashboard')

@app.route('/blocked_ips')
@login_required
def blocked_ips():
    blocked_ips_data = load_data('blocked_ips')
    return render_template('blocked_ips.html', 
                          blocked_ips=blocked_ips_data,
                          active_page='blocked_ips')

@app.route('/access_logs')
@login_required
def access_logs():
    logs_data = load_data('access_logs')
    return render_template('access_logs.html', 
                          logs=logs_data,
                          active_page='access_logs')

@app.route('/vulnerabilities')
@login_required
def vulnerabilities():
    vuln_data = load_data('vulnerabilities')
    return render_template('vulnerabilities.html', 
                          vulnerabilities=vuln_data,
                          active_page='vulnerabilities')

@app.route('/api/data/<data_type>')
def get_data(data_type):
    try:
        data = load_data(data_type)
        return jsonify(data)
    except:
        return jsonify({"error": "Data not found"}), 404

@app.route('/toggle_theme', methods=['POST'])
def toggle_theme():
    theme = request.form.get('theme')
    response = redirect(request.referrer or url_for('index'))
    response.set_cookie('theme', theme, max_age=60*60*24*365)  # 1 year
    return response

@app.route('/export_logs')
@login_required
def export_logs():
    logs_data = load_data('access_logs')
    log_user_action(current_user.id, 'export_logs')
    # Export as CSV
    import csv
    from io import StringIO
    si = StringIO()
    writer = csv.DictWriter(si, fieldnames=logs_data[0].keys())
    writer.writeheader()
    writer.writerows(logs_data)
    output = si.getvalue()
    return app.response_class(
        output,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment;filename=access_logs.csv'}
    )

@app.route('/audit_log')
@login_required
def audit_log():
    log = get_audit_log()
    return render_template('audit_log.html', audit_log=log, active_page='audit_log')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # Basic validation
        if username in users:
            return render_template('register.html', error='Username already exists')
        
        if password != confirm_password:
            return render_template('register.html', error='Passwords do not match')
        
        if len(password) < 6:
            return render_template('register.html', error='Password must be at least 6 characters')

        # Create new user
        new_user = User(username, username, password)  # In production, hash the password!
        users[username] = new_user
        
        # Log them in
        login_user(new_user)
        return redirect(url_for('index'))

    return render_template('register.html')

if __name__ == '__main__':
    # Make sure data directory exists
    os.makedirs(os.path.join('static', 'data'), exist_ok=True)
    app.run(debug=True)