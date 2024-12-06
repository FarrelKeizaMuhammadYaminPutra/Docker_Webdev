const fetch = require('node-fetch');

describe('Test Fetch', () => {
    it('should return data from API', async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      
      expect(data).toHaveProperty('id', 1);
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('body');
    });
  
    it('should handle fetch error', async () => {
      await expect(fetch('https://invalidurl')).rejects.toThrow();
    });
  });
  