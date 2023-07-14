import create from "zustand";
import { persist } from "zustand/middleware";

const beerStore = persist(
  (set) => ({
    beerList: [],
    selectedRecipes: [],
    selectedRecipe: null,
    page: 1,
    hasMore: true,
    fetchBeers: async (page, limit) => {
      try {
        const response = await fetch(
          `https://api.punkapi.com/v2/beers?page=${page}&per_page=${limit}`
        );
        const data = await response.json();
        set((state) => ({
          beerList: [...state.beerList, ...data],
          page,
          hasMore: data.length === limit,
        }));
      } catch (error) {
        console.error("Error fetching beers:", error);
      }
    },
    selectRecipe: (recipe) =>
      set((state) => ({
        selectedRecipe: recipe,
        selectedRecipes: [...state.selectedRecipes, recipe],
      })),
    deselectRecipe: (recipe) =>
      set((state) => ({
        selectedRecipe: null,
        selectedRecipes: state.selectedRecipes.filter((r) => r !== recipe),
      })),
    deleteSelectedRecipes: () =>
      set((state) => ({
        beerList: state.beerList.filter(
          (recipe) => !state.selectedRecipes.includes(recipe)
        ),
        selectedRecipes: [],
        selectedRecipe: null,
      })),
  }),
  {
    name: "beer-store",
  }
);

export const useBeerStore = create(beerStore);
