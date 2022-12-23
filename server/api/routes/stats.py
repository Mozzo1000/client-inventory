from flask import Blueprint, request
from api.models import Client, db, HardwareInfo
from flask_jwt_extended import (jwt_required, get_jwt_identity)
import datetime

stats_endpoint = Blueprint('stats', __name__)


@stats_endpoint.route("/v1/stats")
# @jwt_required()
def get_stats():
    since = datetime.datetime.now() - datetime.timedelta(hours=12)
    print(str(since.isoformat()) + "+0100")

    total_clients = Client.query.count()
    active_clients = Client.query.filter(
        Client.last_updated >= str(since.isoformat()) + "+0100").count()
    return {"total_clients": total_clients, "active_clients": active_clients}, 201
