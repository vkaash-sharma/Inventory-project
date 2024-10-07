const initialState = {
  skills: "",
  locations: "",
  interests: "",
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SKILLS":
      return {
        ...state,
        skills: action.data,
      };
    case "SET_LOCATIONS":
      return {
        ...state,
        locations: action.data,
      };
    case "SET_INTERESTS":
      return {
        ...state,
        interests: action.data,
      };
    default:
      return state;
  }
};

export default filterReducer;
