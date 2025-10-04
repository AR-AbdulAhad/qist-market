export const initialState = {
  price: [0, 100],
  subcategories: [],
  filtered: [],
  sortingOption: "Latest Product",
  sorted: [],
  currentPage: 1,
  itemPerPage: 10,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_SUBCATEGORIES":
      return { ...state, subcategories: action.payload };
    case "SET_FILTERED":
      return { ...state, filtered: action.payload };
    case "SET_SORTING_OPTION":
      return { ...state, sortingOption: action.payload };
    case "SET_SORTED":
      return { ...state, sorted: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ITEM_PER_PAGE":
      return { ...state, itemPerPage: action.payload };
    case "CLEAR_FILTER":
      return {
        ...state,
        price: [0, 100],
        subcategories: [],
        sortingOption: "Latest Product",
        currentPage: 1,
      };
    default:
      return state;
  }
};