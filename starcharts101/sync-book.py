#!/usr/bin/env python3
"""Synchronize the hosted Star Charts 101 graph with the latest book repository.

This script intentionally leaves the auditable, pinned build sources untouched. It creates
short-lived patched copies of build-data.py and engine.js for the current upstream commit,
then writes only the generated website assets and cache-buster in graph.html.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone

HERE = pathlib.Path(__file__).resolve().parent
UPSTREAM_REPO = "Rajit13/Star-Maps-101-and-Practices"
UPSTREAM_BRANCH = "master"
API_BASE = f"https://api.github.com/repos/{UPSTREAM_REPO}"
RAW_BASE = f"https://raw.githubusercontent.com/{UPSTREAM_REPO}"


def request_bytes(url: str) -> bytes:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "starcharts101-auto-sync",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=90) as response:
        return response.read()


def request_json(url: str):
    return json.loads(request_bytes(url))


def git_blob_sha(data: bytes) -> str:
    prefix = f"blob {len(data)}\0".encode()
    return hashlib.sha1(prefix + data).hexdigest()


def run(*args: str) -> None:
    subprocess.run(args, cwd=HERE, check=True)


def current_graph_source() -> str | None:
    path = HERE / "graph-data.json"
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8")).get("source", {}).get("commit")
    except (json.JSONDecodeError, OSError):
        return None


def replace_once(pattern: str, replacement: str, text: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1)
    if count != 1:
        raise RuntimeError(f"Could not patch {label}; expected exactly one match, found {count}.")
    return updated


def build_for_commit(source_sha: str) -> None:
    tex = request_bytes(f"{RAW_BASE}/{source_sha}/StarMaps101.tex")
    toc = request_bytes(f"{RAW_BASE}/{source_sha}/StarMaps101.toc")
    tex_blob = git_blob_sha(tex)
    toc_blob = git_blob_sha(toc)

    # These inputs are intentionally gitignored in the website repository.
    (HERE / "StarMaps101.tex").write_bytes(tex)
    (HERE / "StarMaps101.toc").write_bytes(toc)

    build_source = (HERE / "build-data.py").read_text(encoding="utf-8")
    build_source = replace_once(
        r"PIN='[0-9a-f]{40}'",
        f"PIN='{source_sha}'",
        build_source,
        "build-data PIN",
    )
    build_source = replace_once(
        r"EXPECTED=\{'StarMaps101\.tex':'[0-9a-f]{40}','StarMaps101\.toc':'[0-9a-f]{40}'\}",
        f"EXPECTED={{'StarMaps101.tex':'{tex_blob}','StarMaps101.toc':'{toc_blob}'}}",
        build_source,
        "build-data expected blobs",
    )
    today = datetime.now(timezone.utc).date().isoformat()
    build_source = replace_once(
        r"generated='[^']+'",
        f"generated='{today}'",
        build_source,
        "graph generation date",
    )
    build_source = replace_once(
        r"commit='[0-9a-f]{40}'",
        f"commit='{source_sha}'",
        build_source,
        "graph source commit",
    )
    build_source = replace_once(
        r"texBlob='[0-9a-f]{40}'",
        f"texBlob='{tex_blob}'",
        build_source,
        "graph TeX blob",
    )
    build_source = replace_once(
        r"tocBlob='[0-9a-f]{40}'",
        f"tocBlob='{toc_blob}'",
        build_source,
        "graph TOC blob",
    )

    temp_build = HERE / ".sync-build-data.py"
    temp_engine = HERE / ".sync-engine.js"
    short = source_sha[:12]
    try:
        temp_build.write_text(build_source, encoding="utf-8")
        run(sys.executable, temp_build.name)
        run(sys.executable, "make-exams.py")

        engine_source = (HERE / "engine.js").read_text(encoding="utf-8")
        engine_source = replace_once(
            r"const PDF='[^']+';",
            f"const PDF='{RAW_BASE}/{source_sha}/StarMaps101.pdf';",
            engine_source,
            "engine PDF source",
        )
        engine_source = replace_once(
            r"const SOURCE='[^']+';",
            f"const SOURCE='https://github.com/{UPSTREAM_REPO}/blob/{source_sha}/StarMaps101.tex';",
            engine_source,
            "engine TeX source",
        )
        engine_source = replace_once(
            r"graph-data\.json\?v=[^']+",
            f"graph-data.json?v={short}",
            engine_source,
            "graph-data cache key",
        )
        engine_source = replace_once(
            r"exam-data\.json\?v=[^']+",
            f"exam-data.json?v={short}",
            engine_source,
            "exam-data cache key",
        )
        temp_engine.write_text(engine_source, encoding="utf-8")
        run("npx", "esbuild", temp_engine.name, "--bundle", "--minify", "--outfile=graph-engine-v8.js", "--legal-comments=eof")

        graph_html_path = HERE / "graph.html"
        graph_html = graph_html_path.read_text(encoding="utf-8")
        updated_html, count = re.subn(
            r"graph-engine-v8\.js\?v=[^\"']+",
            f"graph-engine-v8.js?v={short}",
            graph_html,
        )
        if count != 1:
            raise RuntimeError(f"Could not update graph-engine cache key; expected one match, found {count}.")
        graph_html_path.write_text(updated_html, encoding="utf-8")

        data = json.loads((HERE / "graph-data.json").read_text(encoding="utf-8"))
        tasks = json.loads((HERE / "exam-data.json").read_text(encoding="utf-8"))
        if data.get("source", {}).get("commit") != source_sha:
            raise RuntimeError("Generated graph-data.json does not record the synchronized upstream commit.")
        if data.get("source", {}).get("texBlob") != tex_blob or data.get("source", {}).get("tocBlob") != toc_blob:
            raise RuntimeError("Generated graph-data.json does not record the synchronized source blobs.")
        if len(tasks) != 25:
            raise RuntimeError(f"Expected 25 IOAA task records; found {len(tasks)}.")
        if not (HERE / "graph-engine-v8.js").exists():
            raise RuntimeError("graph-engine-v8.js was not produced.")
    finally:
        temp_build.unlink(missing_ok=True)
        temp_engine.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Rebuild even if the recorded upstream commit is already current.")
    args = parser.parse_args()

    branch = request_json(f"{API_BASE}/branches/{UPSTREAM_BRANCH}")
    source_sha = branch["commit"]["sha"]
    recorded = current_graph_source()

    if recorded == source_sha and not args.force:
        print(f"Already synchronized with {source_sha}.")
        return 0

    print(f"Synchronizing Star Charts 101 from {source_sha} (previous: {recorded or 'none'}).")
    build_for_commit(source_sha)
    print(f"Synchronization build complete for {source_sha}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
