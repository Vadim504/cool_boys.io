import { useState, useEffect, useRef } from 'react';
import './SupportModal.css';

export default function SupportModal({ isOpen, onClose }) {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Здравствуйте! Чем могу помочь?", sender: 'bot' }
  ]);
  
  const messagesEndRef = useRef(null);

  // Прокрутка вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Добавляем сообщение пользователя
    setMessages(prev => [...prev, { id: Date.now(), text: messageText, sender: 'user' }]);
    setMessageText('');

    // Имитация ответа бота через 1 сек
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Спасибо за обращение! Оператор скоро подключится.", sender: 'bot' }]);
    }, 1000);
  };

  return (
    <>
      {/* Затемнение фона (клик по нему закрывает чат) */}
      <div className={`chat-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      
      {/* Панель чата */}
      <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span className="chat-title">Поддержка</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-footer" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Введите сообщение..." 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button type="submit" className="send-btn">➤</button>
        </form>
      </div>
    </>
  );
}