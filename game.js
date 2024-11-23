class Maze {
   constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.grid = [];
      this.stack = [];
   }

   setup() {
      this.grid = [];
      for (let r = 0; r < this.rows; r++) {
         let rows = [];
         for (let c = 0; c < this.cols; c++) {
            let cell = new Cell(r, c, this.grid);
            rows.push(cell);
         }
         this.grid.push(rows);
      }
      this.current = this.grid[0][0];
   }

   generate() {
      this.setup();
      // Fully generate the maze
      while (this.stack.length > 0 || !this.current.isFullyVisited()) {
         this.current.visited = true;
         let next = this.current.checkNeighbours();
         
         if (next) {
            next.visited = true;
            this.stack.push(this.current);
            this.current.removeWall(this.current, next);
            this.current = next;
         } else if (this.stack.length > 0) {
            this.current = this.stack.pop();
         }
      }
      return this.getMazeData();
   }

   getMazeData() {
      let mazeData = [];
      for (let r = 0; r < this.rows; r++) {
         let row = [];
         for (let c = 0; c < this.cols; c++) {
            row.push({
               x: c,
               y: r,
               walls: this.grid[r][c].walls
            });
         }
         mazeData.push(row);
      }
      return mazeData;
   }
}

class Cell {
   constructor(rowNum, colNum, parentGrid) {
      this.rowNum = rowNum;
      this.colNum = colNum;
      this.parentGrid = parentGrid;
      this.visited = false;
      this.walls = {
         topWall: true,
         rightWall: true,
         bottomWall: true,
         leftWall: true,
      };
   }

   isFullyVisited() {
      let grid = this.parentGrid;
      let row = this.rowNum;
      let col = this.colNum;

      let neighbours = [
         row !== 0 ? grid[row-1][col] : null,
         row !== grid.length - 1 ? grid[row+1][col] : null,
         col !== 0 ? grid[row][col-1] : null,
         col !== grid.length - 1 ? grid[row][col+1] : null
      ];

      return neighbours.every(neighbor => 
         neighbor === null || neighbor.visited
      );
   }

   checkNeighbours() {
      let grid = this.parentGrid;
      let row = this.rowNum;
      let col = this.colNum;
      let neighbours = [];

      let top = row !== 0 ? grid[row-1][col] : undefined;
      let bottom = row !== grid.length - 1 ? grid[row+1][col] : undefined;
      let left = col !== 0 ? grid[row][col-1] : undefined;
      let right = col !== grid.length - 1 ? grid[row][col+1] : undefined;

      if (top && !top.visited) neighbours.push(top);
      if (bottom && !bottom.visited) neighbours.push(bottom);
      if (left && !left.visited) neighbours.push(left);
      if (right && !right.visited) neighbours.push(right);

      if (neighbours.length) {
         let random = Math.floor(Math.random() * neighbours.length);
         return neighbours[random];
      } else {
         return undefined;
      }
   }

   removeWall(cell1, cell2) {
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
}

// Usage
let mazeGenerator = new Maze(15, 15);
let mazeData = mazeGenerator.generate(); // Returns maze metadata for Phaser

