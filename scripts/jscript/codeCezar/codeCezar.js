function code(str, diff, globalalph) {
    var res = "";
    for(var i = 0; i < str.length; ++i)
        if(globalalph.indexOf(str.charAt(i)) < 0) res += str.charAt(i);
        else {
            res += globalalph.charAt( (globalalph.indexOf(str.charAt(i)) + diff)%globalalph.length);
        }
    
    return res;
}

function removeGarbage(str, alph) {
    var newstr = "";
    for(var i = 0; i < str.length; ++i) 
        if(globalalph.indexOf(str.charAt(i)) >= 0) newstr += str.charAt(i);
    return newstr;
}

function arrayFlip(trans) {  
    var key, tmp_ar = {};  
   
    for( key in trans ) {  
        tmp_ar[trans[key]] = key;  
    }  
   
    return tmp_ar;  
}  

function createTable(str, globalalph) {
    // Вырезаем все ненужные символы (не принадлежищие алфавиту)
    var newstr = removeGarbage(str, globalalph);
   
    var res = arrayFlip(globalalph.split(''));
    
    for(var c in res) res[c] = 0.0;
    for(var i = 0; i < newstr.length; ++i) 
        ++res[newstr.charAt(i)];
    for(var c in res) res[c] /= newstr.length;
    return res;
}

function hackCezar(codestr, alph, globaltable) {
    var localtable = createTable(codestr, alph);
    //for(var c in localtable) WSH.echo(c + "=>" + localtable[c]);
    var resDiff = 0;
    var analizeDiff = 1.1; // Квадрат разности частот никогда не будет превышать единицы
    for(var tempdiff = 1; tempdiff < alph.length; ++tempdiff) {
        var tAnalizeDiff = 0.0;
        for(var i = 0; i < alph.length; ++i) {
            var m = (i + tempdiff)%alph.length;
            tAnalizeDiff += Math.pow(globaltable[alph.charAt(m)] - localtable[alph.charAt(i)], 2);
        }
        //WSH.echo(resDiff + ":" + tAnalizeDiff);
        if(tAnalizeDiff < analizeDiff) {
            analizeDiff = tAnalizeDiff;
            resDiff = tempdiff;
        }
    }
    
    //WSH.echo("RESDIFF" + resDiff);
    var k = alph.length - resDiff;
    
    var decodestr = "";
    for(var i = 0; i < codestr.length; ++i) {
        if(alph.indexOf(codestr.charAt(i)) < 0) decodestr += codestr.charAt(i);
        else {
            var y = (alph.indexOf(codestr.charAt(i)) - k + alph.length) % alph.length;
            decodestr += alph.charAt(y);
        }
    }
    
    return decodestr;
}
var globalalph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var fso = new ActiveXObject('Scripting.FileSystemObject');
// Создаем глобальную таблицу частот
var globalStrStream = fso.OpenTextFile(WScript.Arguments(0));
var strForGlobalTable =  globalStrStream.readAll().toUpperCase();
var globaltable = createTable(strForGlobalTable, globalalph);

// Выполняем тесты
var testsStream = fso.OpenTextFile(WScript.Arguments(1));
var diff        = parseInt(WScript.Arguments(2));

if(diff <= 0 || diff >= globalalph.length) {
    WSH.echo("diff \in [1,"+(globalalph.length-1)+"]");
    WScript.quit(1);
}
while(!testsStream.AtEndOfLine) {
    var str2code = testsStream.readLine().toUpperCase();
    var codestr  = code(str2code, diff, globalalph);
    WSH.echo("INPUT:  " + str2code);
    WSH.echo("CODE:   " + codestr);
    //for(var c in globaltable) WSH.echo(c + "=>" + globaltable[c]);
    // Пытаемся взломать...
    var reshack = hackCezar(codestr, globalalph, globaltable);
    WSH.echo("DECODE: " + reshack);
    WSH.echo("########################################");
}