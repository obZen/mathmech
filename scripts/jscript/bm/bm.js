// Находит все вхождения temp в str  с помощью алгоритма Бойера-Мура
// Возвращает массив начало вхождений temp в str
// handler = function(i); // 

function find(str, temp) {
    // Префикс-функция
    var prefixFunction = function(temp) {
        var k = 0; 
        var p = new Array();
        p[0] = 0;
        for(var i = 1; i < temp.length; ++i) {
            while( (k > 0) && (temp[k] != temp[i]) ) k = p[k-1];
            if(temp[k] == temp[i]) ++k;
            p[i] = k;
        }
        return p;
    }
    
    var min = function(v1, v2) { return (v1 < v2) ? v1 : v2; }
    
    if(str.length < temp.length) return -1;
    if(!temp.length) return str.length;
    
    var stopTable = new Array(); // char => int
    var sufficsTable = new Array(); // int => int
    
    for(var i = 0; i < temp.length; ++i) stopTable[temp.charAt(i)] = i;
    
    var reverseTemp = temp.split('').reverse().join('');
    var pftemp = prefixFunction(temp);
    var reversePfTemp = prefixFunction(reverseTemp);
    
    for(var i = 0; i < temp.length + 1; ++i)  sufficsTable[i] = temp.length - pftemp[ pftemp.length - 1 ];
    for(var i = 1; i < temp.length; ++i) { var j = reversePfTemp[i]; sufficsTable[j] = min(sufficsTable[j], i - reversePfTemp[i] + 1); }
    
    // Search
    var result = new Array();
    for(var shift = 0; shift <= str.length - temp.length;) {
        var pos = temp.length - 1;
        while(temp.charAt(pos) == str.charAt(pos + shift)) {   
            if(pos == 0) { 
                result.push(shift);
                var ts = sufficsTable[temp.length - pos - 1];
                shift += (ts != undefined) ? ts : 1;
                continue;
            }
            --pos;
        }
        
        /*if(pos == temp.length - 1) {
            var stop_symbol = stopTable[ str.charAt(pos + shift) ];
            shift += pos - (stop_symbol != undefined ? stop_symbol : -1);
        } else {
            shift += sufficsTable[temp.length - pos - 1];
        }*/
        
         
        var stop_symbol = stopTable[ str.charAt(pos + shift) ];
        var shift_1  = pos - (stop_symbol != undefined ? stop_symbol : -1);
        var shift_2  = sufficsTable[temp.length - pos - 1];
        shift += (shift_1 > shift_2) ? shift_1 : shift_2;
        //WSH.echo(shift_1 + " " + shift_2);
    }
    
    return result;
}

var fso = new ActiveXObject('Scripting.FileSystemObject');
var test_stream = fso.OpenTextFile(WScript.Arguments(0));
var substring_stream = fso.OpenTextFile(WScript.Arguments(1));

var str = test_stream.readAll();
var temp = substring_stream.readAll();
var res = find(str, temp);
if(!res.length) WSH.echo("NOT MATCHES");
else for(var i = 0; i < res.length; ++i) WSH.echo(res[i]);