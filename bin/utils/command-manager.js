const { EOL } = require('os');

const textColumns = require('./text-columns');

class CommandManager {
  #commands = [{
    name: 'help',
    description: 'Lists available commands',
    handler: () => {
      let output = `Usage: brewbox [command]${EOL}${EOL}`;

      output += `Commands:${EOL}`;

      const dataSource = this.#commands.map(({ name, description }) => ({
        name,
        description,
      }));

      output += textColumns(dataSource, [{
        key: 'name',
        minWidth: 24,
      }, {
        key: 'description',
      }]);

      output += EOL;

      console.log(output);
    },
  }];

  command(name, description, handler) {
    this.#commands.push({
      name,
      description,
      handler,
    });

    return this;
  }

  init(argv) {
    const commandName = argv._[0];
    const command = this.#getCommand(commandName);

    if (command) {
      command.handler();
    } else {
      this.#getCommand('help').handler();
    }
  }

  #getCommand(commandName) {
    return this.#commands.find(command => command.name === commandName);
  }
}

module.exports = CommandManager;
