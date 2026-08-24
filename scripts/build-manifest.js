const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(process.cwd());
const MANIFEST_PATH = path.join(ROOT, 'manifest.json');
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'scripts', 'vendor', 'assets']);
const EXCLUDED_FILES = new Set(['manifest.json']);

function normalize(relPath) {
  return relPath.split(path.sep).join('/');
}

function isHidden(name) {
  return name.startsWith('.');
}

function shouldSkipDir(name) {
  return isHidden(name) || EXCLUDED_DIRS.has(name);
}

function shouldSkipFile(name) {
  return isHidden(name) || EXCLUDED_FILES.has(name) || !name.toLowerCase().endsWith('.md');
}

function readTitle(filePath, fallbackName) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').slice(0, 64 * 1024);
    const heading = raw.match(/^#\s+(.+)$/m);
    if (heading?.[1]) {
      return heading[1].trim();
    }
  } catch {
    // Ignore unreadable files and fall back to filename.
  }
  return fallbackName.replace(/\.[^.]+$/, '');
}

function createDirNode(name, relPath) {
  return {
    type: 'directory',
    name,
    path: normalize(relPath),
    count: 0,
    mtime: null,
    children: [],
    _childrenMap: new Map(),
  };
}

function createFileNode(name, relPath, absPath) {
  const stat = fs.statSync(absPath);
  return {
    type: 'file',
    name,
    title: readTitle(absPath, name),
    path: normalize(relPath),
    mtime: stat.mtime.toISOString(),
  };
}

function addFile(root, relPath) {
  const parts = relPath.split(path.sep);
  const fileName = parts.at(-1);
  const dirParts = parts.slice(0, -1);
  let cursor = root;
  let currentRel = '';

  for (const part of dirParts) {
    currentRel = currentRel ? path.join(currentRel, part) : part;
    if (!cursor._childrenMap.has(part)) {
      const dirNode = createDirNode(part, currentRel);
      cursor._childrenMap.set(part, dirNode);
      cursor.children.push(dirNode);
    }
    cursor = cursor._childrenMap.get(part);
  }

  const fileNode = createFileNode(fileName, relPath, path.join(ROOT, relPath));
  cursor.children.push(fileNode);
}

function walkDir(absDir, relDir = '') {
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const entry of entries) {
    const relPath = relDir ? path.join(relDir, entry.name) : entry.name;
    const absPath = path.join(absDir, entry.name);

    if (entry.isDirectory()) {
      const skipRootAssets = !relDir && entry.name === 'assets';
      if (!skipRootAssets && !shouldSkipDir(entry.name)) {
        walkDir(absPath, relPath);
      }
      continue;
    }

    if (entry.isFile() && !shouldSkipFile(entry.name)) {
      addFile(rootNode, relPath);
    }
  }
}

function sortNodes(nodes) {
  nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name, 'zh-Hans-CN');
  });
  for (const node of nodes) {
    if (node.type === 'directory') {
      sortNodes(node.children);
      delete node._childrenMap;
    }
  }
}

function summarize(node) {
  if (node.type === 'file') {
    return {
      count: 1,
      latest: node.mtime,
    };
  }

  let count = 0;
  let latest = null;
  for (const child of node.children) {
    const summary = summarize(child);
    count += summary.count;
    if (summary.latest && (!latest || summary.latest > latest)) {
      latest = summary.latest;
    }
  }
  node.count = count;
  node.mtime = latest;
  return { count, latest };
}

function stripInternal(node) {
  if (node.type === 'file') {
    return node;
  }
  return {
    type: node.type,
    name: node.name,
    path: node.path,
    count: node.count,
    mtime: node.mtime,
    children: node.children.map(stripInternal),
  };
}

const rootNode = createDirNode('BlogMain', '');
walkDir(ROOT);
sortNodes(rootNode.children);
const summary = summarize(rootNode);
const manifest = {
  generatedAt: new Date().toISOString(),
  rootName: rootNode.name,
  totalPosts: summary.count,
  totalCategories: rootNode.children.filter((node) => node.type === 'directory').length,
  latestUpdatedAt: summary.latest ? summary.latest.slice(0, 10) : null,
  tree: rootNode.children.map(stripInternal),
};

fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`manifest written to ${normalize(path.relative(ROOT, MANIFEST_PATH))}`);
