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
    if (formData.client !== '' &&
      formData.project !== '' &&
      (formData.hour !== '' || formData.minute !== '') &&
      formData.date !== '') {
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
        onChange={handleChange}
      />
      <input
        type="number"
        name="minute"
        placeholder="minutes"
        value={formData.minute}
        onChange={handleChange}
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
