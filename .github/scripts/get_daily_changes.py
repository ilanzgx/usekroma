import subprocess
import datetime
import sys
import os
import json

def run_git_command(command, cwd=None):
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None
    except Exception:
        return None

def main():
    cwd = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

    # Check git repo
    is_git = run_git_command(["git", "rev-parse", "--is-inside-work-tree"], cwd=cwd)
    if is_git != "true":
        print(json.dumps({"error": "Not a git repository", "commits": []}))
        return

    since_date = (datetime.datetime.now() - datetime.timedelta(hours=24)).isoformat()
    delimiter = "||||"

    # Get list of commit hashes first
    hashes = run_git_command(["git", "log", f"--since={since_date}", "--pretty=format:%h"], cwd=cwd)

    commits = []
    if hashes:
        for commit_hash in hashes.split('\n'):
            if not commit_hash.strip():
                continue

            # Get details for this commit
            details = run_git_command([
                "git", "show", "--no-patch",
                f"--pretty=format:%an{delimiter}%ar{delimiter}%s{delimiter}%b",
                commit_hash
            ], cwd=cwd)

            if not details:
                continue

            parts = details.split(delimiter)
            author = parts[0]
            date_rel = parts[1]
            subject = parts[2]
            body = parts[3] if len(parts) > 3 else ""

            # Get files changed
            files_raw = run_git_command(["git", "show", "--pretty=", "--name-status", commit_hash], cwd=cwd)
            changed_files = []
            if files_raw:
                for line in files_raw.split('\n'):
                    if not line.strip():
                        continue
                    line_parts = line.split(maxsplit=1)
                    if len(line_parts) == 2:
                        changed_files.append({"status": line_parts[0], "path": line_parts[1]})

            commits.append({
                "hash": commit_hash,
                "author": author,
                "date_relative": date_rel,
                "message": f"{subject}\n{body}".strip(),
                "changes": changed_files
            })

    output = {
        "generated_at": datetime.datetime.now().isoformat(),
        "project_path": cwd,
        "commits": commits,
        "total_commits": len(commits)
    }

    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
