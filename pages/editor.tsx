import React from 'react';
import { NextPage } from 'next';
import Tools from '../components/editor/Tools';
import Workspace from '../components/editor/Workspace';

type EditorProps = {};

const Editor: NextPage<EditorProps> = () => (
  <div className="Editor">
    <aside className="tools-wrapper">
      <Tools>
      </Tools>
    </aside>

    <section className="circuitry-design">
      <Workspace>
      </Workspace>
    </section>

    <style jsx>{`
      div.Editor {
        font-size: 0;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      div.Editor > aside.tools-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: auto;
        height: auto;
        max-height: 100vh;
        background-color: transparent;
        color: white;
        display: inline-block;
        vertical-align: top;
      }

      div.Editor > section.circuitry-design {
        width: 100vw;
        height: 100vh;
        display: inline-block;
        vertical-align: top;
      }
    `}</style>
  </div>
);

export default Editor;
