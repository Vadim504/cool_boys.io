import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Получаем "пицца" из ?q=пицца

  return (
    <div>
      <h1>Результаты по запросу: {query}</h1>
      {/* Тут логика фильтрации всех товаров по слову query */}
    </div>
  );
};