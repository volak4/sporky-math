import { isInsideMountain } from '../engine/wall.js';

// Level configuration and educational data
export const levels = [
  {
    id: 1,
    title: "Find the Coordinates",
    description: "Drag Sporky to the target peg at <span class='highlight-coord' id='target-coord-display'>(3, 2)</span>.",
    instructionText: "Tap and drag slowly directly on the wall.",
    startPos: { x: 0, y: 0 },
    targetPos: { x: 3, y: 2 },
    showGridLines: false, // In Level 1 we hide gridlines, they count pegs from origin
    setupHolds: function(scene, createHold) {
      // Create a grid of standard pegs (grey) for climbing, but only if they are on the mountain rock face
      const target = this.targetPos || { x: 3, y: 2 };
      for (let x = -4; x <= 4; x++) {
        for (let y = -4; y <= 4; y++) {
          if (!isInsideMountain(x, y)) continue;

          const isTarget = x === target.x && y === target.y;
          const isOnAxis = x === 0 || y === 0;
          const color = isOnAxis ? '#64748b' : '#cbd5e1';
          createHold(scene, x, y, 'block', color, isTarget);
        }
      }
    },
    validate: function(climberPos) {
      const target = this.targetPos || { x: 3, y: 2 };
      return Math.round(climberPos.x) === target.x && Math.round(climberPos.y) === target.y;
    }
  },
  {
    id: 2,
    title: "The Easiest Path (Slope)",
    description: "Drag Sporky directly on the wall to the correct destination peg using the given slope.",
    instructionText: "Drag Sporky, then click Submit Position.",
    startPos: { x: -2, y: -2 },
    targetSlope: { rise: 3, run: 4 },
    showGridLines: true, // Grid lines help see Rise and Run spacing
    setupHolds: function(scene, createHold) {
      const start = this.startPos || { x: -2, y: -2 };
      for (let x = -4; x <= 4; x++) {
        for (let y = -4; y <= 4; y++) {
          if (!isInsideMountain(x, y)) continue;

          const isStart = x === start.x && y === start.y;
          const isOnAxis = x === 0 || y === 0;
          const defaultColor = isOnAxis ? '#64748b' : '#cbd5e1';
          const color = isStart ? '#10b981' : defaultColor;
          
          createHold(scene, x, y, 'block', color, false);
        }
      }
    },
    validate: function(climberPos) {
      const expectedX = this.startPos.x + this.targetSlope.run;
      const expectedY = this.startPos.y + this.targetSlope.rise;
      return Math.round(climberPos.x) === expectedX && Math.round(climberPos.y) === expectedY;
    }
  },
  {
    id: 3,
    title: "Calculate the Slope",
    description: "Drag Sporky directly to the red peg, then calculate and type the slope (Rise and Run).",
    instructionText: "Drag Sporky, then type the slope and click Submit Slope.",
    startPos: { x: -3, y: -2 },
    targetPos: { x: 1, y: 2 },
    showGridLines: true, // Grid lines help see Rise and Run spacing
    setupHolds: function(scene, createHold) {
      const start = this.startPos || { x: -3, y: -2 };
      const stop = this.targetPos || { x: 1, y: 2 };
      for (let x = -4; x <= 4; x++) {
        for (let y = -4; y <= 4; y++) {
          if (!isInsideMountain(x, y)) continue;

          const isStart = x === start.x && y === start.y;
          const isStop = x === stop.x && y === stop.y;
          const isOnAxis = x === 0 || y === 0;
          const defaultColor = isOnAxis ? '#64748b' : '#cbd5e1';
          
          let color = defaultColor;
          if (isStart) color = '#10b981'; // Green start
          else if (isStop) color = '#ef4444'; // Red stop/target
          
          createHold(scene, x, y, 'block', color, isStop);
        }
      }
    },
    validate: function(rise, run, climberPos) {
      const expectedX = this.targetPos.x;
      const expectedY = this.targetPos.y;
      const climberAtStop = Math.round(climberPos.x) === expectedX && Math.round(climberPos.y) === expectedY;
      if (!climberAtStop) return { success: false, reason: "position" };

      const actualRise = this.targetPos.y - this.startPos.y;
      const actualRun = this.targetPos.x - this.startPos.x;

      if (run === 0) return { success: false, reason: "slope" };

      const slopeMatches = (actualRise * run) === (actualRun * rise);
      if (!slopeMatches) return { success: false, reason: "slope" };

      return { success: true };
    }
  },
  {
    id: 4,
    title: "Plotting the Equation",
    description: "We've given you the equation y = mx + b. Find the y-intercept first, place a peg, and then follow the slope to place the second peg!",
    instructionText: "Drag Sporky to the y-intercept, click Place Peg. Then drag along the slope to the next point and click Place Peg again.",
    startPos: { x: 4, y: 4 },
    targetPos: { x: 0, y: 0 },
    showGridLines: true,
    setupHolds: function(scene, createHold) {
      const start = this.startPos || { x: 4, y: 4 };
      for (let x = -4; x <= 4; x++) {
        for (let y = -4; y <= 4; y++) {
          if (!isInsideMountain(x, y)) continue;
          
          const isStart = x === start.x && y === start.y;
          const isOnAxis = x === 0 || y === 0;
          const defaultColor = isOnAxis ? '#64748b' : '#cbd5e1';
          const color = isStart ? '#10b981' : defaultColor;

          createHold(scene, x, y, 'block', color, false);
        }
      }
    },
    validate: function() {
      return true;
    }
  },
  {
    id: 5,
    title: "Route Setter (y = mx + b)",
    description: "Adjust the slope (m) and y-intercept (b) to align the laser route so it passes through all yellow target holds!",
    instructionText: "Use the sliders to shift (b) and tilt (m) the equation line. Click 'Test Route!' when ready.",
    startPos: { x: -4, y: -1 },
    showGridLines: true,
    targetEquation: { m: 0.5, b: 1 },
    generatedTargets: [
      { x: -2, y: 0 },
      { x: 0, y: 1 },
      { x: 2, y: 2 },
      { x: 4, y: 3 }
    ],
    generatedDecoys: [
      { x: -3, y: 2 },
      { x: -1, y: -2 },
      { x: 1, y: 3 },
      { x: 3, y: -1 }
    ],
    setupHolds: function(scene, createHold) {
      const targets = this.generatedTargets || [
        { x: -2, y: 0 },
        { x: 0, y: 1 },
        { x: 2, y: 2 },
        { x: 4, y: 3 }
      ];
      const decoys = this.generatedDecoys || [
        { x: -3, y: 2 },
        { x: -1, y: -2 },
        { x: 1, y: 3 },
        { x: 3, y: -1 }
      ];
      const start = this.startPos || { x: -4, y: -1 };

      // Start hold
      if (isInsideMountain(start.x, start.y)) {
        createHold(scene, start.x, start.y, 'block', '#10b981');
      }

      // Target holds (excluding the start position)
      targets.forEach(t => {
        if (t.x === start.x && t.y === start.y) return;
        if (isInsideMountain(t.x, t.y)) {
          createHold(scene, t.x, t.y, 'star', '#f59e0b', true);
        }
      });

      // Decoy holds
      decoys.forEach(d => {
        if (isInsideMountain(d.x, d.y)) {
          createHold(scene, d.x, d.y, 'crimp', '#475569');
        }
      });
    },
    validate: function(m, b) {
      const target = this.targetEquation || { m: 0.5, b: 1 };
      return Math.abs(m - target.m) < 0.01 && Math.abs(b - target.b) < 0.01;
    }
  },
  {
    id: 6,
    title: "Real-World Equations",
    description: "Read the word problem, write the linear equation y = mx + b representing the scenario, and then test the route!",
    instructionText: "Translate the problem into slope (m) and intercept (b). Click 'Test Route!' when ready.",
    startPos: { x: -4, y: -1 },
    showGridLines: true,
    targetEquation: { m: 0.5, b: 1 },
    generatedTargets: [],
    generatedDecoys: [],
    setupHolds: function(scene, createHold) {
      const targets = this.generatedTargets || [];
      const decoys = this.generatedDecoys || [];
      const start = this.startPos || { x: -4, y: -1 };

      // Place start peg (first one on the line)
      if (isInsideMountain(start.x, start.y)) {
        createHold(scene, start.x, start.y, 'block', '#10b981');
      }

      // Place target star pegs
      targets.forEach(t => {
        if (t.x === start.x && t.y === start.y) return;
        if (isInsideMountain(t.x, t.y)) {
          createHold(scene, t.x, t.y, 'star', '#f59e0b', true);
        }
      });

      // Place decoy crimp pegs
      decoys.forEach(d => {
        if (isInsideMountain(d.x, d.y)) {
          createHold(scene, d.x, d.y, 'crimp', '#475569');
        }
      });
    },
    validate: function(m, b) {
      const target = this.targetEquation || { m: 0.5, b: 1 };
      return Math.abs(m - target.m) < 0.01 && Math.abs(b - target.b) < 0.01;
    }
  }
];

export function generateRealWorldProblem() {
  const problems = [
    {
      template: (m, b) => `Sporky starts climbing at an elevation of <strong>${b} meters</strong>. He climbs upwards at a constant rate of <strong>${m} meters per minute</strong>. Write the equation for Sporky's height (y) after x minutes.`,
      validM: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
      validB: [-3, -2, -1, 0, 1, 2, 3]
    },
    {
      template: (m, b) => `A water reservoir starts with <strong>${b} thousand gallons</strong> of water. It drains at a rate of <strong>${Math.abs(m)} thousand gallons per hour</strong>. Write the equation for the water volume (y) after x hours.`,
      validM: [-0.25, -0.5, -0.75, -1.0, -1.25, -1.5, -2.0],
      validB: [1, 2, 3, 4]
    },
    {
      template: (m, b) => `Sporky starts a savings account with <strong>$${b}</strong>. Every week, he saves a constant allowance of <strong>$${m}</strong>. Write the equation for Sporky's total savings (y) after x weeks.`,
      validM: [0.5, 1.0, 1.5, 2.0],
      validB: [-2, -1, 0, 1, 2, 3]
    },
    {
      template: (m, b) => `The temperature starts at <strong>${b} degrees</strong> and drops by <strong>${Math.abs(m)} degrees per hour</strong>. Write the equation for the temperature (y) after x hours.`,
      validM: [-0.5, -1.0, -1.5, -2.0],
      validB: [2, 3, 4]
    },
    {
      template: (m, b) => `To join the Alpine Gym, Sporky pays a sign-up fee of <strong>$${b}</strong> and then <strong>$${m} per climb</strong>. Write the equation for the total cost (y) after x climbs.`,
      validM: [0.5, 1.0, 1.5, 2.0],
      validB: [-2, -1, 0, 1, 2, 3]
    }
  ];

  const problem = problems[Math.floor(Math.random() * problems.length)];
  const m = problem.validM[Math.floor(Math.random() * problem.validM.length)];
  const b = problem.validB[Math.floor(Math.random() * problem.validB.length)];
  
  const text = problem.template(m, b);
  return { m, b, text };
}
