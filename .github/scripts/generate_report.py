import sys
import json
from datetime import datetime
from collections import defaultdict

def parse_commit_type(message: str) -> tuple[str, str, str]:
    """
    Parse conventional commit message.
    Returns (type, scope, description)
    """
    message = message.split('\n')[0]  # First line only

    # Try to match "type(scope): description" or "type: description"
    if ':' in message:
        prefix, description = message.split(':', 1)
        prefix = prefix.strip()
        description = description.strip()

        if '(' in prefix and ')' in prefix:
            commit_type = prefix.split('(')[0]
            scope = prefix.split('(')[1].rstrip(')')
        else:
            commit_type = prefix
            scope = ""

        return commit_type.lower(), scope, description

    return "other", "", message

def get_type_emoji(commit_type: str) -> str:
    emojis = {
        "feat": "✨",
        "fix": "🐛",
        "chore": "🛠️",
        "docs": "📚",
        "style": "🎨",
        "refactor": "♻️",
        "test": "🧪",
        "perf": "⚡",
        "ci": "🔧",
        "build": "📦",
    }
    return emojis.get(commit_type, "📝")

def get_type_title(commit_type: str) -> str:
    titles = {
        "feat": "Novas Funcionalidades",
        "fix": "Correções de Bugs",
        "chore": "Manutenção",
        "docs": "Documentação",
        "style": "Estilo",
        "refactor": "Refatoração",
        "test": "Testes",
        "perf": "Performance",
        "ci": "CI/CD",
        "build": "Build",
    }
    return titles.get(commit_type, "Outras Alterações")

def generate_report(data: dict) -> str:
    commits = data.get("commits", [])

    if not commits:
        return "# 📊 Relatório Diário\n\n*Nenhum commit registrado nas últimas 24 horas.*"

    # Group commits by type
    grouped = defaultdict(list)
    authors = set()
    file_counts = defaultdict(int)

    for commit in commits:
        commit_type, scope, description = parse_commit_type(commit["message"])
        grouped[commit_type].append({
            "scope": scope,
            "description": description,
            "hash": commit["hash"],
            "author": commit["author"]
        })
        authors.add(commit["author"])

        for change in commit.get("changes", []):
            file_counts[change["path"]] += 1

    # Build markdown report
    today = datetime.now().strftime("%d/%m/%Y")
    lines = [f"# 📊 Relatório Diário - {today}", ""]

    # Commits by type
    type_order = ["feat", "fix", "refactor", "chore", "docs", "style", "test", "perf", "ci", "build", "other"]

    for commit_type in type_order:
        if commit_type not in grouped:
            continue

        emoji = get_type_emoji(commit_type)
        title = get_type_title(commit_type)
        lines.append(f"## {emoji} {title}")

        for item in grouped[commit_type]:
            scope_str = f"**{item['scope']}**: " if item['scope'] else ""
            lines.append(f"- {scope_str}{item['description']}")

        lines.append("")

    # Top files
    if file_counts:
        lines.append("## 📁 Arquivos Mais Modificados")
        top_files = sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        for path, count in top_files:
            lines.append(f"- `{path}` ({count}x)")
        lines.append("")

    # Contributors
    lines.append("## 👥 Contribuidores")
    lines.append(", ".join(sorted(authors)))
    lines.append("")

    # Footer
    lines.append("---")
    lines.append(f"*{len(commits)} commits nas últimas 24 horas*")

    return "\n".join(lines)

def main():
    # Read JSON from file or stdin
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)

    report = generate_report(data)
    print(report)

if __name__ == "__main__":
    main()
