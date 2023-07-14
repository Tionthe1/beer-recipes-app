import React, { useEffect, useRef, useState } from "react";
import { useBeerStore } from "./BeerStore";
import "./styles.css";

const BeerList = () => {
  const beerList = useBeerStore((state) => state.beerList);
  const selectedRecipes = useBeerStore((state) => state.selectedRecipes);
  const selectRecipe = useBeerStore((state) => state.selectRecipe);
  const deselectRecipe = useBeerStore((state) => state.deselectRecipe);
  const deleteSelectedRecipes = useBeerStore(
    (state) => state.deleteSelectedRecipes
  );

  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [visibleRange, setVisibleRange] = useState({
    startIndex: 0,
    endIndex: 15,
  });
  const [prevIndices, setPrevIndices] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    const { startIndex, endIndex } = visibleRange;
    const visibleRecipes = beerList.slice(startIndex, endIndex);
    setVisibleRecipes(visibleRecipes);
  }, [beerList, visibleRange]);

  const handleRecipeClick = (recipe) => (event) => {
    event.preventDefault();
    if (event.button === 2) {
      if (selectedRecipes.includes(recipe)) {
        deselectRecipe(recipe);
      } else {
        selectRecipe(recipe);
      }
    }
  };

  const handleDeleteSelected = () => {
    deleteSelectedRecipes();
    deselectRecipe();
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = listRef.current;
    const { startIndex, endIndex } = visibleRange;

    if (scrollTop === 0 && prevIndices.length > 0) {
      const prevIndex = prevIndices.pop();
      setPrevIndices([...prevIndices]);
      setVisibleRange(prevIndex);
    } else if (
      scrollTop < clientHeight * 0.2 &&
      startIndex > 0 &&
      prevIndices.length === 0
    ) {
      const startIndexToRestore = Math.max(0, startIndex - 5);
      setPrevIndices((prevIndices) => [...prevIndices, visibleRange]);
      setVisibleRange({
        startIndex: startIndexToRestore,
        endIndex: startIndexToRestore + 15,
      });
    } else if (
      scrollTop + clientHeight >= scrollHeight * 0.8 &&
      endIndex < beerList.length
    ) {
      setPrevIndices((prevIndices) => [...prevIndices, visibleRange]);
      setVisibleRange((prevRange) => ({
        startIndex: prevRange.startIndex + 5,
        endIndex: prevRange.endIndex + 5,
      }));
    }
  };

  const handleScrollToStart = () => {
    setVisibleRange({ startIndex: 0, endIndex: 15 });
    setPrevIndices([]);
  };

  return (
    <div className="beer-list-container" onScroll={handleScroll} ref={listRef}>
      <h1 className="beer-list-heading">Beer List</h1>
      {selectedRecipes.length > 0 && (
        <button className="delete-button" onClick={handleDeleteSelected}>
          Delete
        </button>
      )}
      <div className="beer-list">
        {visibleRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`beer-card ${
              selectedRecipes.includes(recipe) ? "selected" : ""
            }`}
            onContextMenu={handleRecipeClick(recipe)}
          >
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </div>
      {visibleRange.startIndex > 0 && (
        <button className="scroll-to-start" onClick={handleScrollToStart}>
          Scroll to Start
        </button>
      )}
    </div>
  );
};

export default BeerList;
