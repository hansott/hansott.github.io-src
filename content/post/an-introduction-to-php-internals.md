+++
date = "2017-05-10T21:23:09+02:00"
tags = ["PHP"]
title = "An Introduction to How PHP Works Behind The Scenes"
draft = true
+++

At [CX Social](https://cxsocial.clarabridge.com), where I currently work, we mainly use PHP for our backend. A year ago I started wondering how PHP works internally. So I started learning about lexers and parsers:

{{< tweet 766717356282408960 >}}

## I didn't become an expert last night

After spending countless hours of exploring [the PHP source code](https://github.com/php/php-src), reading blogposts and following tutorials I think I've managed to understand the basic concepts of interpreting a programming language like PHP.

I even tried to build my [own programming language](https://github.com/hansott/spike).

## Benefits

Understanding how your favourite programming language works behind the scenes has a lot of benefits:

* Optimise your code
* Spend less time debugging
* Know what the language is capable of
* Contribute features or bug fixes to the language

# Overview

Let's see what happens when you execute `php code.php`:

1. The scanner splits the code in tokens.
2. The parser converts the tokens in an abstract syntax tree (AST).
3. The virtual machine converts the AST in opcodes and executes them.

We'll break it down with the follwing example:

```php
<?php
$now = new DateTime;
$year = (int) $now->format("Y");
$birthYear = 1994;
$age = $year - $birthYear;
echo "My age is {$age}." . PHP_EOL;
```

# Scanner

The scanner is also known as the lexer or tokenizer. It's goal is to scan through the input characters and split it in tokens (e.g. a keyword like `foreach`, a string, a variable name, ...). Each token has a type and a value. (You can find a list of all [PHP tokens](https://secure.php.net/manual/en/tokens.php) in the docs.)

It's possible to skip this step and parse the input characters directly but that makes the parse step much harder. When parsing you don't want to deal with the escaping of quotes in a string:

```php
<?php
echo "Hello, this is a quote: \"";
//                            ^^
```

Alright, back to our example:

```php
<?php
$now = new DateTime;
$year = (int) $now->format("Y");
$birthYear = 1994;
$age = $year - $birthYear;
echo "My age is {$age}." . PHP_EOL;
```

The scanner will return the following list of tokens:

```text
T_OPEN_TAG <?php
T_VARIABLE $now
=
T_NEW new
T_STRING DateTime
;
T_VARIABLE $year
=
T_INT_CAST (int)
T_VARIABLE $now
T_OBJECT_OPERATOR ->
T_STRING format
(
T_CONSTANT_ENCAPSED_STRING "Y"
)
;
T_VARIABLE $birthYear
=
T_LNUMBER 1994
;
T_VARIABLE $age
=
T_VARIABLE $year
-
T_VARIABLE $birthYear
;
T_ECHO echo
"
T_ENCAPSED_AND_WHITESPACE My age is
T_CURLY_OPEN {
T_VARIABLE $age
}
T_ENCAPSED_AND_WHITESPACE .
"
.
T_STRING PHP_EOL
;
```

Note that I left `T_WHITESPACE` out for readability.

PHP uses [re2c](http://re2c.org/) to generate its scanner. It takes the rules in [Zend/zend_language_scanner.l](https://github.com/php/php-src/blob/master/Zend/zend_language_scanner.l) and generates the C code to convert the input characters to tokens. Scanner generators are nice, but they aren't very user friendly. Go uses a [hand-written scanner](https://github.com/golang/go/blob/master/src/go/scanner/scanner.go) instead.

Since PHP 7 [the scanner is context sensitive](https://wiki.php.net/rfc/context_sensitive_lexer). This means that you can use `foreach` as name for a class method:

```php
<?php
class Introduction
{
    public function foreach() {}
    //              ^^^^^^^
}
```

The scanner knows that a method name will follow after `function` therefore we can use `foreach` as method name.

The scanner is available in PHP through the [`token_get_all`](https://php.net/manual/en/function.token-get-all.php) function. You can give it a string of PHP code as argument and it will return an array of tokens:

```php
<?php
$tokens = token_get_all('<?php echo "hello";');
var_dump($tokens);
```

You'll see that the token type is an `int`. You can get the name of the token (e.g. `T_FOREACH`) with [`token_name`](https://php.net/manual/en/function.token-name.php):

```php
<?php
foreach ($tokens as $token) {
    if (is_array($token)) {
        list ($type, $value) = $token;
        echo token_name($type) . ' ' . $value . PHP_EOL;
    } else {
        echo $token . PHP_EOL;
    }
}
```

Note that not all tokens have a type (see `is_array` check). That's because characters like `;` and `=` are kind of the type itself.

# Parser

The parser takes the tokens from the scanner and builds an abstract syntax tree.

## Abstract Syntax Tree (AST)

An abstract syntax tree represents

```php
<?php
$now = new DateTime;
$year = (int) $now->format("Y");
$birthYear = 1994;
$age = $year - $birthYear;
echo "My age is {$age}." . PHP_EOL;
```

```text
array(
    0: Expr_Assign(
        var: Expr_Variable(
            name: now
        )
        expr: Expr_New(
            class: Name(
                parts: array(
                    0: DateTime
                )
            )
            args: array(
            )
        )
    )
    1: Expr_Assign(
        var: Expr_Variable(
            name: year
        )
        expr: Expr_Cast_Int(
            expr: Expr_MethodCall(
                var: Expr_Variable(
                    name: now
                )
                name: format
                args: array(
                    0: Arg(
                        value: Scalar_String(
                            value: Y
                        )
                        byRef: false
                        unpack: false
                    )
                )
            )
        )
    )
    2: Expr_Assign(
        var: Expr_Variable(
            name: birthYear
        )
        expr: Scalar_LNumber(
            value: 1994
        )
    )
    3: Expr_Assign(
        var: Expr_Variable(
            name: age
        )
        expr: Expr_BinaryOp_Minus(
            left: Expr_Variable(
                name: year
            )
            right: Expr_Variable(
                name: birthYear
            )
        )
    )
    4: Stmt_Echo(
        exprs: array(
            0: Expr_BinaryOp_Concat(
                left: Scalar_Encapsed(
                    parts: array(
                        0: Scalar_EncapsedStringPart(
                            value: My age is
                        )
                        1: Expr_Variable(
                            name: age
                        )
                        2: Scalar_EncapsedStringPart(
                            value: .
                        )
                    )
                )
                right: Expr_ConstFetch(
                    name: Name(
                        parts: array(
                            0: PHP_EOL
                        )
                    )
                )
            )
        )
    )
)
```

Note that this AST is from [nikic/php-parser](https://github.com/nikic/PHP-Parser) and isn't exactly the same as the AST that PHP uses internally.

PHP uses [Bison](https://www.gnu.org/software/bison/) to generate its parser.

Syntax analysis and builds the ast
Operator precedence
Generated

PHP 7 AST

parse tree
nikic/php-parser

## Virtual machine

The virtual machine runs your PHP code. You can read [a detailed overview of the virtual machine](https://nikic.github.io/2017/04/14/PHP-7-Virtual-machine.html) on nikic's blog.

### Opcode

simpler than static
reflection
opcodes
link to nikic blog post for details
link to overview of opcodes
vld

other notable interpreters
http://hhvm.com/ (C++)
https://github.com/tagua-vm/tagua-vm (Rust)


```text
compiled vars:  !0 = $now, !1 = $year, !2 = $birthYear, !3 = $age
line     #* E I O op                           fetch          ext  return  operands
-------------------------------------------------------------------------------------
   2     0  E >   NEW                                              $4      :-5
         1        DO_FCALL                                      0          
         2        ASSIGN                                                   !0, $4
   3     3        INIT_METHOD_CALL                                         !0, 'format'
         4        SEND_VAL_EX                                              'Y'
         5        DO_FCALL                                      0  $7      
         6        CAST                                          4  ~8      $7
         7        ASSIGN                                                   !1, ~8
   4     8        ASSIGN                                                   !2, 1994
   5     9        SUB                                              ~11     !1, !2
        10        ASSIGN                                                   !3, ~11
   6    11        ROPE_INIT                                     3  ~14     'My+age+is+'
        12        ROPE_ADD                                      1  ~14     ~14, !3
        13        ROPE_END                                      2  ~13     ~14, '.'
        14        CONCAT                                           ~16     ~13, '%0A'
        15        ECHO                                                     ~16
        16      > RETURN                                                   1

```

# Next steps

I hope this gave blogpost gave you some valuable insights in how PHP works.

If you're thinking "Wow, this stuff is interesting. I want to know more." then you should try to write a lexer and/or a parser yourself. Invent your own programming language! You'll learn a lot from it, I promise.

Feedback or questions are welcome!