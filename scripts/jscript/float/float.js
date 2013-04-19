var _vardebug = false;

function _DEBUG(str) {
    if(_vardebug) WSH.echo(str);
}

function reverse(str) {
    return str.split("").reverse().join("");
}

function toBinaryInteger(integer) {
    _DEBUG("toBI_INPUT: " + integer);
    integer = parseInt(integer);
    var res = "";
    while(integer > 1) {  
        res += integer % 2;
        integer = Math.floor(integer/2);
    }
    res += integer;
    return reverse(res);
}

function toBinaryFractional(fractional) {
    fractional = parseFloat(fractional);
    var res = "";
    var n = 150; // Храним только первые несколько битов
    while(n--) {
        fractional *= 2;
        if(Math.floor(fractional) == 1) {
            res += '1';
            fractional -= 1;
        }
        else res += '0';
    }
    
    return res;
}

function addFloat(fnum1, fnum2) {
        if(fnum1.flagNaN) return fnum1;
        if(fnum2.flagNaN) return fnum2;
        
        if(fnum1.flagDenormalize) return fnum2;
        if(fnum2.flagDenormalize) return fnum1;
        
        // Сложение двух чисел с одинаковым порядокм
        var resFloat = new Float("0");
        
        var _add = function(fnum1, fnum2, firstbit, result) {
            var t = 0; // Перенос
            var newmantissa = '';
            
            for(var i = fnum1.mantissa.length - 1; i >= 0; --i) {
                var sum = (parseInt( fnum1.mantissa.charAt(i) ) + parseInt( fnum2.mantissa.charAt(i) ) + t)
                newmantissa = sum%2 + newmantissa;
                t = Math.floor(sum/2);
            }
            
            var imaginary = (1 + firstbit + t).toString(2);
            newmantissa = imaginary.slice(1, imaginary.length) + newmantissa;
            newmantissa = newmantissa.slice(0, newmantissa.length - 1);
            
            result.mantissa = newmantissa;
            result.dExponet = fnum1.dExponet + firstbit;
            result.exponet = (127 + result.dExponet).toString(2);
        }
        
        if(fnum1.dExponet == fnum2.dExponet) _add(fnum1, fnum2, 1, resFloat);
        else {
            if(fnum1.dExponet < fnum2.dExponet) {
                fnum1.mantissa = '1' + fnum1.mantissa;
                fnum1.dExponet += 1;
                
                while(fnum1.dExponet != fnum2.dExponet) {
                    fnum1.mantissa = '0' + fnum1.mantissa;
                    ++fnum1.dExponet;
                }
                
                fnum1.mantissa = fnum1.mantissa.slice(0, 23);
            } else {
                fnum2.mantissa = '1' + fnum2.mantissa;
                fnum2.dExponet += 1;
                
                while(fnum2.dExponet != fnum1.dExponet) {
                    fnum2.mantissa = '0' + fnum2.mantissa;
                    ++fnum2.dExponet;
                }
                
                fnum2.mantissa = fnum2.mantissa.slice(0, 23);
            }
            
            _add(fnum1, fnum2, 0, resFloat);
        }
        
        return resFloat;
    }

function Float(number) {    
    this.flagNaN = false;
    this.flagInfinity = false;
    this.flagDenormalize = false;
    // Двоичное представление знака числа
    this.sign;
    // Двоичное значение экспонеты
    this.exponet = 0;
    // Десятичное представление экспонеты
    this.dExponet = 0;
    // Двоичное представление мантиссы
    this.mantissa = '';
    
    // Определяем знак
    if(number.charAt(0) == '-' || number.charAt(0) == '+') {
        if( number.charAt(0) == '+' || number.charAt(0) != '-' ) sign = '0'; // Положительное число
        else this.sign = '1'; // Отрицательное число
        
        number = number.slice(1, number.length);
    } else this.sign = '0';
    

    for(i = 0; i < number.length; ++i) {
        if((number.charAt(i) < '0' || number.charAt(i) > '9') && number.charAt(i) != '.') {
            this.flagNaN = true;
            this.exponet = 128;
            this.mantissa = '10000000000000000000000';
        }
    }
    
    if(!this.flagNaN) {
        // Определяем положение разделителя,
        // если его нет, то по умолчанию считается, что он находится в конце чилсла
        var _posdelimiter = number.search("[.]");
        if(_posdelimiter < 0) _posdelimiter = number.length;
        
        // Определяем целую часть числа и переводим ее в бинарный вид
        var integer = toBinaryInteger(number.slice(0, _posdelimiter));
        // Определяем дробную часть числа, если она есть, и переводим ее в дробный вид
        var fractional = '';
        if(_posdelimiter < number.length)
            fractional = toBinaryFractional(number.slice(_posdelimiter, number.length));

        _DEBUG("PRE_fractional: " + fractional);
        _DEBUG("PRE_integer: " + integer);
        
        // Приводим к (де)нормализованному виду
        if(integer.length > 1) {
            var t = integer.slice(1, integer.length);
            if(t.length > 127) { // Фиксируем бесконечность
                flagInfinity = true;
                fractional = '00000000000000000000000';
                this.exponet = 128;
            } else { // Иначе приводим к нормализованному виду
                fractional = t + fractional;
                this.exponet += t.length;
            }
        } else {
            if(integer.charAt(0) == '0') {
                // Приводим к нормализованному виду число
                if(fractional.search('[1]') == -1) { // Число 0
                    this.exponet = -127;
                    this.fractional = '00000000000000000000000';
                }
                else if(fractional.search('[1]') < 128) {            
                    var n = 0; 
                    while(integer.charAt(0) != '1') {
                        integer = fractional.charAt(n);
                        ++n;
                    }
                    fractional = fractional.slice(n, fractional.length);
                    this.exponet -= n;
                } else { // Приводим к денормализованному виду
                    this.flagDenormalize = true;
                    this.exponet = -127;
                    fractional = fractional.slice(127, fractional.length);
                    _DEBUG("DENORMALIZE_FRACTIONAL_LENGTH: " + fractional.length);
                    _DEBUG("DENORMALIZE_FRACTIONAL: " + fractional);
                }
            }
        }
    
        _DEBUG("PRE_exponet: " + this.exponet);
        this.mantissa = fractional.slice(0, 23);
        if(this.mantissa.length < 23 && !this.flagDenormalize) 
           while(this.mantissa.length != 23) this.mantissa += '0';
    }   
    
    this.dExponet = this.exponet;
    this.exponet = (127 + this.exponet).toString(2);
    
    this.toString = function() {
       var binaryFloatNumber = this.sign + " " + this.exponet + " " + this.mantissa;
       
       if(this.flagInfinity) return ((sign == 0) ? '+' : '-') + "Infinity" + "(" + binaryFloatNumber + ")";
       else if(this.flagDenormalize) return binaryFloatNumber + " " + "(denormalize!)";
       else if(this.flagNaN) return "NaN (" + binaryFloatNumber + ")";
       return binaryFloatNumber;
    }
}

if(WScript.Arguments.length > 1) _vardebug = true;
WSH.echo(WScript.Arguments.length);
var fso = new ActiveXObject('Scripting.FileSystemObject');
var tests_stream = fso.OpenTextFile(WScript.Arguments(0));

var num = 1;
/*while(!tests_stream.AtEndOfLine) {
    WSH.echo("TEST #" + num++);
    var input_data = tests_stream.readLine();
    var comment = tests_stream.readLine();
    WSH.echo("INPUT DATA: " + input_data);
    WSH.echo("COMMENT: " + comment);
    WSH.echo("RESULT: " + (new Float(input_data)).toString());
    WSH.echo();
    WSH.echo("################################");
    WSH.echo();
}*/


while(!tests_stream.AtEndOfLine) {
    var type = tests_stream.readLine(); 
    switch(type) {
        case 'conv' : {
            WSH.echo("TEST CONV #" + num++);
            var input_data = tests_stream.readLine();
            var comment = tests_stream.readLine();
            WSH.echo("INPUT DATA: " + input_data);
            WSH.echo("COMMENT: " + comment);
            WSH.echo("RESULT: " + (new Float(input_data)).toString());
            break;
        }
        case 'add' : {
            WSH.echo("TEST ADD #" + num++);
            var fnum1 = tests_stream.readLine();
            var fnum2 = tests_stream.readLine();
            WSH.echo("INPUT: " + fnum1 + "+" + fnum2 + "=" + (parseFloat(fnum1)+parseFloat(fnum2)));
            var binaryf1 = new Float(fnum1);
            var binaryf2 = new Float(fnum2);
            var binaryResult = new Float( (parseFloat(fnum1)+parseFloat(fnum2)).toString() );
            WSH.echo("BINARY INPUT :" + binaryf1.toString() + "+" + binaryf2.toString());
            WSH.echo("TEST OT:" + binaryResult.toString());
            WSH.echo("OUTPUT: " + addFloat(binaryf1, binaryf2).toString());
            break;
        }
    }
    WSH.echo();
    WSH.echo("#################################################");
    WSH.echo();
}