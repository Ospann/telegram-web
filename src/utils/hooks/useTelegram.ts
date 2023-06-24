declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

const tg = window.Telegram.WebApp;

const useTelegram = () => {
  const onClose = () => {
    tg.close();
  };

  const onToggleButton = () => {
    if (tg.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  const onShowButton = () =>{
    tg.MainButton.show();
  }

  return {
    onClose,
    onToggleButton,
    onShowButton,
    tg,
    user: tg.initDataUnsafe?.user,
    queryId: tg.initDataUnsafe?.query_id,
  };
};

export default useTelegram;
