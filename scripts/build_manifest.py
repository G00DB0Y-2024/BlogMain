from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / 'manifest.json'
EXCLUDED_DIRS = {'.git', 'node_modules', 'scripts', 'vendor'}
EXCLUDED_FILES = {'manifest.json'}

HEADING_RE = re.compile(r'^#\s+(.+)$', re.MULTILINE)


def is_hidden(name: str) -> bool:
    return name.startswith('.')


def should_skip_dir(name: str, is_root_assets: bool) -> bool:
    return is_hidden(name) or name in EXCLUDED_DIRS or is_root_assets


def should_skip_file(name: str) -> bool:
    return is_hidden(name) or name in EXCLUDED_FILES or not name.lower().endswith('.md')


def normalize(rel_path: Path) -> str:
    return rel_path.as_posix()


def read_title(file_path: Path) -> str:
    try:
        raw = file_path.read_text(encoding='utf-8', errors='ignore')[:65536]
    except OSError:
        return file_path.stem
    match = HEADING_RE.search(raw)
    if match:
        return match.group(1).strip()
    return file_path.stem


@dataclass
class FileNode:
    type: str
    name: str
    title: str
    path: str
    mtime: str


@dataclass
class DirNode:
    type: str
    name: str
    path: str
    count: int = 0
    mtime: str | None = None
    children: list = field(default_factory=list)


def add_file(root: DirNode, rel_path: Path, abs_path: Path) -> None:
    parts = rel_path.parts
    if not parts:
        return
    cursor = root
    current_rel = Path()
    for part in parts[:-1]:
        current_rel = current_rel / part
        next_dir = next((child for child in cursor.children if isinstance(child, DirNode) and child.name == part), None)
        if next_dir is None:
            next_dir = DirNode(type='directory', name=part, path=normalize(current_rel))
            cursor.children.append(next_dir)
        cursor = next_dir
    stat = abs_path.stat()
    cursor.children.append(
        FileNode(
            type='file',
            name=parts[-1],
            title=read_title(abs_path),
            path=normalize(rel_path),
            mtime=stat.st_mtime_ns,
        )
    )


def walk(root: DirNode, current_dir: Path, rel_dir: Path = Path()) -> None:
    for entry in sorted(current_dir.iterdir(), key=lambda p: p.name.lower()):
        is_root_assets = not rel_dir.parts and entry.is_dir() and entry.name == 'assets'
        if entry.is_dir():
          if should_skip_dir(entry.name, is_root_assets):
              continue
          walk(root, entry, rel_dir / entry.name)
          continue
        if entry.is_file() and not should_skip_file(entry.name):
            add_file(root, rel_dir / entry.name, entry)


def sort_nodes(nodes: list) -> None:
    def sort_key(node):
        if isinstance(node, DirNode):
            return (0, node.name.lower())
        return (1, node.name.lower())

    nodes.sort(key=sort_key)
    for node in nodes:
        if isinstance(node, DirNode):
            sort_nodes(node.children)


def summarize(node):
    if isinstance(node, FileNode):
        return 1, node.mtime

    count = 0
    latest = None
    for child in node.children:
        child_count, child_latest = summarize(child)
        count += child_count
        if child_latest is not None and (latest is None or child_latest > latest):
            latest = child_latest
    node.count = count
    if latest is not None:
        node.mtime = datetime.fromtimestamp(latest / 1_000_000_000, tz=timezone.utc).astimezone().isoformat()
    return count, latest


def to_manifest(node):
    if isinstance(node, FileNode):
        return {
            'type': node.type,
            'name': node.name,
            'title': node.title,
            'path': node.path,
            'mtime': datetime.fromtimestamp(node.mtime / 1_000_000_000, tz=timezone.utc).astimezone().isoformat(),
        }
    return {
        'type': node.type,
        'name': node.name,
        'path': node.path,
        'count': node.count,
        'mtime': node.mtime,
        'children': [to_manifest(child) for child in node.children],
    }


def maybe_git(args: list[str], check: bool = False) -> subprocess.CompletedProcess[str]:
    git = shutil.which('git')
    if not git:
        raise RuntimeError('git 未安装或不在 PATH 中')
    return subprocess.run([git, *args], cwd=ROOT, text=True, capture_output=True, check=check)


def auto_push(commit_message: str) -> None:
    maybe_git(['add', '-A'], check=True)
    status = maybe_git(['status', '--porcelain']).stdout.strip()
    if not status:
        print('No changes to commit.')
        return

    maybe_git(['commit', '-m', commit_message], check=True)
    branch = maybe_git(['branch', '--show-current']).stdout.strip() or 'master'
    maybe_git(['push', '-u', 'origin', branch], check=True)
    print(f'Pushed branch {branch} to origin.')


def build_manifest() -> dict:
    root = DirNode(type='directory', name='BlogMain', path='')
    walk(root, ROOT)
    sort_nodes(root.children)
    total_posts, _ = summarize(root)
    tree = [to_manifest(child) for child in root.children]
    total_categories = sum(1 for child in root.children if isinstance(child, DirNode))
    latest_values = [child['mtime'] for child in tree if child.get('mtime')]
    latest = max(latest_values) if latest_values else None
    return {
        'generatedAt': datetime.now().astimezone().isoformat(),
        'rootName': root.name,
        'totalPosts': total_posts,
        'totalCategories': total_categories,
        'latestUpdatedAt': latest[:10] if latest else None,
        'tree': tree,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description='Build manifest.json for Typora blog.')
    parser.add_argument('--push', action='store_true', help='commit and push after rebuilding manifest')
    parser.add_argument('--message', default='Update blog manifest and site shell.', help='git commit message to use with --push')
    args = parser.parse_args()

    manifest = build_manifest()
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {MANIFEST_PATH.relative_to(ROOT).as_posix()}')

    if args.push:
        auto_push(args.message)

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
