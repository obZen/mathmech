var fso = new ActiveXObject('Scripting.FileSystemObject');

var code_txt = "", decode_txt = "";
if(WScript.Arguments.length >= 2) {
    code_txt = WScript.Arguments(0);
    decode_txt = WScript.Arguments(1);
} else {

    WSH.echo("Требуются имена файлов");
    WScript.Quit(1);
}
if(!fso.FileExists(code_txt)) {
    WSH.echo("Не найден " + code_txt + "!");

    WSH.echo("Требуются имена файлов!");
    WScript.Quit(1);
}
if(!fso.FileExists(code_txt)) {
    WSH.echo("Файл " + code_txt + "не найден!");
    WScript.Quit(1);
}

var data = fso.OpenTextFile(code_txt);
var result = fso.CreateTextFile(decode_txt, true);

var str = data.ReadAll();

for(i = 0; i < str.length; ++i) {
    if(str.charAt(i) == "#") {
        num = str.charCodeAt(++i);
        ++i;
        for(j = 0; j < num; ++j)
            result.Write(str.charAt(i));
    } else { result.Write(str.charAt(i)); }
}

data.close();
result.close();