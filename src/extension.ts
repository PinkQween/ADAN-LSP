// import * as vscode from 'vscode';
// const Parser = require('tree-sitter');
// import ParserType from 'tree-sitter';
// const fs = require('fs');
// const path = require('path');

// // Load tree-sitter-adan with error handling
// let ADANBinding: any;
// let ADAN: any;

// try {
//   ADANBinding = require('tree-sitter-adan');
  
//   // tree-sitter-adan exports the language object
//   if (ADANBinding.language) {
//     ADAN = ADANBinding.language;
//   } else if (ADANBinding.default?.language) {
//     ADAN = ADANBinding.default.language;
//   } else if (typeof ADANBinding === 'object' && ADANBinding !== null) {
//     ADAN = ADANBinding;
//   } else {
//     throw new Error('Failed to load tree-sitter-adan language: invalid binding structure');
//   }
// } catch (e: any) {
//   const errorMsg = e.message || String(e);
//   console.error('Failed to load tree-sitter-adan:', errorMsg);
  
//   // If it's the grammar error, provide a helpful message
//   if (errorMsg.includes('grammar is not defined')) {
//     throw new Error('tree-sitter-adan binding error: grammar.js is being loaded incorrectly. Please ensure syntax/tree-sitter/index.js is using the native binding.');
//   }
  
//   throw e;
// }

// const parser = new Parser();
// parser.setLanguage(ADAN);

// // This will be set during activation
// let highlightQuery: any = null;

// function loadHighlightQuery(extensionPath: string) {
//   try {
//     let queryString: string | undefined;
    
//     // Try to get query from binding (if available)
//     if (ADANBinding.HIGHLIGHTS_QUERY) {
//       queryString = ADANBinding.HIGHLIGHTS_QUERY;
//       console.log('Loaded highlight query from binding');
//     } else {
//       // Fallback: try to read from file using extension path
//       const queryPath = path.join(extensionPath, 'syntax', 'tree-sitter', 'queries', 'highlights.scm');
//       if (fs.existsSync(queryPath)) {
//         queryString = fs.readFileSync(queryPath, 'utf8');
//         console.log('Loaded highlight query from file:', queryPath);
//       } else {
//         console.error('Highlight query file not found at:', queryPath);
//       }
//     }
    
//     if (queryString) {
//       highlightQuery = new Parser.Query(ADAN, queryString);
//       if (highlightQuery) {
//         console.log('Highlight query loaded successfully');
//       } else {
//         console.error('Failed to create query object');
//       }
//     } else {
//       console.error('No query string available');
//     }
//   } catch (e: any) {
//     console.error('Failed to load highlight query:', e);
//     console.error('Error stack:', e.stack);
//   }
// }

// // Map tree-sitter capture names to VSCode semantic token types
// const captureToTokenType: { [key: string]: number } = {
//   'comment': 5,      // comment (index 5)
//   'string': 3,        // string (index 3)
//   'number': 4,        // number (index 4)
//   'variable': 1,      // variable (index 1)
//   'function': 2,      // function (index 2)
//   'keyword': 0,       // keyword (index 0)
//   'type': 0,          // type (also keyword for now)
//   'namespace': 0,     // namespace (also keyword for now)
// };

// const tokenTypes = ['keyword', 'variable', 'function', 'string', 'number', 'comment'];
// const tokenModifiers: string[] = [];

// const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

// const semanticTokensProvider: vscode.DocumentSemanticTokensProvider = {
//   provideDocumentSemanticTokens(document) {
//     const builder = new vscode.SemanticTokensBuilder(legend);
    
//     try {
//       const tree = parser.parse(document.getText());
      
//       if (highlightQuery) {
//         // Use tree-sitter queries for highlighting
//         const captures = highlightQuery.captures(tree.rootNode);
        
//         console.log(`ADAN-LSP: Found ${captures.length} total captures`);
        
//         // Debug: log all capture types
//         const captureTypes = new Map<string, number>();
//         captures.forEach((c: any) => {
//           const count = captureTypes.get(c.name) || 0;
//           captureTypes.set(c.name, count + 1);
//         });
//         console.log('ADAN-LSP: Capture types:', Array.from(captureTypes.entries()).map(([name, count]) => `${name}:${count}`).join(', '));
        
//         // Debug: log function captures
//         const functionCaptures = captures.filter((c: any) => c.name === 'function');
//         if (functionCaptures.length > 0) {
//           console.log(`ADAN-LSP: Found ${functionCaptures.length} function captures:`, 
//             functionCaptures.map((c: any) => ({ text: c.node.text, pos: c.node.startPosition })));
//         }
        
//         // Use a map to track tokens by start position, prioritizing more specific captures
//         // This ensures function tokens override variable tokens at the same position
//         // Key format: row:column to allow overlapping tokens (semantic tokens can overlap)
//         const tokenMap = new Map<string, { node: any; type: number; name: string }>();
        
//         for (const capture of captures) {
//           const node = capture.node;
//           const captureName = capture.name;
//           const tokenType = captureToTokenType[captureName];
          
//           if (tokenType !== undefined) {
//             const startPos = node.startPosition;
//             const endPos = node.endPosition;
            
//             // Create a unique key based on the full range to handle overlapping tokens properly
//             // VSCode semantic tokens can overlap, so we track by full range
//             const key = `${startPos.row}:${startPos.column}:${endPos.row}:${endPos.column}:${captureName}`;
            
//             // If we already have a token at this exact range, only override if current is more specific
//             const existing = tokenMap.get(key);
//             if (!existing || (captureName === 'function' && existing.name === 'variable')) {
//               tokenMap.set(key, { node, type: tokenType, name: captureName });
//             }
//           } else {
//             // Log unmapped captures for debugging
//             console.log(`Unmapped capture: ${captureName} for node type: ${node.type}`);
//           }
//         }
        
//         console.log(`Total tokens to apply: ${tokenMap.size}`);
        
//         // Convert map to array and sort by position (row, then column)
//         const sortedTokens = Array.from(tokenMap.values()).sort((a: any, b: any) => {
//           const aRow = a.node.startPosition.row;
//           const bRow = b.node.startPosition.row;
//           if (aRow !== bRow) return aRow - bRow;
//           return a.node.startPosition.column - b.node.startPosition.column;
//         });
        
//         for (const { node, type: tokenType, name: captureName } of sortedTokens) {
//           const startPos = node.startPosition;
//           const endPos = node.endPosition;
          
//           // Calculate length - handle multi-line nodes
//           if (startPos.row === endPos.row) {
//             const length = endPos.column - startPos.column;
//             if (length > 0) {
//               // For function tokens, we want to ensure they override string tokens
//               // Use a modifier if needed, but for now just push the token
//               builder.push(startPos.row, startPos.column, length, tokenType, 0);
              
//               // Debug log for function tokens in interpolations
//               if (captureName === 'function') {
//                 const lineText = document.lineAt(startPos.row).text;
//                 const tokenText = lineText.substring(startPos.column, endPos.column);
//                 console.log(`Applying function token: "${tokenText}" at line ${startPos.row}, col ${startPos.column}`);
//               }
//             }
//           } else {
//             // For multi-line, just highlight the first line
//             const line = document.lineAt(startPos.row);
//             const length = line.text.length - startPos.column;
//             if (length > 0) {
//               builder.push(startPos.row, startPos.column, length, tokenType, 0);
//             }
//           }
//         }
//       } else {
//       // Fallback: basic highlighting without queries
//       function walkNode(node: ParserType.SyntaxNode) {
//         switch (node.type) {
//           case 'comment':
//             builder.push(node.startPosition.row, node.startPosition.column, 
//               node.endPosition.column - node.startPosition.column, 5, 0);
//             break;
//           case 'template_string':
//           case 'string_content':
//             builder.push(node.startPosition.row, node.startPosition.column, 
//               node.endPosition.column - node.startPosition.column, 3, 0);
//             break;
//           case 'number':
//             builder.push(node.startPosition.row, node.startPosition.column, 
//               node.endPosition.column - node.startPosition.column, 4, 0);
//             break;
//           case 'identifier':
//             builder.push(node.startPosition.row, node.startPosition.column, 
//               node.endPosition.column - node.startPosition.column, 1, 0);
//             break;
//         }
        
//         for (const child of node.children) {
//           walkNode(child);
//         }
//       }
//       walkNode(tree.rootNode);
//       }
//     } catch (e: any) {
//       console.error('Error in provideDocumentSemanticTokens:', e);
//     }
    
//     return builder.build();
//   },
// };

// export function activate(context: vscode.ExtensionContext) {
//   try {
//     console.log('ADAN-LSP: Activating extension...');
    
//     // Verify ADAN language is loaded
//     if (!ADAN) {
//       throw new Error('ADAN language not loaded');
//     }
//     console.log('ADAN-LSP: Language loaded successfully');
    
//     // Load highlight query using extension path
//     const extensionPath = context.extensionPath;
//     loadHighlightQuery(extensionPath);
    
//     if (!highlightQuery) {
//       console.warn('ADAN-LSP: Warning - highlight query not loaded, using fallback highlighting');
//     } else {
//       console.log('ADAN-LSP: Highlight query loaded successfully');
//     }
    
//     context.subscriptions.push(
//       vscode.languages.registerDocumentSemanticTokensProvider(
//         { language: 'adan' },
//         semanticTokensProvider,
//         legend
//       )
//     );
    
//     console.log('ADAN-LSP: Extension activated successfully');
//   } catch (e: any) {
//     const errorMsg = e.message || String(e);
//     console.error('ADAN-LSP: Activation failed:', errorMsg);
//     console.error('ADAN-LSP: Error stack:', e.stack);
    
//     // Show error to user
//     vscode.window.showErrorMessage(`ADAN-LSP activation failed: ${errorMsg}`);
//     throw e;
//   }
// }

// export function deactivate() {}
