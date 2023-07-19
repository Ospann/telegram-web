import { useState, ChangeEvent, useEffect } from 'react';
import useTelegram from './utils/hooks/useTelegram';

const App = () => {
  const { onShowButton, onHideButton } = useTelegram();
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    hour: '',
    minute: '',
    date: '',
    comment: '',
  });

  useEffect(() => {
    console.log(formData)
    if (
      formData.client !== '' &&
      // formData.project !== '' &&
      (formData.hour !== '' || formData.minute !== '') &&
      formData.date !== ''
    ) {
      onShowButton()
    } else {
      onHideButton();
    }
  }, [formData, onHideButton, onShowButton]);

  const handleChange = ({
    target,
  }: ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >) => {
    const { name, value } = target;
    console.log(name)
    console.log(value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Функция, которая ограничивает значения часов до 24
  const handleHourChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    value = Math.min(Math.max(value, 0), 24);
    setFormData((prevData) => ({
      ...prevData,
      hour: value.toString().padStart(2, '0'), // Добавляем ведущий ноль для однозначных чисел (например, 5 => 05)
    }));
  };

  // Функция, которая ограничивает значения минут до 60
  const handleMinuteChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    value = Math.min(Math.max(value, 0), 59);
    setFormData((prevData) => ({
      ...prevData,
      minute: value.toString().padStart(2, '0'), // Добавляем ведущий ноль для однозначных чисел (например, 5 => 05)
    }));
  };

  // Обработчик скроллинга для часов
  const handleHourScroll = (event: React.WheelEvent<HTMLInputElement>) => {
    const increment = event.deltaY > 0 ? 1 : -1; // Определяем направление скроллинга
    let value = parseInt(formData.hour, 10) + increment;
    value = Math.min(Math.max(value, 0), 24);
    setFormData((prevData) => ({
      ...prevData,
      hour: value.toString().padStart(2, '0'), // Добавляем ведущий ноль для однозначных чисел (например, 5 => 05)
    }));
    event.preventDefault(); // Предотвращаем прокрутку страницы при скроллинге внутри инпута
  };

  // Обработчик скроллинга для минут
  const handleMinuteScroll = (event: React.WheelEvent<HTMLInputElement>) => {
    console.log('скроллинг')
    const increment = event.deltaY > 0 ? 1 : -1; // Определяем направление скроллинга
    let value = parseInt(formData.minute, 10) + increment;
    value = Math.min(Math.max(value, 0), 59);
    setFormData((prevData) => ({
      ...prevData,
      minute: value.toString().padStart(2, '0'), // Добавляем ведущий ноль для однозначных чисел (например, 5 => 05)
    }));
    event.preventDefault(); // Предотвращаем прокрутку страницы при скроллинге внутри инпута
  };

  return (
    <div className="input-form">
      <input
        type="text"
        name="client"
        placeholder="Client Search"
        value={formData.client}
        onChange={handleChange}
      />
      <select name="project" value={formData.project} onChange={handleChange}>
        <option value="">test</option>
        <option value="">test</option>
        <option value="">test</option>
      </select>
      <input
        placeholder="hours"
        type="number"
        name="hour"
        value={formData.hour}
        readOnly
        onChange={handleHourChange}
        onWheel={handleHourScroll} // Добавляем обработчик скроллинга
      />
      <input
        type="number"
        name="minute"
        placeholder="minutes"
        readOnly
        value={formData.minute}
        onChange={handleMinuteChange}
        onWheel={handleMinuteScroll} // Добавляем обработчик скроллинга
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <textarea
        placeholder="comment..."
        name="comment"
        cols={30}
        rows={3}
        style={{ resize: 'none' }}
        value={formData.comment}
        onChange={handleChange}
      />
    </div>
  );
};

export default App;
