Here's a JavaScript code snippet that generates a maze using the Recursive Backtracking algorithm:

Filename: maze_generator.js

```javascript
// Maze Generator using Recursive Backtracking
// Generates a random maze using the Recursive Backtracking algorithm

// Helper function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Maze class
class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = new Array(height);
    this.visited = new Array(height);

    for (let i = 0; i < height; i++) {
      this.grid[i] = new Array(width).fill(true);
      this.visited[i] = new Array(width).fill(false);
    }
  }

  generate() {
    const stack = [];
    let currentX = Math.floor(Math.random() * this.width);
    let currentY = Math.floor(Math.random() * this.height);

    this.grid[currentY][currentX] = false;
    this.visited[currentY][currentX] = true;

    stack.push([currentY, currentX]);

    while (stack.length > 0) {
      const neighbors = [
        [currentY - 2, currentX],
        [currentY, currentX + 2],
        [currentY + 2, currentX],
        [currentY, currentX - 2],
      ];

      shuffleArray(neighbors);

      let found = false;

      for (let i = 0; i < neighbors.length; i++) {
        const [nextY, nextX] = neighbors[i];

        if (
          nextX >= 0 &&
          nextX < this.width &&
          nextY >= 0 &&
          nextY < this.height &&
          !this.visited[nextY][nextX]
        ) {
          this.grid[nextY][nextX] = false;
          this.grid[Math.floor((currentY + nextY) / 2)][Math.floor((currentX + nextX) / 2)] = false;
          this.visited[nextY][nextX] = true;

          stack.push([nextY, nextX]);
          found = true;
          break;
        }
      }

      if (!found) {
        [currentY, currentX] = stack.pop();
      } else {
        [currentY, currentX] = [neighbors[0][0], neighbors[0][1]];
      }
    }

    // Display the maze
    for (let i = 0; i < this.height; i++) {
      let line = '';
      for (let j = 0; j < this.width; j++) {
        line += this.grid[i][j] ? '██' : '  ';
      }
      console.log(line);
    }
  }
}

// Create a maze object and generate a maze
const maze = new Maze(21, 21);
maze.generate();
```

This code creates a Maze class that uses the Recursive Backtracking algorithm to generate a random maze. The maze is displayed using the console.log statement at the end. The width and height of the maze can be adjusted by modifying the constructor parameter values.