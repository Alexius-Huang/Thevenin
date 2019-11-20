# Thévenin

An elegant circuitry simulation website.

[![Build Status](https://travis-ci.com/Maxwell-Alexius/Conductor.svg?branch=master)](https://travis-ci.com/Maxwell-Alexius/Conductor) [![Coverage Status](https://coveralls.io/repos/github/Maxwell-Alexius/Conductor/badge.svg?branch=master)](https://coveralls.io/github/Maxwell-Alexius/Conductor?branch=master)

Overall Status: **Under Development**

## Details
Using TypeScript and working on several parts:

- Main Circuit Library:
  - `Circuit`: Main wrapper for the circuit simulation
  - `Circuit.Unit`: Circuit grid system represented by circuit-unit to place different components or wire
  - `Circuit.Electronic`: Electronic component class
  - `Circuit.Electronic.Unit`: Electronic component unit mapping with respect to the grid circuit unit
  - `Circuit.Graph`: The graph data structure to represent the circuit (converted from grid of `Circuit.Unit`)
  - `Circuit.Simulation`: The circuit **simulation** algorithm part using [Nodal Voltage Analysis](https://www.wikiwand.com/en/Nodal_analysis) which consists of several phases including:
    - Supernode Propagation - Propagates through the circuit graph generated from `Circuit.Graph` and convert voltage source related `Circuit.Graph.Node` into a single super node with different biased voltage
    - Node-Voltage Matrix Derivation - Deriving the node voltage matrix to solve for each components' (represented by `Circuit.Graph.Edge`) current values (based on [KCL from Kirchhoff's Circuit Law](https://www.wikiwand.com/en/Kirchhoff%27s_circuit_laws)) **[WIP]**
    - Ending Phase - After deriving the current of the loads such resistors, scanning through the circuit and derive rest of the node-voltage and other underived component's current according to KVL and KCL **[Planning]**

- Using Jest test framework to write Unit/Integration tests

**[Will Implement After Completing the Circuit Library]**:
- Frontend UI: Using Next.JS framework, Redux (with TypeScript) 
  - Details will be planned on the future...

## Maintainer
[Maxwell Alexius](https://svartalvhe.im/maxwell-alexius)
