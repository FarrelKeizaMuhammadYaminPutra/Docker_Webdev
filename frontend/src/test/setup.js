// Import jest-dom untuk assertion tambahan
import '@testing-library/jest-dom';

// Mock global fetch jika tidak tersedia di lingkungan pengujian
if (!globalThis.fetch) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  );
}

// Tambahkan logging untuk memastikan setup file ter-load
console.log('Jest setup file loaded!');

const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('React does not recognize the')) {
      return; // Abaikan pesan tertentu
    }
    originalError(...args); // Log error lainnya
  };
});


afterAll(() => {
  console.error = originalError;
});

// Tambahkan global configuration jika diperlukan
// Contoh: Mock lokal penyimpanan browser
beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

global.alert = jest.fn(); // Mock fungsi alert
global.confirm = jest.fn(() => true); // Mock global confirm

beforeAll(() => {
  // Mock console.warn to suppress the React Router future warnings
  jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (
      message.includes('React Router Future Flag Warning') ||
      message.includes('Relative route resolution within Splat routes')
    ) {
      return;
    }
    console.warn(message); // Log all other warnings to the console
  });
});

afterAll(() => {
  // Restore the original console.warn after tests are done
  console.warn.mockRestore();
});

global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// src/test/setup.js or src/setupTests.js
beforeAll(() => {
  // Mock createObjectURL to avoid the error
  global.URL.createObjectURL = jest.fn(() => 'mocked-object-url');
});

// src/test/setup.js or src/setupTests.js
afterEach(() => {
  jest.clearAllMocks();
});



