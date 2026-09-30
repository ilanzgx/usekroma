from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "worker-image"


def test_ready_check():
    # Without RabbitMQ connection in unit test, should return 503 not_ready
    response = client.get("/ready")
    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "not_ready"

