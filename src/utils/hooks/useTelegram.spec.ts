// src/utils/hooks/useTelegram.spec.ts
import { renderHook } from "@testing-library/react-hooks";
import useTelegram from "./useTelegram";

describe("useTelegram", () => {
  // Создаем мокированный объект Telegram.WebApp
  beforeAll(() => {
    window.Telegram = {
      WebApp: {
        expand: jest.fn(),
      },
    };
  });

  it("should return expected values", () => {
    const { result } = renderHook(() => useTelegram());
    expect(result.current.onClose).toBeInstanceOf(Function);
    expect(result.current.onShowButton).toBeInstanceOf(Function);
    expect(result.current.onHideButton).toBeInstanceOf(Function);
    expect(result.current.tg).toBeDefined();
    expect(result.current.user).toBe("mockedUser"); // Замените на ожидаемое значение
    expect(result.current.queryId).toBe("mockedQueryId"); // Замените на ожидаемое значение
  });

  // Добавьте другие тестовые сценарии для useTelegram, если необходимо
});
