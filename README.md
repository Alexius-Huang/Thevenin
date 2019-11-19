# Conductor - Circuitry Simulation Website

[![Build Status](https://travis-ci.com/Maxwell-Alexius/Conductor.svg?branch=master)](https://travis-ci.com/Maxwell-Alexius/Conductor) [![Coverage Status](https://coveralls.io/repos/github/Maxwell-Alexius/Conductor/badge.svg?branch=master)](https://coveralls.io/github/Maxwell-Alexius/Conductor?branch=master)

**Currently Under Development**

Using TypeScript and working on several parts:

- Main Circuit Library:
  - `Circuit`: Main wrapper for the circuit simulation
  - `Circuit.Unit`: Circuit grid system represented by circuit-unit to place different components or wire
  - `Circuit.Graph`: The graph data structure to represent the circuit (converted from grid of `Circuit.Unit`) **[WIP]**
  - `Circuit.Electronic`: Electronic component class
  - `Circuit.Electronic.Unit`: Electronic component unit mapping with respect to the grid circuit unit

- Using Jest test framework to write Unit/Integration tests

**[Will Implement After Completing the Circuit Library]**:
- Frontend UI: Using Next.JS framework, Redux (with TypeScript) 
  - Details will be planned on the future...
