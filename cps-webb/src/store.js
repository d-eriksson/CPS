import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import {loadState} from './utils/localStorage';

export default function configureStore() {
    const persistedState = loadState();
    return createStore(
        rootReducer,
        persistedState,
        applyMiddleware(thunk)
    );
}