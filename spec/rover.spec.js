const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  it("constructor sets position and default values for mode and generatorWatts", function () {
    let newRover = new Rover(12345)
    expect(newRover.position).toBe(12345);
    expect(newRover.mode).toBe('normal');
    expect(newRover.generatorWatts).toBe(110);
  });

  it("response returned by receiveMessage contains the name of the message", function () {
    let newRover = new Rover(12345);
    let message = new Message('Test message', []);
    let response = newRover.receiveMessage(message);
    expect(response.message).toBe('Test message');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let newRover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let response = newRover.receiveMessage(message);
    expect(response.results.length).toBe(2);
  });

  it("responds correctly to the status check command", function () {
    let newRover = new Rover(98382);
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Testing status check', commands);
    let response = newRover.receiveMessage(message);
    expect(response.results[0].roverStatus.mode).toBe('normal');
    expect(response.results[0].roverStatus.generatorWatts).toBe(110);
    expect(response.results[0].roverStatus.position).toBe(98382);
  });

  it("responds correctly to the mode change command", function () {
    let newRover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Test mode change command', commands);
    let response = newRover.receiveMessage(message);
    expect(response.results[0].completed).toBe(true);
    expect(newRover.mode).toBe('LOW_POWER');
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let newRover = new Rover(12345, 'LOW_POWER');
    let commands = [new Command('MOVE', 56789)];
    let message = new Message('Test move command in LOW_POWER mode', commands);
    let response = newRover.receiveMessage(message);
    expect(response.results[0].completed).toBe(false);
    expect(newRover.position).toBe(12345);
  });

  it("responds with the position for the move command", function () {
    let newRover = new Rover(12345);
    let commands = [new Command('MOVE', 56789)];
    let message = new Message('Test move command', commands);
    let response = newRover.receiveMessage(message);
    expect(response.results[0].completed).toBe(true);
    expect(newRover.position).toBe(56789);
  });

});
