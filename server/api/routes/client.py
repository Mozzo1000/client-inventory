from flask import Blueprint, request, jsonify
from api.models import Client, ClientSchema, db, HardwareInfo
from flask_jwt_extended import (jwt_required, get_jwt_identity)
import datetime

client_endpoint = Blueprint('client', __name__)


@client_endpoint.route("/v1/clients/<id>")
# @jwt_required()
def get_client(id):
    client_schema = ClientSchema(many=False)

    client = Client.query.filter_by(id=id).first()
    return jsonify(client_schema.dump(client))


@client_endpoint.route("/v1/clients/latest")
def get_latest_clients():
    client_schema = ClientSchema(many=True)
    since = datetime.datetime.now() - datetime.timedelta(days=2)
    print(str(since.isoformat()) + "+0100")
    client = Client.query.filter(
        Client.created_at >= str(since.isoformat()) + "+0100").all()

    return jsonify(client_schema.dump(client))


@client_endpoint.route("/v1/clients")
# @jwt_required()
def get_clients():
    client_schema = ClientSchema(many=True)

    client = Client.query.all()
    return jsonify(client_schema.dump(client))


@client_endpoint.route("/v1/clients", methods=["POST"])
# @jwt_required()
def add_client():
    """if not "name" in request.json:
        return jsonify({
            "error": "Bad request",
            "message": "name not given"
        }), 400"""
    existing_client = Client.find_by_uuid(request.json["id"])
    if existing_client:
        return update_client(existing_client.id)

    new_client = Client(uuid=request.json["id"],
                        last_updated=request.json["time"],
                        uptime=request.json["uptime"],
                        os=request.json["kernel"])

    new_client.save_to_db()
    new_hardware = HardwareInfo(client_id=new_client.id, serial=request.json["hardware"]["serial"],
                                manufacturer=request.json["hardware"]["manufacturer"],
                                product_name=request.json["hardware"]["product"])

    new_hardware.save_to_db()

    return {
        "id": new_client.id,
        "uuid": new_client.uuid,
        "hardware_id": new_hardware.id,
        "created_at": new_client.created_at
    }, 201


@client_endpoint.route("/v1/clients/<id>", methods=["PATCH"])
# @jwt_required()
def update_client(id):
    if not request.json:
        return jsonify({
            "error": "Bad request",
            "message": "No data sent to server"
        }), 400

    client = Client.query.filter_by(
        id=id).first()
    if "time" in request.json:
        client.last_updated = request.json["time"]
    if "uptime" in request.json:
        client.uptime = request.json["uptime"]
    if "kernel" in request.json:
        if client.os != request.json["kernel"]:
            client.os = request.json["kernel"]

    if "hardware" in request.json:
        hardware = HardwareInfo.query.filter_by(
            id=client.hardware[0].id).first()
        if "serial" in request.json["hardware"]:
            hardware.serial = request.json["hardware"]["serial"]
        if "manufacturer" in request.json["hardware"]:
            hardware.manufacturer = request.json["hardware"]["manufacturer"]
        if "product" in request.json["hardware"]:
            hardware.product_name = request.json["hardware"]["product"]

        hardware.save_to_db()

    client.save_to_db()
    return jsonify({'message': f'Client updated successfully'}), 200
