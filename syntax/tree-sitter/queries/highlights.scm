; Syntax highlighting queries for ADAN
; Order matters: more specific patterns should come first

; Comments
(comment) @comment

; Keywords
(include_statement) @keyword
(return_statement) @keyword
"include" @keyword
"return" @keyword
"while" @keyword
"if" @keyword
"program" @keyword

; Types
(type) @type

; Strings - template strings and content (but not the whole template_string to allow interpolation highlighting)
(string_content) @string

; Numbers
(number) @number

; Function definitions - highlight namespace (first identifier) and function name (last identifier)
(function_definition
  (identifier) @namespace
  (type) @type
  (identifier) @function)

; Function calls inside interpolations - most specific, must come first
(interpolation
  (expression
    (function_call
      (identifier) @function)))

; Function calls - highlight identifier as function
(function_call
  (identifier) @function)

; Variable declarations
(variable_declaration
  (identifier) @variable)

; Identifiers in interpolations (but not in function calls - handled above)
(interpolation
  (expression
    (identifier) @variable))

; Numbers in interpolations
(interpolation
  (expression
    (number) @number))

; General identifiers (variables) - must come last to avoid conflicts
(identifier) @variable

