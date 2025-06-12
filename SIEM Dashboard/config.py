from flask import Flask
from flask_login import LoginManager

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
