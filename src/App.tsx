import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import useTelegram from './utils/hooks/useTelegram';
import IProject from './utils/interfaces/IProjects';
import IFormData from './utils/interfaces/IFormData';
import validation from './utils/helpers/validation';
import { Input, Select, Textarea, useToast, Box } from '@chakra-ui/react';

const App = () => {
  const toast = useToast();
  const { onShowButton, onHideButton, tg, user } = useTelegram();
  const today = new Date();
  const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const [clients, setClients] = useState<IProject[]>();

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
    onHideButton();
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
        toast({
          title: 'Success',
          description: data.message,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

      });
  }, [formData]);

  useEffect(() => {
    if (!user) {
      return;
    }
    resetFormData();
    const url = `https://test.maxinum.kz/api/hours/meta?telegram_id=${user.id}`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        const data = await response.json();
        setClients(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          tg.close();
        }, 3000);
      }
    };

    fetchData();
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
    if (name === 'hour' && (Number(value) > 23 || Number(value) < 0)) return;
    if (name === 'minute' && (Number(value) > 59 || Number(value) < 0)) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box className="input-form">
      <Select
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
      </Select>
      <Select
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
      </Select>
      <Box className='time-form'>
        <Input
          placeholder="00"
          type="number"
          name="hour"
          value={formData.hour}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="minute"
          placeholder="00"
          value={formData.minute}
          onChange={handleChange}
        />
      </Box>
      <Input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <Textarea
        placeholder="comment..."
        name="comment"
        cols={30}
        rows={5}
        style={{ resize: 'none' }}
        value={formData.comment}
        onChange={handleChange}
      />
    </Box>
  );
};

export default App;
