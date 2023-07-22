const useTelegramMock = jest.fn(() => ({
  onClose: jest.fn(),
  onShowButton: jest.fn(),
  onHideButton: jest.fn(),
  tg: {
    MainButton: {
      text: "",
      show: jest.fn(),
      hide: jest.fn(),
    },
    expand: jest.fn(),
    close: jest.fn(),
    initDataUnsafe: {
      user: "mocked-user",
      query_id: "mocked-query_id",
    },
  },
}));

export default useTelegramMock;
