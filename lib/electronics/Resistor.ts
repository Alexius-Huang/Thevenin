import { Node, Edge, PinInfoMap, PinInfo, CurrentFlow } from "../Circuit.Graph";

function deriveCurrent(
  edge: Edge,
  nodes: { '1': Node, '2': Node },
) {
  const { '1': node1, '2': node2 } = nodes;

  const pinInfoMap1 = node1.edgeMap.get(edge.id) as PinInfoMap;
  const pinInfo1 = pinInfoMap1.get('1') as PinInfo;
  const bias1 = pinInfo1.bias;
  const emf1 = node1.voltage + bias1;

  const pinInfoMap2 = node2.edgeMap.get(edge.id) as PinInfoMap;
  const pinInfo2 = pinInfoMap2.get('2') as PinInfo;
  const bias2 = pinInfo2.bias;
  const emf2 = node2.voltage + bias2;

  edge.current = (emf1 - emf2) / edge.electronic.value;

  if (edge.current > 0) {
    pinInfo1.currentFlow = CurrentFlow.INWARD;
    pinInfo2.currentFlow = CurrentFlow.OUTWARD;
  } else if (edge.current < 0) {
    pinInfo1.currentFlow = CurrentFlow.OUTWARD;
    pinInfo2.currentFlow = CurrentFlow.INWARD;
  }
};

export const Resistor = {
  deriveCurrent,
};
