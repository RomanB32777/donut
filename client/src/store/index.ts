import createSagaMiddleware from "redux-saga";
import {applyMiddleware, createStore} from "redux";
import { rootWatcher } from "../saga";

import {rootReducer} from './reducers';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootWatcher)

export default store;