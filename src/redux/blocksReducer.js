const initialState = {
  blocks: [],
};

function blocksReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_BLOCK":
      return {
        ...state,
        blocks: [...state.blocks, action.payload],
      };
    case "REMOVE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.filter((_, index) => index !== action.payload),
      };
    case "EDIT_BLOCK":
      return {
        ...state,
        blocks: state.blocks.map((block, index) =>
          index === action.payload.index
            ? { ...block, content: action.payload.content }
            : block
        ),
      };
    case "UPDATE_IMAGE":
      return {
        ...state,
        blocks: state.blocks.map((block, index) =>
          index === action.payload.index
            ? { ...block, imageContent: action.payload.imageContent }
            : block
        ),
      };
      case "UPDATE_BLOCKS_ORDER":
        return {
          ...state,
          blocks: action.payload,
        };
    default:
      return state;
  }
}

export default blocksReducer;
