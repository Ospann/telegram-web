// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import App from './App';
// // import useTelegram from './__mocks__/useTelegram'; // Импортируем мокированный модуль useTelegram

// // Mock useTelegram hook
// jest.mock('./utils/hooks/useTelegram');

// describe('App Component', () => {
//     it('renders without crashing', () => {
//         render(<App />);
//         const inputFormElement = screen.getByTestId('input-form');
//         expect(inputFormElement).toBeInTheDocument();
//     });

//     it('shows a message when message state is set', async () => {
//         render(<App />);
//         const message = 'Test message';
//         const messageElement = screen.getByTestId('message');
//         expect(messageElement).not.toBeVisible();

//         fireEvent.click(screen.getByTestId('send-data-button'));
//         await waitFor(() => {
//             expect(messageElement).toBeVisible();
//             expect(messageElement.textContent).toBe(message);
//         });
//     });

//     it('sends data when clicking the "Send Data" button', async () => {
//         render(<App />);
//         const mockData = { message: 'Data sent successfully' };
//         const mockResponse = new Response(JSON.stringify(mockData), {
//             status: 200,
//             headers: { 'Content-type': 'application/json' },
//         });
//         const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

//         fireEvent.click(screen.getByTestId('send-data-button'));
//         await waitFor(() => {
//             expect(mockFetch).toHaveBeenCalledWith('https://test.maxinum.kz/api/hours/', {
//                 method: 'POST',
//                 headers: {
//                     'telegram_id': '123456',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     client: '',
//                     project: '',
//                     hour: '',
//                     minute: '',
//                     date: expect.any(String),
//                     comment: '',
//                     user: '123456',
//                 }),
//             });
//             expect(screen.getByTestId('message')).toHaveTextContent('Data sent successfully');
//         });

//         mockFetch.mockRestore();
//     });

//     // Add more tests for other functionalities of the component if needed
// });
