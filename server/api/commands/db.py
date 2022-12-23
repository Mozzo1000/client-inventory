from flask import Blueprint
from api.models import db
from flask_migrate import Migrate
from alembic import command

db_command = Blueprint('data', __name__)


@db_command.cli.command("reset")
def reset():
    print("Resetting database!\nThis will delete everything!")
    ans = input("Are you sure? (y/n) : ")
    if ans == "y" or ans == "yes":
        print("Removing all tables..")
        db.drop_all()
        print("Creating tables..")
        db.create_all()
        config = Migrate(db_command, db).get_config()
        command.upgrade(config, "head")
        print("Done resetting database.")
