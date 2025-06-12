# Audit log for user actions
import json
from datetime import datetime

def log_user_action(user, action, details=None):
    entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'user': user,
        'action': action,
        'details': details or {}
    }
    try:
        with open('static/data/audit_log.json', 'a') as f:
            f.write(json.dumps(entry) + '\n')
    except Exception as e:
        print('Failed to log user action:', e)

def get_audit_log():
    try:
        with open('static/data/audit_log.json', 'r') as f:
            return [json.loads(line) for line in f]
    except FileNotFoundError:
        return []
