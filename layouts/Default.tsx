import React, { ReactNode, Fragment } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import './Default.scss';

type LayoutProps = { children: ReactNode };

const Layout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <Fragment>
      <Head>
        <title>Conductor - Circuitry Simulation</title>
        <link href="https://fonts.googleapis.com/css?family=Work+Sans:300,700&display=swap" rel="stylesheet"></link>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { children }
    </Fragment>
  );
};

export default Layout;
