module.exports = grammar({
  name: 'adan',

  rules: {
    // top-level file
    source_file: $ => repeat($._statement),

    // top-level statements
    _statement: $ => choice(
      $.include_statement,
      $.function_definition,
      $.variable_declaration,
      $.function_call,
      $.template_string,
      $.expression_statement,
      $.comment,
      $.return_statement
    ),

    // include statement
    include_statement: $ => seq(
      'include',
      $.identifier,
      ';'
    ),

    // function definition: program::int main() { ... }
    function_definition: $ => seq(
      $.identifier,  // namespace or function name
      '::',
      $.type,
      $.identifier,  // function name
      '(',
      optional($.parameter_list),
      ')',
      '{',
      repeat($._statement),
      '}'
    ),

    // type annotations
    type: $ => choice('int', 'string', 'void'),

    // parameter list
    parameter_list: $ => seq(
      $.parameter,
      repeat(seq(',', $.parameter))
    ),

    // parameter
    parameter: $ => seq(
      $.identifier,
      '::',
      $.type
    ),

    // variable declaration: i::int = 0;
    variable_declaration: $ => seq(
      $.identifier,
      '::',
      $.type,
      optional(seq('=', $.expression)),
      ';'
    ),

    // return statement
    return_statement: $ => seq(
      'return',
      $.expression,
      ';'
    ),

    // expression statement
    expression_statement: $ => seq(
      $.expression,
      ';'
    ),

    // template strings with interpolations
    template_string: $ => seq(
      '"',
      repeat(choice(
        $.string_content,
        $.interpolation
      )),
      '"'
    ),

    string_content: $ => /[^"$\\]+/,

    interpolation: $ => seq(
      '${',
      $.expression,
      '}'
    ),

    // expressions
    expression: $ => choice(
      $.function_call,
      $.identifier,
      $.number,
      $.template_string,
      $.binary_expression
    ),

    // binary expressions
    binary_expression: $ => choice(
      $.arithmetic_expression,
      $.comparison_expression
    ),

    arithmetic_expression: $ => prec.left(1, seq(
      $.expression,
      choice('+', '-', '*', '/', '%', '='),
      $.expression
    )),

    comparison_expression: $ => prec.left(2, seq(
      $.expression,
      choice('>', '<', '>=', '<=', '==', '!='),
      $.expression
    )),

    // function calls
    function_call: $ => seq(
      $.identifier,
      '(',
      optional($.argument_list),
      ')'
    ),

    // argument list
    argument_list: $ => seq(
      $.expression,
      repeat(seq(',', $.expression))
    ),

    // identifiers
    identifier: $ => /[A-Za-z_$][A-Za-z0-9_$]*/,

    // numbers
    number: $ => /\d+/,

    // comments
    comment: $ => seq('//', /.*/)
  },

  extras: $ => [
    /\s/  // ignore whitespace
  ]
});
