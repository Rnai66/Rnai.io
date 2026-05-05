import json
import os

json_path = '/Users/chanakhongdi/Downloads/rnai-io-firebase-adminsdk-fbsvc-65cdce7c99.json'
env_path = '/Users/chanakhongdi/Downloads/rnai-platform/.env.local'

with open(json_path, 'r') as f:
    data = json.load(f)

with open(env_path, 'r') as f:
    lines = f.readlines()

# Filter out existing FIREBASE_ADMIN lines to prevent duplicates
lines = [line for line in lines if not line.startswith('FIREBASE_ADMIN_')]

# Append new lines
lines.append(f'FIREBASE_ADMIN_PROJECT_ID="{data["project_id"]}"\n')
lines.append(f'FIREBASE_ADMIN_CLIENT_EMAIL="{data["client_email"]}"\n')
# We want the literal \n characters in the .env file so the JS .replace(/\\n/g, "\n") works
# Python's repr or manual escaping can help, but standard is to just write it as is with double backslash or similar
# If we want the file to have literal \n, we write \\n
private_key = data['private_key'].replace('\n', '\\n')
lines.append(f'FIREBASE_ADMIN_PRIVATE_KEY="{private_key}"\n')

with open(env_path, 'w') as f:
    f.writelines(lines)

print("Successfully updated .env.local with Firebase Admin credentials.")
