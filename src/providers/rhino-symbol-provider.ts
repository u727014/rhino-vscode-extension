/*
 * CHANGE LOG - keep only last 5 threads
 * 
 * RESOURCES
 * https://code.visualstudio.com/api/language-extensions/programmatic-language-features
 * 
 * WORK ITEMS
 * TODO: create configuration based on manifest
 * TODO: send configuration to agent and get the configuration id
 * TODO: send symbol request with the configuration id (to support external repositories)
 * TODO: activate on connect and not on startup
 * TODO: handle recovery from connection error
 * TODO: distinct tests by id (when data driven is applied) to avoid symbols duplications
 * TODO: show data driven/parameters sets as a section under in the top level (like models)
 */
import * as vscode from 'vscode';
import { ExtensionSettings } from '../extension-settings';
import { Utilities } from '../extensions/utilities';
import { RhinoClient } from '../framework/rhino-client';
import { Provider } from './provider';

export class RhinoDocumentSymbolProvider extends Provider implements vscode.DocumentSymbolProvider {
    // members
    private context: vscode.ExtensionContext;
    private client: RhinoClient;

    /**
     * Creates a new instance of CommandsProvider
     */
    constructor(context: vscode.ExtensionContext) {
        super();

        // setup
        this.context = context;
        this.client = new RhinoClient(Utilities.getRhinoEndpoint());
    }

    /**
     * Provide symbol information for the given document.
     * 
     * @param document The document in which the command was invoked.
     * 
     * @returns An array of document highlights or a thenable that resolves to such.
     */
    public provideDocumentSymbols(document: vscode.TextDocument): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        let options = { location: { viewId: "outline" } };
        return vscode.window.withProgress(options, () => {
            return this.resolveSymbols(document);
        });
    }

    /**
     * Provide symbol information for the given document.
     * 
     * @param document The document in which the command was invoked.
     * 
     * @returns An array of DocumentSymbol.
     */
    public resolveSymbols(document: vscode.TextDocument): Thenable<vscode.DocumentSymbol[]> {
        const get = (symbols: any[]) => {
            let documentSymbols = [];
            try {
                for (let symbol of symbols) {
                    documentSymbols.push(this.resolveSymbol(symbol));
                }
            } catch (error) {
                console.error(error);
            }
            return documentSymbols;
        };

        return new Promise<vscode.DocumentSymbol[]>((resolve) => {
            // setup
            let text = document.getText();
            let input = text === undefined ? '' : text;

            // bad request
            if (input === undefined || input === '') {
                resolve([]);
            }

            // resolve
            this.client.getSymbols(input).then((data:any) => {
                let symbols = JSON.parse(data);
                let documentSymbols = get(symbols);

                if (documentSymbols === null || documentSymbols === undefined || documentSymbols.length === 0) {
                    return [];
                }

                let symbolsTree = documentSymbols.length > 1
                    ? documentSymbols
                    : documentSymbols[0].children;
                resolve(symbolsTree);
            });
        });
    }

    private resolveSymbol(symbol: any): vscode.DocumentSymbol {
        // setup meta-data
        let name = symbol.name;
        let details = symbol.details;
        let kind = undefined;

        // setup kind
        switch (symbol.type) {
            case "Boolean":
                kind = vscode.SymbolKind.Boolean;
                break;
            case "Class":
                kind = vscode.SymbolKind.Class;
                break;
            case "Model":
                kind = vscode.SymbolKind.String;
                break;
            case "Module":
                kind = vscode.SymbolKind.Module;
                break;
            default:
                kind = vscode.SymbolKind.Method;
                break;
        }

        // setup range
        let start = new vscode.Position(symbol.range.start.line, symbol.range.start.character);
        let end = new vscode.Position(symbol.range.end.line, symbol.range.end.character);
        let range = new vscode.Range(start, end);

        let selectedStart = new vscode.Position(symbol.selectedRange.start.line, symbol.selectedRange.start.character);
        let selectedEnd = new vscode.Position(symbol.selectedRange.end.line, symbol.selectedRange.end.character);
        let selectedRange = new vscode.Range(selectedStart, selectedEnd);

        const documentSymbol = new vscode.DocumentSymbol(name, details, kind, range, selectedRange);

        // exit conditions
        if (symbol.symbols === undefined || symbol.symbols.length === 0) {
            return documentSymbol;
        }

        // recurse
        documentSymbol.children = [];
        for (let item of symbol.symbols) {
            let child = this.resolveSymbol(item);
            documentSymbol.children.push(child);
        }

        // get
        return documentSymbol;
    }

    /**
     * Summary. Register the provider into the given context. 
     */
    public register(): any {
        // setup
        let options = [ExtensionSettings.providerOptions];

        // register
        this.context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(options, this));
    }
}
