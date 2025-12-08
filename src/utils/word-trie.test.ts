import { describe, expect, it } from 'vitest';

import { WordTrie } from './word-trie.js';

describe('WordTrie', () => {
  describe('constructor', () => {
    it('should create an empty trie', () => {
      const trie = new WordTrie();
      expect(trie.numWords).toBe(0);
    });
  });

  describe('insert', () => {
    it('should insert a prefix without marking as word', () => {
      const trie = new WordTrie();
      trie.insert('hello', false);

      expect(trie.exists('hello')).toBe(true);
      expect(trie.isWord('hello')).toBe(false);
      expect(trie.numWords).toBe(0);
    });

    it('should insert a word and mark it as a word', () => {
      const trie = new WordTrie();
      trie.insert('hello', true);

      expect(trie.exists('hello')).toBe(true);
      expect(trie.isWord('hello')).toBe(true);
      expect(trie.numWords).toBe(1);
    });

    it('should insert multiple words', () => {
      const trie = new WordTrie();
      trie.insert('cat', true);
      trie.insert('car', true);
      trie.insert('card', true);

      expect(trie.isWord('cat')).toBe(true);
      expect(trie.isWord('car')).toBe(true);
      expect(trie.isWord('card')).toBe(true);
      expect(trie.numWords).toBe(3);
    });

    it('should handle words that share prefixes', () => {
      const trie = new WordTrie();
      trie.insert('test', true);
      trie.insert('testing', true);

      expect(trie.isWord('test')).toBe(true);
      expect(trie.isWord('testing')).toBe(true);
      expect(trie.exists('tes')).toBe(true);
      expect(trie.isWord('tes')).toBe(false);
      expect(trie.numWords).toBe(2);
    });

    it('should handle single character words', () => {
      const trie = new WordTrie();
      trie.insert('a', true);
      trie.insert('I', true);

      expect(trie.isWord('a')).toBe(true);
      expect(trie.isWord('I')).toBe(true);
      expect(trie.numWords).toBe(2);
    });

    it('should handle empty string', () => {
      const trie = new WordTrie();
      trie.insert('', true);

      expect(trie.isWord('')).toBe(true);
      expect(trie.numWords).toBe(1);
    });
  });

  describe('exists', () => {
    it('should return true for existing prefix', () => {
      const trie = new WordTrie();
      trie.insert('hello', true);

      expect(trie.exists('h')).toBe(true);
      expect(trie.exists('he')).toBe(true);
      expect(trie.exists('hel')).toBe(true);
      expect(trie.exists('hell')).toBe(true);
      expect(trie.exists('hello')).toBe(true);
    });

    it('should return false for non-existing prefix', () => {
      const trie = new WordTrie();
      trie.insert('hello', true);

      expect(trie.exists('world')).toBe(false);
      expect(trie.exists('hi')).toBe(false);
      expect(trie.exists('helloworld')).toBe(false);
    });

    it('should return true for prefix that is not a word', () => {
      const trie = new WordTrie();
      trie.insert('hello', true);

      expect(trie.exists('hel')).toBe(true);
      expect(trie.isWord('hel')).toBe(false);
    });

    it('should return false for empty trie', () => {
      const trie = new WordTrie();
      expect(trie.exists('anything')).toBe(false);
    });
  });

  describe('isWord', () => {
    it('should return true for inserted words', () => {
      const trie = new WordTrie();
      trie.insert('cat', true);
      trie.insert('dog', true);

      expect(trie.isWord('cat')).toBe(true);
      expect(trie.isWord('dog')).toBe(true);
    });

    it('should return false for prefixes that are not words', () => {
      const trie = new WordTrie();
      trie.insert('testing', true);

      expect(trie.isWord('test')).toBe(false);
      expect(trie.isWord('tes')).toBe(false);
      expect(trie.isWord('t')).toBe(false);
    });

    it('should return false for non-existing strings', () => {
      const trie = new WordTrie();
      trie.insert('hello', true);

      expect(trie.isWord('world')).toBe(false);
      expect(trie.isWord('helloworld')).toBe(false);
    });

    it('should distinguish between prefix and word', () => {
      const trie = new WordTrie();
      trie.insert('test', false); // Insert as prefix only
      trie.insert('testing', true); // Insert as word

      expect(trie.exists('test')).toBe(true);
      expect(trie.isWord('test')).toBe(false);
      expect(trie.isWord('testing')).toBe(true);
    });
  });

  describe('numWords', () => {
    it('should count only words, not prefixes', () => {
      const trie = new WordTrie();
      trie.insert('hel', false);
      trie.insert('hello', true);
      trie.insert('help', true);

      expect(trie.numWords).toBe(2);
    });

    it('should not increment count for prefixes', () => {
      const trie = new WordTrie();
      trie.insert('a', false);
      trie.insert('ab', false);
      trie.insert('abc', false);

      expect(trie.numWords).toBe(0);
    });

    it('should handle updating existing word', () => {
      const trie = new WordTrie();
      trie.insert('test', true);
      trie.insert('test', true); // Insert again

      // Should only count once, even if inserted multiple times
      expect(trie.numWords).toBe(1);
    });
  });

  describe('integration tests', () => {
    it('should handle a dictionary of words', () => {
      const trie = new WordTrie();
      const words = ['apple', 'app', 'apply', 'application', 'banana', 'band'];

      for (const word of words) {
        trie.insert(word, true);
      }

      expect(trie.numWords).toBe(words.length);

      // All words should exist and be marked as words
      for (const word of words) {
        expect(trie.exists(word)).toBe(true);
        expect(trie.isWord(word)).toBe(true);
      }

      // Common prefixes should exist but not be words
      expect(trie.exists('app')).toBe(true);
      expect(trie.exists('appl')).toBe(true);
      expect(trie.exists('ban')).toBe(true);
    });

    it('should handle mixed insert operations', () => {
      const trie = new WordTrie();

      // Insert prefixes first
      trie.insert('uni', false);
      trie.insert('univ', false);
      trie.insert('unive', false);

      // Then insert complete word
      trie.insert('university', true);

      expect(trie.exists('uni')).toBe(true);
      expect(trie.isWord('uni')).toBe(false);
      expect(trie.isWord('university')).toBe(true);
      expect(trie.numWords).toBe(1);
    });
  });
});
