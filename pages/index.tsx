import React, { Fragment } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

type HomePageProps = {};

const Home: NextPage<HomePageProps> = () => (
  <Fragment>
    <div className="home">
      <h1 className="title"><span className="main">Thévenin</span> - Circuitry Simulation</h1>

      <Link href="/editor">
        <button className="default">New Circuit Simulation</button>
      </Link>
    </div>

    <style jsx>{`
      div.home {
        padding-top: 20vh;
        padding-left: 24pt;
      }
      div.home > h1.title {
        height: 48pt;
        line-height: 48pt;
      }
    `}</style>
  </Fragment>
);

export default Home;
