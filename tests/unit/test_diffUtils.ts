/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from '@jest/globals';
import { parseFilePathFromDiff, extractContentFromDiff } from '../../src/renderer/utils/diffUtils';

describe('diffUtils', () => {
  describe('parseFilePathFromDiff', () => {
    it('should parse SVN style path (Index:)', () => {
      const diff = 'Index: src/app.tsx\n===================================================================\n--- src/app.tsx\n+++ src/app.tsx';
      expect(parseFilePathFromDiff(diff)).toBe('src/app.tsx');
    });

    it('should parse Git style new file path (+++ b/)', () => {
      const diff = '--- a/src/old.tsx\n+++ b/src/new.tsx';
      expect(parseFilePathFromDiff(diff)).toBe('src/new.tsx');
    });

    it('should parse Git style old file path (--- a/) as fallback', () => {
      const diff = '--- a/src/old.tsx\n@@ -1,1 +1,0 @@\n-content';
      expect(parseFilePathFromDiff(diff)).toBe('src/old.tsx');
    });

    it('should prioritize Index: over +++ b/ and --- a/', () => {
      const diff = 'Index: src/priority.tsx\n--- a/src/old.tsx\n+++ b/src/new.tsx';
      expect(parseFilePathFromDiff(diff)).toBe('src/priority.tsx');
    });

    it('should prioritize +++ b/ over --- a/', () => {
      const diff = '--- a/src/old.tsx\n+++ b/src/new.tsx';
      expect(parseFilePathFromDiff(diff)).toBe('src/new.tsx');
    });

    it('should return null if no path is found', () => {
      const diff = 'some random text\nwithout diff markers';
      expect(parseFilePathFromDiff(diff)).toBeNull();
    });

    it('should handle paths with leading/trailing spaces', () => {
      const diff = 'Index:   src/space.tsx  \n';
      expect(parseFilePathFromDiff(diff)).toBe('src/space.tsx');
    });
  });

  describe('extractContentFromDiff', () => {
    it('should extract content from a standard diff and remove context space', () => {
      const diff = `Index: test.ts
=======
--- test.ts
+++ test.ts
@@ -1,3 +1,3 @@
 context
-old
+new
 context2`;
      expect(extractContentFromDiff(diff)).toBe('context\nnew\ncontext2');
    });

    it('should handle multiple hunks', () => {
      const diff = `+++ b/file.ts
@@ -1,2 +1,2 @@
 line1
-line2
+new-line2
@@ -10,2 +10,2 @@
 line10
-line11
+new-line11`;
      const expected = 'line1\nnew-line2\nline10\nnew-line11';
      expect(extractContentFromDiff(diff)).toBe(expected);
    });

    it('should skip metadata lines including index', () => {
      const diff = `diff --git a/file.ts b/file.ts
index 1234567..89abcdef 100644
--- a/file.ts
+++ b/file.ts
@@ -1,1 +1,1 @@
-old
+new`;
      expect(extractContentFromDiff(diff)).toBe('new');
    });

    it('should skip complex metadata lines', () => {
      const diff = `diff --git a/old.ts b/new.ts
similarity index 100%
rename from old.ts
rename to new.ts
--- a/old.ts
+++ b/new.ts
@@ -1,1 +1,1 @@
-old
+new`;
      expect(extractContentFromDiff(diff)).toBe('new');
    });

    it('should skip deleted lines and backslash lines', () => {
      const diff = `+++ b/file.ts
@@ -1,1 +1,1 @@
-old
+new
\\ No newline at end of file`;
      expect(extractContentFromDiff(diff)).toBe('new');
    });

    it('should return empty string for empty diff or only metadata', () => {
      expect(extractContentFromDiff('')).toBe('');
      expect(extractContentFromDiff('Index: file.ts\n=======')).toBe('');
    });

    it('should handle added lines only', () => {
      const diff = `+++ b/file.ts
@@ -0,0 +1,2 @@
+line 1
+line 2`;
      expect(extractContentFromDiff(diff)).toBe('line 1\nline 2');
    });
  });
});
