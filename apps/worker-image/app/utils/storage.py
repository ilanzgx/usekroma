import os

import boto3
from botocore.client import Config
from dotenv import load_dotenv

load_dotenv()

STORAGE_ENDPOINT = os.getenv("STORAGE_ENDPOINT", "http://localhost:9000")
STORAGE_REGION = os.getenv("STORAGE_REGION", "us-east-1")
STORAGE_ACCESS_KEY = os.getenv("STORAGE_ACCESS_KEY", "kromauser")
STORAGE_SECRET_KEY = os.getenv("STORAGE_SECRET_KEY", "kromapassword")
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "kroma-storage")

s3_client = boto3.client(
    "s3",
    endpoint_url=STORAGE_ENDPOINT,
    region_name=STORAGE_REGION,
    aws_access_key_id=STORAGE_ACCESS_KEY,
    aws_secret_access_key=STORAGE_SECRET_KEY,
    config=Config(s3={"addressing_style": "path"}),  # Equivalente ao forcePathStyle
)


def upload_bytes(key: str, data: bytes, content_type: str = "image/png") -> str:
    s3_client.put_object(
        Bucket=STORAGE_BUCKET,
        Key=key,
        Body=data,
        ContentType=content_type,
    )
    return key


def download_bytes(key: str) -> bytes:
    response = s3_client.get_object(Bucket=STORAGE_BUCKET, Key=key)
    return response["Body"].read()


def delete_file(key: str) -> None:
    s3_client.delete_object(Bucket=STORAGE_BUCKET, Key=key)
