import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import useTelegram from './utils/hooks/useTelegram';

type Project = { name: string; projects: string[]; }

type FormData = {
  client: string;
  project: string;
  hour: string;
  minute: string;
  date: string;
  comment: string;
  user: string;
}

const App = () => {
  const { onShowButton, onHideButton, tg, user } = useTelegram();
  const today = new Date();
  const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const [clients, setClients] = useState<Project[]>();
  const [message, setMessage] = useState<string>();
  const open = Boolean(message)
  const [formData, setFormData] = useState<FormData>({
    client: '',
    project: '',
    hour: '00',
    minute: '00',
    date: initialDate,
    comment: '',
    user: user.id,
  });

  const resetFormData = () => {
    setFormData({
      client: '',
      project: '',
      hour: '00',
      minute: '00',
      date: initialDate,
      comment: '',
      user: user.id,
    });
  };

  const sendData = useCallback(() => {
    fetch('https://test.maxinum.kz/api/hours/', {
      method: 'POST',
      headers: {
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
        setMessage(error);
        console.error('Error during fetch:', error);
      });
  }, [formData]);

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
    tg.onEvent('mainButtonClicked', sendData);

    return () => {
      tg.offEvent('mainButtonClicked', sendData);
    };
  }, [sendData, tg])

  useEffect(() => {
    if (
      formData.client !== '' &&
      formData.project !== '' &&
      (formData.hour !== '00' || formData.minute !== '00') &&
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

  return (
    <div className="input-form">
      <div style={{
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
          max="23"
          value={formData.hour}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minute"
          placeholder="00"
          max="59"
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
        rows={4}
        style={{ resize: 'none' }}
        value={formData.comment}
        onChange={handleChange}
      />
    </div>
  );
};

export default App;
