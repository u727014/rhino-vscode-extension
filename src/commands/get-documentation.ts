/*
 * CHANGE LOG - keep only last 5 threads
 * 
 * RESOURCES
 */
import * as vscode from 'vscode';
import { Command } from "./command";

export class GetDocumentationCommand extends Command {
    /**
     * Summary. Creates a new instance of VS Command for Rhino API.
     * 
     * @param context The context under which to register the command.
     */
    constructor(context: vscode.ExtensionContext) {
        super(context);

        // build
        this.setCommandName('Get-Documentation');
    }

    /*┌─[ REGISTER & INVOKE ]──────────────────────────────────
      │
      │ A command registration pipeline to expose the command
      │ in the command interface (CTRL+SHIFT+P).
      └────────────────────────────────────────────────────────*/
    /**
     * Summary. Register a command for creating an integrated test case.
     */
    public register(): any {
        // let uri = vscode.Uri.parse('/C:/Rhino/Documentation/Conditions/Gravity.Plugins.Ui.Assertions/AlertExists.md');
        // vscode.commands.executeCommand("markdown.showPreviewToSide", uri);
        
        // build
        let command = vscode.commands.registerCommand(this.getCommandName(), () => {
            this.invoke(undefined);
        });

        // set
        this.getContext().subscriptions.push(command);
    }

    /**
     * Summary. Implement the command invoke pipeline.
     */
    public invokeCommand(callback: any) {
        this.invoke(callback);
    }

    private invoke(callback: any) {
        console.log("Get-Documentation");
    }
}
