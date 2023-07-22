import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import useTelegram from './utils/hooks/useTelegram';
import IProject from './utils/interfaces/IProjects';
import IFormData from './utils/interfaces/IFormData';
import validation from './utils/helpers/validation';

const App = () => {
  const { onShowButton, onHideButton, tg, user } = useTelegram();
  const today = new Date();
  const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const [clients, setClients] = useState<IProject[]>();
  const [message, setMessage] = useState<string>();
  const open = Boolean(message);

  const [formData, setFormData] = useState<IFormData>({
    client: '',
    project: '',
    hour: '',
    minute: '',
    date: initialDate,
    comment: '',
    user: '',
  });

  const resetFormData = () => {
    setFormData({
      client: '',
      project: '',
      hour: '',
      minute: '',
      date: initialDate,
      comment: '',
      user: user.id,
    });
  };

  const sendData = useCallback(() => {
    fetch('https://test.maxinum.kz/api/hours/', {
      method: 'POST',
      headers: {
        'telegram_id': user.id,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        resetFormData();
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error('Error during fetch:', error);
      });
  }, [formData]);

  useEffect(() => {
    if (!user) {
      return;
    }
    resetFormData();
    const url = `https://test.maxinum.kz/api/hours/meta?telegram_id=${user.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
      })
      .catch((error) => {
        setMessage(error);
        setTimeout(() => {
          tg.close();
        }, 3000)
        console.error('Error fetching data:', error);
      });
  }, [tg, user]);

  useEffect(() => {
    tg.onEvent('mainButtonClicked', sendData);

    return () => {
      tg.offEvent('mainButtonClicked', sendData);
    };
  }, [sendData, tg])

  useEffect(() => {
    if (validation(formData)) {
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
    if (name === 'hour' && Number(value) > 23) return;
    if (name === 'minute' && Number(value) > 59) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="input-form">
      <div
        className='message'
        style={{
          border: '1px solid gray',
          display: open ? 'block' : 'none'
        }}>
        {message}
      </div>
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
          placeholder="00"
          type="number"
          name="hour"
          value={formData.hour}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minute"
          placeholder="00"
          value={formData.minute}
          onChange={handleChange}
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
        rows={5}
        style={{ resize: 'none' }}
        value={formData.comment}
        onChange={handleChange}
      />
    </div>
  );
};

export default App;
