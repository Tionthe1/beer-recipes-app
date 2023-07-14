import React, { useEffect } from "react";
import BeerList from "./BeerList";
import { useBeerStore } from "./BeerStore";

const App = () => {
  const fetchBeers = useBeerStore((state) => state.fetchBeers);

  useEffect(() => {
    fetchBeers(1, 25); // Запитати перші 25 рецептів пива при завантаженні компонента
  }, [fetchBeers]);

  return <BeerList />;
};

export default App;
