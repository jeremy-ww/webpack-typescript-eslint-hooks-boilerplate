export const initialState = { user: 'useHooks' }

export enum Type {
  SET_USER
}

export function reducer(
  state: typeof initialState,
  action: { type: Type; payload: typeof initialState }
) {
  switch (action.type) {
    case Type['SET_USER']:
      return { user: action.payload.user }
  }
}
