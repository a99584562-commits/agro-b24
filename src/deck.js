import { createContext, useContext } from "react";

// Навигация по колоде изнутри слайдов: карта решений и оглавление прыгают к слайду по id.
export const DeckContext = createContext({ goTo: () => {} });
export const useDeck = () => useContext(DeckContext);
