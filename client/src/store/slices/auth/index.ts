import { authAtions, authReducer } from './slice';
import { getUser, getError, getIsAuth, getStatus } from './selectors';
import { loginThunk } from './thunks';

export { authAtions, authReducer, getUser, getError, getIsAuth, getStatus, loginThunk };
