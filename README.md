# Console Logger

Console Logger is a simple VS Code extension to create log message via command or action button.

## Settings

### `"ConsoleLogger.color"`  
This setting controls the text color of the logged message.
* Options: Any CSS defined color (see: [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value))
* _Default: <span style="color:cyan">cyan</span>_  

### `"ConsoleLogger.bgColor"`   
This setting controls the background color of the logged message.
* Options: Any CSS defined color (see: [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value))
* _Default: NONE_

### `"ConsoleLogger.fontSize"`   
This setting controls the font size color of the logged message.
* Options: Any CSS defined font size (see: [CSS Font Size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size))
* _Default: NONE_

### `"ConsoleLogger.quote"`   
This setting controls the type of quotation mark to wrap the log message in.
* Options:
  * `Double`: "..."
  * `Single`: '...'
  * `Backtick`: \`...\`
* _Default: Single_

### `"ConsoleLogger.outputTerminal"`   
This setting controls the type of output terminal to write the log message to.
* Options:
  * `console` (JavaScript/TypeScript)
  * `Serial` (C/C++)
* _Default: console_

### `"ConsoleLogger.logFunction"`   
This setting controls the logging function used to log to the output terminal.
* Options: 
  * `log`: (console)
  * `debug`: (console)
  * `print`: (Serial)
  * `printf`: (Serial)
  * `println`: (Serial)
* _Default: log_