import { createStore } from "redux";

const initialState = {
  benefits: [],
  eligibilityPaths: [],
  examples: [],
  favouriteBenefits: [],
  needs: [],
  selectedNeeds: {},
  patronType: "",
  serviceType: "",
  statusAndVitals: "",
  text: [],
  areaOffices: []
};

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_DATA":
      return Object.assign({}, state, {
        storeHydrated: action.data.storeHydrated || state.storeHydrated,
        benefits: action.data.benefits || state.benefits,
        eligibilityPaths:
          action.data.eligibilityPaths || state.eligibilityPaths,
        needs: action.data.needs || state.needs,
        examples: action.data.examples || state.examples,
        favouriteBenefits:
          action.data.favouriteBenefits || state.favouriteBenefits,
        text: action.data.text || state.text,
        areaOffices: action.data.areaOffices || state.areaOffices
      });
    case "SET_PATRON_TYPE":
      return Object.assign({}, state, {
        patronType: action.data
      });
    case "SET_SELECTED_NEEDS":
      return Object.assign({}, state, {
        selectedNeeds: action.data
      });
    case "SET_SERVICE_TYPE":
      return Object.assign({}, state, {
        serviceType: action.data
      });
    case "SET_STATUS_TYPE":
      return Object.assign({}, state, {
        statusAndVitals: action.data
      });
    default:
      return state;
  }
};

export const initStore = (state = initialState) => {
  return createStore(reducer, state);
};
