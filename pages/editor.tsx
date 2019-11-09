import React from 'react';
import { NextPage } from 'next';
import Layout from '../components/Layout';

type EditorProps = {};

const Editor: NextPage<EditorProps> = () => (
  <Layout>
    <div className="Editor">
      <aside className="tools">
        <div className="title-wrapper">
          <h1>Tools</h1>
        </div>
      </aside>

      <section className="circuitry-design">
        Design...
      </section>

      <style jsx>{`
        div.Editor {
          font-size: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        div.Editor > aside.tools {
          width: 30vw;
          height: 100vh;
          background-color: #222;
          color: white;
          display: inline-block;
        }

        aside.tools > div.title-wrapper > h1 {
          padding: 8pt 12pt;
          font-size: 12pt;
          color: white;
        }

        div.Editor > section.circuitry-design {
          width: 70vw;
          height: 100vh;
          display: inline-block;
        }
      `}</style>
    </div>
  </Layout>
);

export default Editor;
