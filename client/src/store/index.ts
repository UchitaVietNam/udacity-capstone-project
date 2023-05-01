import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './root-saga'
import userReducer from './userReducer'
import persistStore from 'redux-persist/es/persistStore'

const rootReducers = combineReducers({
  userInfo: userReducer
})

const sagaMiddleware = createSagaMiddleware()
export const store = createStore(rootReducers, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

export const persistor = persistStore(store)
