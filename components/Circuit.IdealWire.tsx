import React, { FC } from 'react';
import './Circuit.IdealWire.scss';

type Coordinate = [number, number];

type IdealWireProps = {
  terminals: [Coordinate, Coordinate];
  unitSize: number;
};

const IdealWire: FC<IdealWireProps> = ({ terminals, unitSize }) => {
  const pathDirectives = 'M ' + terminals
    .map(([x, y]) => `${(x - .5) * unitSize} ${(y - .5) * unitSize}`)
    .join(' L ');

  return (
    <path d={pathDirectives} className="ideal-wire" />
  );
};

export default IdealWire;
