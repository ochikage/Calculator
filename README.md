Calulator
======================
Simple server/client model calculator.


Quick use
------

### Server side
1. Run `node index.js`

###Client side
1. Click the "Gear" icon to for server setting.
2. Put the server inforation in the input text like `http://localhost:8888`
3. Open index.html on a blowser.
4. Input expression in the input text.
5. Push enter or click "=" button.
6. You can see the answer at the top of the text area.


Server information
------

### APIs
The server supports RESTful API with JSONP.

#### GET /calc
* parameter: expression
* return value: {answer: "", expression: ""}

The parameter expression is infix notation. `(10.5 + 7) * -2 / 3`

The return expression is formatted. Therefore, even if the user input `1+  2*3`, it shows `1 + 2 * 3`.


#### GET /calc_rpn
* parameter: expression
* return value: {answer: "", expression: ""}

The expression is postfix notation (i.e. reverse polish notation). `10.5 7 + - 2 * 3 /`

The return expression is formatted. Therefore, even if the user input `1 2   3 *     +`, it shows `1 2 3 * +`.


#### GET /support_op
* parameter: -
* return value: {"/":{params:2, description:"5 / 3"},"*":{params:2, description:"5 * 3"},"%":{params:2, description:"surplus e.g. 5 % 3 = 2"} ... 

"params" means how many parameter the operator takes. "description" means how to user the operator.



### Supported operators
#### Monadic operators
Monadic operators takes 1 parameter like `ABS(-4) = 4`.

* ABS: absolute
* SQRT: square root
* SIN: sine
* COS: cosine
* TAN: tangent
* LN: logarithm whose base is E
* LOG: logarithm whose base is 10
* NABEATSU: when the number contains 3 or is multibles of 3, it returns Infinity

#### Dyadic operators
Dyadic operators takes 2 parameters like `2 + 3 = 5`.

* +: addition
* -: substraction
* *: multiplication
* /: devide
* %: surplus
* ^: exponential


### Add new operators
You can add new operators easly just edit operatos.json.
1. Create operator object.
2. Add "params", "priority", "code", "description".
3. Restart the server.

The setting value means;

* params: The number of parameters. If the operator is mnadic, it is 1. If dynadic, 2.
* priority: The operational priority. The lerger number is, the higher priority the operator has.
* code: Actual operation. p1 and p2 means the parameters. It is poped from internal stack.
* description: Description of the operator. /support_op API uses this field. 


Here's a sample;

    
    "/" : {
        "params" : 2,
        "priority" : 20,
        "code" : "p2 / p1",
        "description" : "5 / 3"
    },
    "ABS" : {
        "params" : 1,
        "priority" : 50,
        "code" : "Math.abs(p1)",
        "description" : "absolute value e.g. ABS(-4) = 4"
    },


Client information
------
You can designe any cliant by using the server APIs. This time, I created a HTML base simple client to show how to user the APIs.

### Setting dialog

* Host name: input the server name like `http://localhost:8888`
* Use Postfix (Reverse Polish) Notation: If you check this, you can use postfix notation to input expressions.

When you click "Save" the setting values are stored in the local storage.


### Supported opereators list

This list gets information by using /support_op API. So you can see the latest information. If you cannot access the server, this list is hidden. The mouseover action on the each operator pops descriptions.
