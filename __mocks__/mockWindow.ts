// mockWindow.ts
declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

const mockWindow: Window = {
  Telegram: {
    WebApp: {},
  },
};

export default mockWindow;
