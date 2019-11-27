import React, { Fragment } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

type HomePageProps = {};

const Home: NextPage<HomePageProps> = () => (
  <Fragment>
    <div className="home">
      <h1 className="title">Thévenin</h1>
      <p className="site-description">An Elegant Circuitry Simulation Website created by <a id="author-link" target="_blank" href="https://svartalvhe.im/maxwell-alexius">Maxwell Alexius</a>.</p>

      <div className="link-group">
        <Link href="/editor">
          <button className="default">Create Circuit Simulation (WIP)</button>
        </Link>

        <Link href="#">
          <button className="default" disabled>Library Documentation (Coming Soon)</button>
        </Link>

        <a className="default" href="https://github.com/Maxwell-Alexius/Svartalvheim" target="_blank">
          <img id="github-logo" src="/static/logo/github.png" alt="GitHub" /> GitHub
        </a>
      </div>
    </div>

    <style jsx>{`
      div.home {
        padding-top: 20vh;
        padding-left: 24pt;
      }
      div.home > h1.title {
        height: 48pt;
        line-height: 48pt;
        font-size: 72pt;
        font-weight: lighter;
      }

      div.home > p.site-description {
        font-size: 12pt;
        padding: 24pt 0 24pt 12pt;
      }

      div.home > div.link-group > button {
        margin-right: 12pt;
      }

      a#author-link {
        font-size: 12pt;
        text-decoration: underline;
      }
      a#author-link:hover {
        color: #777;
      }

      img#github-logo {
        display: inline-block;
        vertical-align: middle;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: white;
        padding: 1pt;
        margin-right: 3pt;
      }
    `}</style>
  </Fragment>
);

export default Home;
