from flask import Flask
from functools import wraps
import json
import os
from dotenv import load_dotenv
from werkzeug.exceptions import HTTPException

from flask import Flask
from flask import jsonify
from flask import redirect
from flask import render_template
from flask import session
from flask_session import Session
from flask import url_for
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
from six.moves.urllib.parse import urlencode

from routes.incidents import incident_routes

load_dotenv()
app = Flask(__name__)
oauth = OAuth(app)

auth0 = oauth.register(
    "auth0",
    client_id="OzmbsaAp8UmoYhW1rlGPFfUjuOgWrbGA",
    client_secret=os.getenv("AUTH0_SECRET"),
    api_base_url="https://pdt-dev.us.auth0.com",
    access_token_url="https://pdt-dev.us.auth0.com/oauth/token",
    authorize_url="https://pdt-dev.us.auth0.com/authorize",
    client_kwargs={
        "scope": "openid profile email",
    },
)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("PDT_DB_URI")
SESSION_TYPE = 'sqlalchemy'
app.config.update(SECRET_KEY="secretflaskkey")
Session(app)
db = SQLAlchemy(app)

@app.before_first_request
def setup_application() -> None:
    """Do initial setup of application."""
    db.create_all()

@app.route("/")
def hello_world():
    print(app.config)
    return "Hello, World!"

# Here we're using the /callback route.
@app.route('/callback')
def callback_handling():
    # Handles response from token endpoint
    auth0.authorize_access_token()
    resp = auth0.get('userinfo')
    userinfo = resp.json()

    # Store the user information in flask session.
    session['jwt_payload'] = userinfo
    session['profile'] = {
        'user_id': userinfo['sub'],
        'name': userinfo['name'],
        'picture': userinfo['picture']
    }
    json.dumps(session['jwt_payload'], indent=4)
    return redirect('/success')

@app.route('/login')
def login():
    return auth0.authorize_redirect(redirect_uri='/callback')

@app.route('/success')
def success_handling():
    print("success")

db.init_app(app)
app.register_blueprint(incident_routes)
app.run()


