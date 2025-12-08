class TrieNode {
  children: Record<string, TrieNode> = {};

  isWord: boolean = false;
}

export class WordTrie {
  get numWords() {
    return this.count;
  }

  private count = 0;

  private root: TrieNode = new TrieNode();

  exists(prefix: string): boolean {
    let node = this.root;
    for (const letter of prefix) {
      if (!node.children[letter]) {
        return false;
      }

      node = node.children[letter];
    }

    return true;
  }

  insert(word: string, isWord = false): void {
    let node = this.root;
    for (const letter of word) {
      if (!node.children[letter]) {
        node.children[letter] = new TrieNode();
      }

      node = node.children[letter];
    }

    // Only increment count if we're marking a new word
    if (isWord && !node.isWord) {
      this.count++;
    }

    node.isWord = isWord;
  }

  isWord(word: string): boolean {
    let node = this.root;
    for (const letter of word) {
      if (!node.children[letter]) {
        return false;
      }

      node = node.children[letter];
    }

    return node.isWord;
  }
}
