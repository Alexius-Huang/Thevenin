import React, { ReactNode, Fragment } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';

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

      <style jsx global>{`
        body {
          font-family: 'Work sans', sans-serif;
          margin: 0;
          padding: 0;
          font-size: 12pt;
          color: #333;
        }

        h1, h2, h3, h4, h5, h6, p {
          padding: 0;
          margin: 0;
        }

        button {
          border: 1pt solid #333;
          padding: 0;
          margin: 0;
          font-family: 'Work sans', sans-serif;
          font-size: 10pt;
          letter-spacing: .2pt;
        }

        button.default {
          height: 24pt;
          line-height: 24pt;
          display: inline-block;
          box-sizing: border-box;
          padding: 0 6pt;
          transition: .25s;
          border-radius: 2pt;
        }

        button.default:hover {
          transition: .25s;
          color: white;
          background-color: #333;
        }
      `}</style>
    </Fragment>
  );
};

export default Layout;
