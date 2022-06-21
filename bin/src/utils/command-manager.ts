import { EOL } from 'os';

import textColumns from './text-columns';

interface Command {
  name: string;
  description?: string;
  options?: [string, string][];
  handler?: () => void;
}

export default class CommandManager {
  private commands: Command[] = [{
    name: 'help',
    description: 'Lists available commands',
    handler: () => {
      let output = `Usage: brewbox [command]${EOL}${EOL}`;

      output += `Commands:${EOL}`;

      const dataSource = this.commands.map(({ name, description, options }) => ({
        name: `${name}${options?.length ? '\u0020[options]' : ''}`,
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

  command(name: string, description: string, options: [string, string][], handler: () => void) {
    this.commands.push({
      name,
      description,
      options,
      handler,
    });

    return this;
  }

  init(argv: any) {
    const commandName = argv._[0];
    const command = this.getCommand(commandName);

    if (command && command.handler) {
      command.handler();
    } else {
      this.getCommand('help')!.handler!();
    }
  }

  private getCommand(commandName: string) {
    return this.commands.find(command => command.name === commandName);
  }
}
