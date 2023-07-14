import React from "react";
import { useBeerStore } from "./BeerStore";

const BeerDetails = () => {
  const selectedBeer = useBeerStore((state) => state.selectedRecipe);
  const deselectRecipe = useBeerStore((state) => state.deselectRecipe);

  const handleGoBack = () => {
    deselectRecipe(selectedBeer);
  };

  if (!selectedBeer) {
    return <div className="beer-details">No beer selected.</div>;
  }

  return (
    <div className="beer-details">
      <h1>{selectedBeer.name}</h1>
      <p>{selectedBeer.description}</p>
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default BeerDetails;
