Server/Client model Calulator
======================
Simple server/client model calculator. The server supplies RESTful APIs and the client can use them easily.



Why Server/Client model?
------
I'd like to learn Node.js in short term.



Quick usage 
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
The server supports RESTful API with JSONP. Therefore when you call the API, you need to prepare the callback format.

Here's the example of JQuery;
    $.getJSON("http://localhost:8888/calc?callback=?", {'expression': '1 + 2'}, function(data, status) {
      if (status == "success") { 
          var result = $("#result");
          result.val(data["answer"] + "\n" + result.val());
      } else {
          alert('Cannot access the server');
      }
    });

#### GET /calc
##### parameters
* expression | string | infix notation. `(10.5 + 7) * -2 / 3`

##### return value
Return values are provides as a JSON object. `{"ansewer" : NUMBER, "expression" : "Expression String"}` 
* answer | string | The calculated result. 
* expression | string | Formatted infix notation. Therefore, even if the user input `1+  2*3`, it shows `1 + 2 * 3`.

#### GET /calc_rpn
##### parameters
* expression | string | postfix notation. (i.e. reverse polish notation) `10.5 7 + - 2 * 3 /`

##### return value
Return values are provides as a JSON object. `{"ansewer" : NUMBER, "expression" : "Expression String"}` 
* answer | string | The calculated result. 
* expression | string | Formatted infix notation. Therefore, even if the user input `1 2   3 *     +`, it shows `1 2 3 * +`.

#### GET /support_op
##### parameters
None

##### return value
Return values are provides as a JSON object. `{"ansewer" : NUMBER, "expression" : "Expression String"}` 
* key | string | The key means operator expression.
* params | number | How many parameter the operator takes. If the operator takes 1 param, this value is 1.
* description | string| The description of the operator

Here's the return value sample;
    {
    	"/":{
    		params:2, description:"5 / 3"
    	},
    	"*":{
    		params:2, description:"5 * 3"
    	} 
    }


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
