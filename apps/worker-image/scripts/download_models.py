#!/usr/bin/env python3
"""
Script para baixar os modelos LapSRN necessários para super-resolução.
Os modelos são baixados do repositório oficial do OpenCV.
"""
import os
import urllib.request
from pathlib import Path

# URL base dos modelos
BASE_URL = "https://github.com/fannymonori/TF-LapSRN/raw/master/export"

# Modelos disponíveis (2x e 4x)
MODELS = {
    "LapSRN_x2.pb": f"{BASE_URL}/LapSRN_x2.pb",
    "LapSRN_x4.pb": f"{BASE_URL}/LapSRN_x4.pb",
}

def download_models(output_dir: Path = None):
    """Baixa todos os modelos LapSRN."""
    if output_dir is None:
        output_dir = Path.home() / ".sr_models"

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"📁 Diretório de modelos: {output_dir}")
    print("=" * 50)

    for model_name, url in MODELS.items():
        model_path = output_dir / model_name

        if model_path.exists():
            print(f"✅ {model_name} já existe, pulando...")
            continue

        print(f"⬇️  Baixando {model_name}...")
        try:
            urllib.request.urlretrieve(url, model_path)
            size_mb = model_path.stat().st_size / (1024 * 1024)
            print(f"   ✅ Concluído! ({size_mb:.2f} MB)")
        except Exception as e:
            print(f"   ❌ Erro: {e}")

    print("=" * 50)
    print("🎉 Download concluído!")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Baixa modelos LapSRN para super-resolução")
    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=None,
        help="Diretório de saída (padrão: ~/.sr_models)"
    )
    args = parser.parse_args()
    download_models(args.output)
