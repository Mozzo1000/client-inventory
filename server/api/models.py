from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
ma = Marshmallow()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default="user")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @staticmethod
    def generate_hash(password):
        return generate_password_hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return check_password_hash(hash, password)


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ("name", "email")


class Client(db.Model):
    __tablename__ = 'clients'
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String, nullable=False, unique=True)
    last_updated = db.Column(db.String, nullable=False)
    uptime = db.Column(db.String, nullable=True)
    os = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    hardware = db.relationship(
        "HardwareInfo", backref="clients")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_uuid(cls, uuid):
        return cls.query.filter_by(uuid=uuid).first()


class HardwareInfo(db.Model):
    __tablename__ = 'hardware_info'
    id = db.Column(db.Integer, primary_key=True)
    serial = db.Column(db.String, nullable=True)
    manufacturer = db.Column(db.String, nullable=True)
    product_name = db.Column(db.String, nullable=True)

    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class HardwareSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = HardwareInfo


class ClientSchema(ma.SQLAlchemyAutoSchema):
    hardware = ma.Nested(HardwareSchema, many=True)

    class Meta:
        model = Client


class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)
