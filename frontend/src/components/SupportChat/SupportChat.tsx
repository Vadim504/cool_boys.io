import React, { useEffect, useMemo, useRef, useState } from 'react';
import './SupportChat.css';

const FAQ_RULES = [
  {
    keys: ['доставк', 'курьер', 'привезут', 'приедет'],
    answer: 'Доставка обычно занимает 15-45 минут, точное время зависит от загруженности и адреса.',
  },
  {
    keys: ['оплат', 'карт', 'налич', 'apple pay', 'google pay'],
    answer: 'Оплатить можно картой онлайн, через Apple Pay/Google Pay. Наличная оплата сейчас недоступна.',
  },
  {
    keys: ['возврат', 'вернут', 'деньги', 'брак'],
    answer: 'Если товар не подошел или есть брак, напишите номер заказа и фото товара, мы оформим возврат.',
  },
  {
    keys: ['заказ', 'статус', 'где мой', 'номер заказа'],
    answer: 'Проверьте статус в разделе "Заказы". Если не обновляется более 20 минут, передам запрос оператору.',
  },
  {
    keys: ['привет', 'здравств', 'добрый'],
    answer: 'Здравствуйте! Могу подсказать по доставке, оплате, возврату и статусу заказа.',
  },
];

const COMPLEX_KEYS = ['не работает', 'жалоб', 'проблем', 'ошибк', 'списали', 'не приш', 'отмен', 'оператор', 'человек'];

const SupportChat = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [isOperatorConnected, setIsOperatorConnected] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Здравствуйте! Чем я могу вам помочь?',
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = useMemo(
    () => ['Где мой заказ?', 'Сколько доставка?', 'Как сделать возврат?', 'Связать с оператором'],
    []
  );

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role: 'bot', text }]);
  };

  const addOperatorMessage = (text) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role: 'operator', text }]);
  };

  const connectOperator = () => {
    if (isOperatorConnected) return;
    setIsOperatorConnected(true);
    addBotMessage('Подключаю оператора. Обычно это занимает до 2 минут.');
    setTimeout(() => {
      addOperatorMessage('Здравствуйте, я оператор Анна. Опишите ситуацию подробнее, пожалуйста.');
    }, 900);
  };

  const getBotAnswer = (text) => {
    const normalized = text.toLowerCase();

    if (COMPLEX_KEYS.some((key) => normalized.includes(key))) {
      return { needsOperator: true };
    }

    const matchedRule = FAQ_RULES.find((rule) =>
      rule.keys.some((key) => normalized.includes(key))
    );

    if (matchedRule) {
      return { answer: matchedRule.answer, needsOperator: false };
    }

    return {
      answer:
        'Понял вас. Для точного ответа лучше подключить живого оператора. Хотите, я передам ваш вопрос?',
      needsOperator: true,
    };
  };

  const handleSend = (textValue) => {
    const text = textValue.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text }]);
    setInput('');

    if (isOperatorConnected) {
      setTimeout(() => {
        addOperatorMessage('Принял ваш вопрос. Проверяю информацию и вернусь с ответом в ближайшее время.');
      }, 700);
      return;
    }

    const result = getBotAnswer(text);
    setTimeout(() => {
      if (result.answer) addBotMessage(result.answer);
      if (result.needsOperator) connectOperator();
    }, 500);
  };

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-window" onClick={(e) => e.stopPropagation()}>
        <button className="chat-close-button" onClick={onClose}>×</button>
        <div className="chat-header">
          <span>Поддержка</span>
        </div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg-row ${msg.role === 'user' ? 'msg-row-user' : ''}`}
            >
              <div
                className={`msg-bubble ${
                  msg.role === 'user'
                    ? 'msg-user'
                    : msg.role === 'operator'
                    ? 'msg-operator'
                    : 'msg-bot'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        {!isOperatorConnected && (
          <div className="chat-suggestions">
            {suggestions.map((item) => (
              <button key={item} type="button" onClick={() => handleSend(item)}>
                {item}
              </button>
            ))}
          </div>
        )}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Напишите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(input);
            }}
          />
          <button type="button" onClick={() => handleSend(input)}>Отправить</button>
        </div>
      </div>
    </div>
  );
};
export default SupportChat;