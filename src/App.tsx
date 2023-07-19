import { useState, ChangeEvent, useEffect } from 'react';
import useTelegram from './utils/hooks/useTelegram';

const App = () => {
  const { onShowButton, onHideButton } = useTelegram();
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    hour: '00',
    minute: '00',
    date: '',
    comment: '',
  });

  useEffect(() => {
    console.log(formData);
    if (
      formData.client !== '' &&
      // formData.project !== '' &&
      (formData.hour !== '' || formData.minute !== '') &&
      formData.date !== ''
    ) {
      onShowButton();
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

  // Обработчик тяги для часов
  const handleHourDrag = (event: React.TouchEvent<HTMLInputElement>) => {
    event.preventDefault();
    const startY = event.touches[0].clientY;
    event.currentTarget.dataset.startY = startY.toString();
  };

  // Обработчик окончания тяги для часов
  const handleHourDragEnd = (event: React.TouchEvent<HTMLInputElement>) => {
    event.preventDefault();
    const startY = parseInt(event.currentTarget.dataset.startY || '0', 10);
    const endY = event.changedTouches[0].clientY;
    const diff = startY - endY;
    const increment = Math.floor(diff / 15); // Здесь можно настроить чувствительность свайпа, чем больше число, тем меньше чувствительность
    let value = parseInt(formData.hour, 10) + increment;
    value = Math.min(Math.max(value, 0), 24);
    setFormData((prevData) => ({
      ...prevData,
      hour: value.toString().padStart(2, '0'),
    }));
  };

  // Обработчик тяги для минут
  const handleMinuteDrag = (event: React.TouchEvent<HTMLInputElement>) => {
    event.preventDefault();
    const startY = event.touches[0].clientY;
    event.currentTarget.dataset.startY = startY.toString();
  };

  // Обработчик окончания тяги для минут
  const handleMinuteDragEnd = (event: React.TouchEvent<HTMLInputElement>) => {
    event.preventDefault();
    const startY = parseInt(event.currentTarget.dataset.startY || '0', 10);
    const endY = event.changedTouches[0].clientY;
    const diff = startY - endY;
    const increment = Math.floor(diff / 15); // Здесь можно настроить чувствительность свайпа, чем больше число, тем меньше чувствительность
    let value = parseInt(formData.minute, 10) + increment;
    value = Math.min(Math.max(value, 0), 59);
    setFormData((prevData) => ({
      ...prevData,
      minute: value.toString().padStart(2, '0'),
    }));
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
        onChange={handleHourChange}
        onTouchStart={handleHourDrag}
        onTouchEnd={handleHourDragEnd}
      />
      <input
        type="number"
        name="minute"
        placeholder="minutes"
        value={formData.minute}
        onChange={handleMinuteChange}
        onTouchStart={handleMinuteDrag}
        onTouchEnd={handleMinuteDragEnd}
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
