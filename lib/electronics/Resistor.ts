import { Node, Edge, PinInfo, CurrentFlow } from "../Circuit.Graph";

function deriveCurrent(edge: Edge): boolean {
  const node1 = edge.nodesMap.get('1') as Node;
  const node2 = edge.nodesMap.get('2') as Node;

  if (Number.isNaN(node1.voltage) && Number.isNaN(node2.voltage)) {
    return false;
  }

  const pinInfo1 = edge.pinsMap.get('1') as PinInfo;
  const pinInfo2 = edge.pinsMap.get('2') as PinInfo;

  const emf1 = node1.voltage + pinInfo1.bias;
  const emf2 = node2.voltage + pinInfo2.bias;

  edge.current = (emf1 - emf2) / edge.electronic.value;

  if (edge.current > 0) {
    pinInfo1.currentFlow = CurrentFlow.INWARD;
    pinInfo2.currentFlow = CurrentFlow.OUTWARD;
  } else if (edge.current < 0) {
    pinInfo1.currentFlow = CurrentFlow.OUTWARD;
    pinInfo2.currentFlow = CurrentFlow.INWARD;
  }

  return true;
};

export const Resistor = {
  deriveCurrent,
};
