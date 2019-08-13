var assert = require('assert');
var cmd = require('node-cmd');
var config = require('../config.json');

/**
 * Callback equivalent to that of node-cmd
 * @callback nodeCmdCallback
 * @param {Error} err 
 * @param {string} data
 * @param {string} stdErr
 */

/**
 * Retrieve Marble Quantity Callback
 * @callback awaitQuantityCallback
 * @param {Error}  err 
 * @param {number} quantity null if marble is not defined in inventory
 * @param {number} cost     null if marble is not defined in inventory
 */

/**
* Creates a Marble with an initial quantity
* @param {string}           color        color of Marble to create
* @param {number}           [quantity=1] quantity of Marbles to initially create
* @param {number}           [cost=1]     cost of Marble to initially create
* @param {nodeCmdCallback}  [callback]   function to call after completion, callback(err, data, stderr)
*/
function createMarble(color, quantity=1, cost=1, callback) {
  cmd.get(
    'zowe console issue command "F ' + config.cicsRegion + ',' + config.cicsTran + ' CRE ' + color + " " + quantity + " " + cost + '" --cn ' + config.cicsConsole,
    function (err, data, stderr) {
      typeof callback === 'function' && callback(err, data, stderr);
    }
  );
}

/**
* Deletes a Marble with an initial quantity
* @param {string}           color       color of Marble to delete
* @param {nodeCmdCallback}  [callback]  function to call after completion, callback(err, data, stderr)
*/
function deleteMarble(color, callback) {
  cmd.get(
    'zowe console issue command "F ' + config.cicsRegion + ',' + config.cicsTran + ' DEL ' + color + '" --cn ' + config.cicsConsole,
    function (err, data, stderr) {
      typeof callback === 'function' && callback(err, data, stderr);
    }
  );
}

/**
* Gets quantity of Marble from inventory
* @param {string}                 color     color of Marble to retrieve quantity of
* @param {awaitQuantityCallback}  callback  function to call after completion
*
*/
function getMarbleQuantity(color, callback) {
  var db2 = (typeof process.env.DB2 === "undefined") ? "" : process.env.DB2,
      command = 'zowe db2 execute sql -q "SELECT * FROM EVENT.MARBLE" --rfj ' + db2;

  cmd.get(command, function(err, data, stderr) { 
    if(err){
      callback(err);
    } else if (stderr){
      callback(new Error("\nCommand:\n" + command + "\n" + stderr + "Stack Trace:"));
    } else {
      data = JSON.parse(data);
      var desiredEntry = data.data[0].find(function(obj) {
        return obj.COLOR.trim() === color;
      });

      if(desiredEntry === undefined){ // not found
        callback(err, null, null);
      } else {
        callback(err, desiredEntry.INVENTORY, desiredEntry.COST);
      }
    }
  });
}

/**
* Updates a Marble with an initial quantity
* @param {string}           color       color of Marble to update
* @param {number}           quantity    quantity of Marbles desired
* @param {nodeCmdCallback}  [callback]  function to call after completion,callback(err, data, stderr)
*/
function updateMarble(color, quantity, callback) {
  cmd.get(
    'zowe console issue command "F ' + config.cicsRegion + ',' + config.cicsTran + ' UPD ' + color + " " + quantity + '" --cn ' + config.cicsConsole,
    function (err, data, stderr) {
      typeof callback === 'function' && callback(err, data, stderr);
    }
  );
}

/**
 * Sleep function.
 * @param {number} ms Number of ms to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Marbles', function () {
  // Change timeout to 60s from the default of 2s
  this.timeout(60000);

  /**
   * Test Plan
   * Delete the marble to reset inventory to zero (Delete will be tested later)
   * 
   * Create a marble
   * Verify that there is one marble in the inventory with cost one
   * 
   * Create the marble entry "again"
   * Verify the appropriate error message is returned
   * 
   * Update marble quantity to two
   * Verify that there are two marbles in the inventory
   * 
   * Delete the marble from the database
   * Verify there are no marbles in the inventory
   * 
   * Delete the marble "again"
   * Verify appropriate error message is returned
   * 
   * Update marble (which doesn't exist)
   * Verify approrpiate error message is returned
   */
  describe('Inventory Manipulation', function () {
    const COLOR = config.marbleColor;

    // Delete the marble to reset inventory to zero (Delete will be tested later)
    before(function(done){
      deleteMarble(COLOR, function(){
        done();
      })
    });

    it.only('should create a single marble with cost of 1', function (done) {
      // Create marble
      createMarble(COLOR, 1, 1, function(err, data, stderr){
        if(err){
          throw err;
        } else if (stderr){
          throw new Error("\nError: " + stderr);
        } else {
          // Strip unwanted whitespace/newline
          data = data.trim();
          assert.equal(data, "+SUCCESS", "Unsuccessful marble creation");

          getMarbleQuantity(COLOR, function(err, quantity, cost){
            if(err){
              throw err;
            }
            assert.equal(quantity, 1, "Inventory is not as expected");
            assert.equal(cost, 1, "Cost is not as expected");
            done();
          });
        }
      });
    });

    it('should not create a marble of a color that already exists', function (done) {
      // Create marble
      createMarble(COLOR, 2, 2, function(err, data, stderr){
        if(err){
          throw err
        } else if (stderr){
          throw new Error("\nError: " + stderr);
        } else {
          // Strip unwanted whitespace/newline
          data = data.trim();
          assert.equal(data, "+MARB002E Color (" + COLOR + ") already exists, UPDate or DELete it.", "Unexpected marble creation or incorrect error message");

          // Confirm quantity is unchanged
          getMarbleQuantity(COLOR, function(err, quantity){
            if(err){
              throw err;
            }
            assert.equal(quantity, 1, "Inventory is not as expected");
            done();
          });
        }
      });
    });

    it('should update marble inventory', function (done) {
      // Update marble
      updateMarble(COLOR, 2, function(err, data, stderr){
        if(err){
          throw err
        } else if (stderr){
          throw new Error("\nError: " + stderr);
        } else {
          // Strip unwanted whitespace/newline
          data = data.trim();
          assert.equal(data, "+SUCCESS", "Unsuccessful marble update");

          // Marble inventory should be updated
          getMarbleQuantity(COLOR, function(err, quantity){
            if(err){
              throw err;
            }
            assert.equal(quantity, 2, "Inventory is not as expected");
            done();
          });
        }
      });
    });

    it('should delete the marble color from inventory', function (done) {
      // Delete marble
      deleteMarble(COLOR, function(err, data, stderr){
        if(err){
          throw err
        } else if (stderr){
          throw new Error("\nError: " + stderr);
        } else {
          // Strip unwanted whitespace/newline
          data = data.trim();
          assert.equal(data, "+SUCCESS", "Unsuccessful marble deletion");

          //Marble should be removed from inventory
          getMarbleQuantity(COLOR, function(err, quantity){
            if(err){
              throw err;
            }
            assert.equal(quantity, null, "Inventory is not as expected");
            done();
          });
        }
      });
    });

    it('should not be able to "redelete" the marble color from inventory', function (done) {
      // Try to delete marble again
      deleteMarble(COLOR, function(err, data, stderr){
        if(err){
          throw err
        } else if (stderr){
          throw new Error("\nError: " + stderr);
        } else {
          // Strip unwanted whitespace/newline
          data = data.trim();
          assert.equal(data, "+MARB001E Color (" + COLOR + ") not found in inventory, CREate it.", "Unexpected marble redeletion or incorrect error message");

          // Marble should still not be in inventory
          getMarbleQuantity(COLOR, function(err, quantity){
            if(err){
              throw err;
            }
            assert.equal(quantity, null, "Inventory is not as expected");
            done();
          });
        }
      });
    });

    it('should not update marble inventory for a marble color that does not exist', function (done) {
      // Update marble
      updateMarble(COLOR, 3, function(err, data, stderr){
        if(err){
          throw err
        } else if (stderr){
          throw new Error("\nError: " + stderr);
        } else {
        // Strip unwanted whitespace/newline
          data = data.trim();
          assert.equal(data, "+MARB001E Color (" + COLOR + ") not found in inventory, CREate it.", "Unexpected marble update or incorrect error message");

          // Marble inventory should be updated
          getMarbleQuantity(COLOR, function(err, quantity){
            if(err){
              throw err;
            }
            assert.equal(quantity, null, "Inventory is not as expected");
            done();
          });
        }
      });
    });
  });
});
