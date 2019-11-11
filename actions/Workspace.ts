import actionCreatorFactory from 'typescript-fsa';

const createAction = actionCreatorFactory();

export const setSize = createAction<{
  height: number;
  width: number;
}>('SET_SIZE');
