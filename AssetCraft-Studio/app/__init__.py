import os

from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from werkzeug.middleware.proxy_fix import ProxyFix

from config import config_by_name

db = SQLAlchemy()
login_manager = LoginManager()

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def create_app(config_name="development"):
    config_cls = config_by_name.get(config_name)
    if config_cls is None:
        raise ValueError(f"Unknown config name: {config_name}")

    app = Flask(
        __name__,
        template_folder=os.path.join(ROOT_DIR, "templates"),
        static_folder=os.path.join(ROOT_DIR, "static"),
    )
    app.config.from_object(config_cls)

    # Trust X-Forwarded-* headers when behind a reverse proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    db.init_app(app)
    login_manager.init_app(app)

    from app.views.main import main_bp
    app.register_blueprint(main_bp)

    _register_security_headers(app)

    if app.config["DEBUG"]:
        _ensure_models_loaded()
        with app.app_context():
            db.create_all()

    return app


def _register_security_headers(app):

    @app.after_request
    def apply(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'self'; style-src 'self' 'unsafe-inline'",
        )
        return response


def _ensure_models_loaded():
    import app.models  # noqa: F401 — registers models with SQLAlchemy
