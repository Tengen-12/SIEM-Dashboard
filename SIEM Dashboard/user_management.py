# Flask-Login setup for SIEM Dashboard
from flask_login import LoginManager, login_user, login_required, logout_user, current_user # type: ignore
from app import app
from user_management import User, get_user # type: ignore
from config import login_manager

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return get_user(user_id)

# Add login/logout routes to app.py as needed
