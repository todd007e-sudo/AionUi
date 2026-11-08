import { describe, it, expect } from '@jest/globals';
import { joinPath } from '../../src/common/chatLib';

describe('chatLib', () => {
  describe('joinPath', () => {
    it('should join two simple paths', () => {
      const result = joinPath('/base/path', 'sub/dir');
      expect(result).toBe('/base/path/sub/dir');
    });

    it('should normalize Windows backslashes to forward slashes', () => {
      const result = joinPath('C:\\Users\\Name', 'Documents\\File.txt');
      expect(result).toBe('C:/Users/Name/Documents/File.txt');
    });

    it('should handle mixed slashes', () => {
      const result = joinPath('/var/www\\html', 'images/logo.png');
      expect(result).toBe('/var/www/html/images/logo.png');
    });

    it('should remove trailing slash from base path', () => {
      const result = joinPath('/base/path/', 'sub/dir');
      expect(result).toBe('/base/path/sub/dir');
    });

    it('should handle multiple slashes', () => {
      const result = joinPath('/base//path', 'sub//dir');
      expect(result).toBe('/base/path/sub/dir');
    });

    it('should ignore current directory (.) segments', () => {
      const result = joinPath('/base/path', './sub/./dir');
      expect(result).toBe('/base/path/sub/dir');
    });

    it('should handle parent directory (..) segments correctly within relative path', () => {
      const result = joinPath('/base/path', 'sub/inner/../dir');
      expect(result).toBe('/base/path/sub/dir');
    });

    it('should not allow traversing above the relative path root (sandbox behavior)', () => {
      // The implementation of joinPath drops '..' if it tries to go above the start of the relative path array.
      const result = joinPath('/base/path', '../file');
      expect(result).toBe('/base/path/file');
    });

    it('should handle complex relative paths with multiple ..', () => {
        const result = joinPath('/base', 'a/b/../../c');
        // a -> a,b -> a -> empty -> c
        expect(result).toBe('/base/c');
    });

    it('should handle empty relative path', () => {
        const result = joinPath('/base/path', '');
        expect(result).toBe('/base/path/');
    });

    it('should handle empty base path', () => {
         const result = joinPath('', 'sub/dir');
         expect(result).toBe('/sub/dir');
    });

    it('should handle root path as base', () => {
        const result = joinPath('/', 'etc/passwd');
        expect(result).toBe('/etc/passwd');
    });
  });
});
