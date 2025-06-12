from flask_login import UserMixin
from datetime import datetime

class User(UserMixin):
    def __init__(self, id, name, password, email=None):
        self.id = id
        self.name = name
        self.password = password  # In production, this should be hashed!
        self.email = email
        self.created_at = datetime.utcnow()

    def get_id(self):
        return str(self.id)

# Demo users - replace with database in production
users = {
    "admin": User("admin", "Administrator", "password", "admin@example.com")
}

def get_user(user_id):
    return users.get(str(user_id))
