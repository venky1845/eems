from fastapi import FastAPI
from server.middleware.corsMiddleware import add_cors
from server.routes.userRoutes import router as user_router
from server.config.db import Base, engine

def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="EEMS API", version="1.0.0")
    add_cors(app)
    app.include_router(user_router)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()   