import { useState, ChangeEvent, useEffect } from 'react';
import useTelegram from './utils/hooks/useTelegram';

type Project = { name: string; projects: string[]; }

const App = () => {
  const { onShowButton, onHideButton, tg } = useTelegram();
  const today = new Date();
  const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const [clients, setClients] = useState<Project[]>();
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    hour: '00',
    minute: '00',
    date: initialDate,
    comment: '',
  });

  //Function after submit button
  // tg.MainButton.onClick(
  //   setFormData({
  //     client: '',
  //     project: '',
  //     hour: '00',
  //     minute: '00',
  //     date: initialDate,
  //     comment: '',
  //   })
  // )

  tg.MainButton.onClick = () => {
    setFormData({
      client: '',
      project: '',
      hour: '00',
      minute: '00',
      date: initialDate,
      comment: '',
    })
  }

  useEffect(() => {
    fetch('https://test.maxinum.kz/api/hours/meta')
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (
      formData.client !== '' &&
      formData.project !== '' &&
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

  // // Обработчик окончания тяги для часов
  // const handleHourDragEnd = (event: React.TouchEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   const startY = parseInt(event.currentTarget.dataset.startY || '0', 10);
  //   const endY = event.changedTouches[0].clientY;
  //   const diff = startY - endY;
  //   const increment = diff > 0 ? 1 : -1;
  //   let value = parseInt(formData.hour, 10) + increment;
  //   value = Math.min(Math.max(value, 0), 23);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     hour: value.toString().padStart(2, '0'),
  //   }));
  // };

  // // Обработчик окончания тяги для минут
  // const handleMinuteDragEnd = (event: React.TouchEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   const startY = parseInt(event.currentTarget.dataset.startY || '0', 10);
  //   const endY = event.changedTouches[0].clientY;
  //   const diff = startY - endY;
  //   const increment = diff > 0 ? 5 : -5;
  //   let value = parseInt(formData.minute, 10) + increment;
  //   value = Math.min(Math.max(value, 0), 59);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     minute: value.toString().padStart(2, '0'),
  //   }));
  // };


  // Функция для изменения значения часов при тяге
  const handleHourDrag = (increment: number) => {
    let value = parseInt(formData.hour, 10) + increment;
    value = Math.min(Math.max(value, 0), 23);
    setFormData((prevData) => ({
      ...prevData,
      hour: value.toString().padStart(2, '0'),
    }));
  };

  // Функция для изменения значения минут при тяге
  const handleMinuteDrag = (increment: number) => {
    let value = parseInt(formData.minute, 10) + increment;
    value = Math.min(Math.max(value, 0), 59);
    setFormData((prevData) => ({
      ...prevData,
      minute: value.toString().padStart(2, '0'),
    }));
  };

  // Инициализация таймеров для тяга вверх и вниз по часам
  let hourDragTimer: number | null = null;
  const startHourDrag = (increment: number) => {
    if (hourDragTimer) return;
    handleHourDrag(increment);
    hourDragTimer = setInterval(() => {
      handleHourDrag(increment);
    }, 1000);
  };
  const endHourDrag = () => {
    if (hourDragTimer) {
      clearInterval(hourDragTimer);
      hourDragTimer = null;
    }
  };

  // Инициализация таймеров для тяга вверх и вниз по минутам
  let minuteDragTimer: number | null = null;
  const startMinuteDrag = (increment: number) => {
    if (minuteDragTimer) return;
    handleMinuteDrag(increment);
    minuteDragTimer = setInterval(() => {
      handleMinuteDrag(increment);
    }, 1000);
  };
  const endMinuteDrag = () => {
    if (minuteDragTimer) {
      clearInterval(minuteDragTimer);
      minuteDragTimer = null;
    }
  };


  return (
    <div className="input-form">
      <select
        name="client"
        value={formData.client}
        onChange={handleChange}
      >
        <option value="">Select a client</option>
        {clients?.map((client) => (
          <option key={client.name} value={client.name}>
            {client.name}
          </option>
        ))}
      </select>
      <select
        name="project"
        value={formData.project}
        onChange={handleChange}
        disabled={!formData.client}
      >
        <option value="">Select a project</option>
        {formData.client &&
          clients
            ?.find((client) => client.name === formData.client)
            ?.projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
      </select>
      <div className='time-form'>
        <input
          placeholder="hours"
          type="number"
          name="hour"
          value={formData.hour}
          onChange={handleHourChange}
          onTouchStart={(event) => startHourDrag(event.touches[0].clientY > event.currentTarget.offsetTop ? 1 : -1)}
          onTouchEnd={endHourDrag}
        />
        <input
          type="number"
          name="minute"
          placeholder="minutes"
          value={formData.minute}
          onChange={handleMinuteChange}
          onTouchStart={(event) => startMinuteDrag(event.touches[0].clientY > event.currentTarget.offsetTop ? 5 : -5)}
          onTouchEnd={endMinuteDrag}
        />
      </div>
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
        rows={4}
        style={{ resize: 'none' }}
        value={formData.comment}
        onChange={handleChange}
      />
    </div>
  );
};

export default App;
