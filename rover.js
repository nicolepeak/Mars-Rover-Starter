class Rover {
  constructor(position, mode = "normal", generatorWatts = 110) {
    this.position = position;
    this.mode = mode;
    this.generatorWatts = generatorWatts;
  }

  
  receiveMessage(message) {
    let response = {
      message: message.name,
      results: [],
    };

    /*created a "response object" to hold the message name (passed in from message object)
and results array (made from for loops below)
*/
    for (let i = 0; i < message.commands.length; i++) {
      let command = message.commands[i];
//I could not figure out how to iterate thru the commands without using another variable
      if (command.commandType === "MODE_CHANGE") {
        this.mode = command.value;
        response.results.push({ completed: true });
      } /* here I am saying for every command passed in, 
      //    check to see if it's "mode change". If so, update the rover and then push 
      //    small "completed: true" object to the results array*/
      else if (command.commandType === "STATUS_CHECK") {
        response.results.push({
          completed: true,
          roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position,
          },
        });
      } /* then I am checking to see if the command is "status check", 
             and if so, push this larger "roverStatus" object to the results array */ 
      else if (command.commandType === "MOVE") {
        if (this.mode === "LOW_POWER") {
          response.results.push({ completed: false });
        } else {
          this.position = command.value;
          response.results.push({ completed: true });
        }
      } /* then I am saying, if the command type is "move", check if the mode is
      "Low Power". If yes, push the "completed:false" object to the results array.
      if no, then update the rover position and push the "completed: true" object instead */
    }
    return response;
  }
}
module.exports = Rover;
