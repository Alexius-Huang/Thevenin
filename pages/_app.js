// pages/_app.js
import React from 'react';
import App from 'next/app';

import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import RootReducer from '../reducers';
import RootSaga from '../sagas';

import Layout from '../layouts/Default';
import logger from 'redux-logger';

/**
* @param {object} initialState
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR 
*/


const makeStore = (/* options */) => {
  const middlewares = [];

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
  }

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const store = createStore(RootReducer, applyMiddleware(...middlewares));

  sagaMiddleware.run(RootSaga);

  return store;
};

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    // we can dispatch from here too
    // ctx.store.dispatch({ type: 'FOO', payload: 'foo' });

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(MyApp);