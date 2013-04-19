// Ўифрует строку с помощью циклического сдвига
function codeCezar(str, alph, diff) {
    var res = "";
    
    for(var i = 0; i < str.length; ++i) {
        if(alph.indexOf(str.charAt(i)) < 0) res += str.charAt(i);
        else res += alph.charAt( (alph.indexOf(str.charAt(i)) + diff)%alph.length);
    }
    
    return res;
}

function createTable(str, alph) {
    var res = new Array();
    for(var i = 0; i < str.length; ++i) 
        if(alph.indexOf(str.charAt(i)) >= 0)
            if(res[str.charAt(i)] == undefined) res[str.charAt(i)] = 1; else res[str.charAt(i)]++;
            
    for(var c in res) res[c] /= str.length;
    return res;
}

var str2code = "ABCZ  abcz!!!/.,@";
var alph     = "ABCDEFGHIGKLMNOPQRSTUVWXVZ";
var codestr  = codeCezar(str2code, alph, 2);
WSH.echo("STR2CODE: " + str2code);
WSH.echo("CODESTR:  " + codestr);
var globaltable = createTable(str2code, alph);
hackCezar(codestr, alph, globaltable);
