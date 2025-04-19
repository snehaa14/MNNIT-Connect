// utils/trie.js
class TrieNode {
  constructor() {
    this.children = {};
    this.ids = new Set(); // Store matched user IDs
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, id) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.ids.add(id); // Add to all prefixes
    }
  }

  // For startsWith
  searchPrefix(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return new Set();
      node = node.children[char];
    }
    return node.ids;
  }

  // For contains - fallback to all matches
  getAllMatching(query) {
    const results = new Set();

    const dfs = (node, path) => {
      if (path.includes(query.toLowerCase())) {
        for (let id of node.ids) results.add(id);
      }
      for (let char in node.children) {
        dfs(node.children[char], path + char);
      }
    };

    dfs(this.root, "");
    return results;
  }
}
