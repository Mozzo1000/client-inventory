from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import api.config as config
from api.models import db, ma
from api.routes.auth import auth_endpoint
from api.routes.client import client_endpoint
from api.commands.db import db_command
from api.routes.stats import stats_endpoint

from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(config.Config)
CORS(app, supports_credentials=True)
db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

app.register_blueprint(db_command)
app.register_blueprint(auth_endpoint)
app.register_blueprint(client_endpoint)
app.register_blueprint(stats_endpoint)


@app.route('/')
def index():
    return {'name': 'client-inventory API', 'version': '1.0'}
