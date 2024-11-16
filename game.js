let maze = document.getElementById("gameCanvas");
let ctx = maze.getContext("2d");
let horWall = new Image();
horWall.src = "horWall.png";

let vertWall = new Image();
vertWall.src = "vertWall.png";

let floor = new Image();
floor.src = "floor.png";

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.walls = [];
    this.exit = null;
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    // Randomly choose left or right boundary
    const isLeftBoundary = Math.random() < 0.5;
    const randomRow = Math.floor(Math.random() * this.rows);
    
    if (isLeftBoundary) {
      this.exit = this.grid[randomRow][0];  // Left boundary
      this.exit.walls.leftWall = false;     // Remove left wall for exit
    } else {
      this.exit = this.grid[randomRow][this.columns - 1];  // Right boundary
      this.exit.walls.rightWall = false;    // Remove right wall for exit
    }
    
    console.log("Exit position:", 
                "Row:", this.exit.rowNum, 
                "Column:", this.exit.colNum, 
                "Side:", isLeftBoundary ? "Left" : "Right");
  }

  generateMaze() {
    // Set up the canvas size
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";

    // Start with a random cell
    let startCell = this.grid[0][0];
    startCell.visited = true;
    
    // Add neighboring walls to the wall list
    this.addWalls(startCell);

    // Main loop to generate the maze using Prim's algorithm
    while (this.walls.length > 0) {
      // Randomly select a wall from the list
      let randomIndex = Math.floor(Math.random() * this.walls.length);
      let wall = this.walls[randomIndex];

      // Check if this wall can be removed
      let [cell1, cell2] = wall;
      if (cell1.visited !== cell2.visited) {
        // Remove the wall and mark the new cell as visited
        cell1.removeWalls(cell1, cell2);
        if (!cell1.visited) {
          cell1.visited = true;
          this.addWalls(cell1);
        } else if (!cell2.visited) {
          cell2.visited = true;
          this.addWalls(cell2);
        }
      }

      // Remove the wall from the list
      this.walls.splice(randomIndex, 1);
    }

    // Draw the completed maze
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].show(this.size, this.rows, this.columns, this.exit);
      }
    }
  }

  addWalls(cell) {
    let row = cell.rowNum;
    let col = cell.colNum;
    let neighbors = [];

    let top = row > 0 ? this.grid[row - 1][col] : undefined;
    let right = col < this.columns - 1 ? this.grid[row][col + 1] : undefined;
    let bottom = row < this.rows - 1 ? this.grid[row + 1][col] : undefined;
    let left = col > 0 ? this.grid[row][col - 1] : undefined;

    if (top && !top.visited) neighbors.push([cell, top]);
    if (right && !right.visited) neighbors.push([cell, right]);
    if (bottom && !bottom.visited) neighbors.push([cell, bottom]);
    if (left && !left.visited) neighbors.push([cell, left]);

    for (let neighbor of neighbors) {
      this.walls.push(neighbor);
    }
  }
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
  }

  removeWalls(cell1, cell2) {
    let x = cell1.colNum - cell2.colNum;

    if (x === 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x === -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }

    let y = cell1.rowNum - cell2.rowNum;

    if (y === 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y === -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  show(size, rows, columns, exit) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    let cellWidth = size / columns;
    let cellHeight = size / rows;
    let wallThickness = 10;

    // Draw the floor first
    ctx.drawImage(floor, x, y, cellWidth, cellHeight);

    // Check if this cell is the exit and mark it
    if (this === exit) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
      ctx.fillRect(x + wallThickness, y + wallThickness, 
                  cellWidth - 2 * wallThickness, 
                  cellHeight - 2 * wallThickness);
    }

    // Draw the walls
    if (this.walls.topWall) {
      ctx.drawImage(horWall, x, y - wallThickness / 2, cellWidth, 34);
    }

    if (this.walls.bottomWall) {
      ctx.drawImage(horWall, x, y + cellHeight - wallThickness / 2, cellWidth, 34);
    }

    if (this.walls.rightWall) {
      ctx.drawImage(vertWall, x + cellWidth - 10, y, 10, cellHeight);
    }

    if (this.walls.leftWall) {
      ctx.drawImage(vertWall, x, y, 10, cellHeight);
    }
  }
}

// Instantiate and generate the maze without animation
let imagesLoaded = 0;
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 3) {
    // Only generate the maze after all images are loaded
    let newMaze = new Maze(1000, 15, 15);
    newMaze.setup();
    newMaze.generateMaze();
  }
}

horWall.onload = imageLoaded;
vertWall.onload = imageLoaded;
floor.onload = imageLoaded;