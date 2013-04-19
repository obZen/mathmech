function isDigit(str) {
    if(str >= '0' && str <= '9') return true; else return false;
}

if(!String.prototype.trim) {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
}


// str Выражение в инфиксной записи
// Возвращает строку в обратной польской записи
function rpm(str) {
    var stack = new Array();
    // Приоритеты
    var pr    = new Array();
    pr['('] = 0;
    pr[')'] = 1;
    pr['+'] = 2;
    pr['-'] = 2;
    pr['*'] = 3;
    pr['/'] = 3;
    // 
    var res = "";
    var arres = new Array();
    for(var i = 0; i < str.length; ++i) {
	    if(isDigit(str.charAt(i)) || str.charAt(i) == '.') {
            var num = "";
            while(isDigit(str.charAt(i)) || str.charAt(i) == '.') num += str.charAt(i++);
            arres.push(num);
            --i; // 
        }
	    else if (str.charAt(i) == '(') stack.push('(');
	    else if (str.charAt(i) == ')') {
		   var cur = '\0';
		   while(stack.length && cur != "(") {
			   cur = stack.pop();
			   if(cur != "(")
			   	arres.push(cur);
		   }
           if(cur != "(") { return "ERROR: Скобки раставлены не попарно!"; }
	    }
	    else if ( (str.charAt(i) == "+") || (str.charAt(i) == '-') || (str.charAt(i) == '*') || (str.charAt(i) == '/')) {
		    var cur = '\0';
	            while(true) {
			    cur = stack[stack.length - 1];
			    if(pr[str.charAt(i)] <= pr[cur]) arres.push(stack.pop());
			    else {
				    stack.push(str.charAt(i));
				    break;
			    }
		    }
        }
    }

    while(stack.length) {
	    var cur = stack.pop();
	    if(cur == "(" || cur == ")") return "ERROR: Скбоки раставлны не попарно!";
	    else  arres.push(cur);
    }    
    
    
    this.toString = function() { 
        var ans = "";
        for(var d in arres) ans += arres[d] + " ";
        return ans;
    }

    this.calculate = function() {
        var stack = new Array();
        for(var d in arres) {
            if(arres[d] != '') {
                if(!isNaN(arres[d])) stack.push(parseFloat(arres[d]));
                else {
                    var a = stack.pop();
                    var b = (stack.length > 0) ? stack.pop() : 0;
                    
                    switch(arres[d]) {
                        case '+' : stack.push(b + a); break;
                        case '-' : {
                            stack.push(b - a); 
                            break;
                        }
                        case '*' : stack.push(b * a); break;
                        case '/' : { 
                            stack.push(b / a);
                            break;
                        }
                    }
                }
               // WSH.echo(stack);
            }
        }
        return stack.pop();
    }
    
}

var fso = new ActiveXObject('Scripting.FileSystemObject');
var tests_stream = fso.OpenTextFile(WScript.Arguments(0));
var i = 1;
while(!tests_stream.AtEndOfLine) {
    WSH.echo("TEST #" + (++i));
    var test = tests_stream.readLine();        
    var r = new rpm(test);
    WSH.echo("INPUT: " + test);
    WSH.echo("RPM: " + r.toString());
    WSH.echo("CALCULATE: " + r.calculate());
    WSH.echo("##########################");
}
