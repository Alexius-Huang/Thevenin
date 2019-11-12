import React, { FC } from 'react';
import { connect } from 'react-redux';
import { IdealWireProps } from './Circuit.IdealWire.d';
import { WorkspaceStoreState } from '../reducers/State';
import './Circuit.IdealWire.scss';

const IdealWire: FC<IdealWireProps> = ({ terminals, unitSize }) => {
  const pathDirectives = 'M ' + terminals
    .map(([x, y]) => `${(x - .5) * unitSize} ${(y - .5) * unitSize}`)
    .join(' L ');

  return (
    <path d={pathDirectives} className="ideal-wire" />
  );
};

function mapStateToProps({ Workspace: w }: { Workspace: WorkspaceStoreState }) {
  return { unitSize: w.unitSize };
}

export default connect(mapStateToProps)(IdealWire);
