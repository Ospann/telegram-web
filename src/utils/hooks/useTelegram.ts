declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

const tg = window.Telegram.WebApp;
tg.expand();

const useTelegram = () => {
  const onClose = () => {
    tg.close();
  };

  const onShowButton = () => {
    tg.MainButton.text = "SUBMIT";
    tg.MainButton.show();
  };

  const onHideButton = () => {
    tg.MainButton.hide();
  };

  return {
    onClose,
    onShowButton,
    onHideButton,
    tg,
    user: tg.initDataUnsafe?.user,
    queryId: tg.initDataUnsafe?.query_id,
  };
};

export default useTelegram;
