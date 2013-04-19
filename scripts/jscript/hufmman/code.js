if(WScript.Arguments.length < 3) {
    WSH.echo("Требуется имя файла для словаря, имя файлов для входных и выходных данных");
    WSH.echo("СScript code.js <dictionary> <input_data> <output_code>");
    WSH.quit(1);
}

var fso = new ActiveXObject('Scripting.FileSystemObject');

if(!fso.FileExists(WScript.Arguments(0))) {
    WSH.echo("Не найден файл со словарем: " + WScript.Arguments(0));
    WSH.quit(1);
}

if(!fso.FileExists(WScript.Arguments(1))) {
    WSH.echo("Не найден файл с входными данными: " + WScript.Arguments(1));
    WSH.quit(1);
}

var dictionary_stream = fso.OpenTextFile(WScript.Arguments(0));
var data_stream = fso.OpenTextFile(WScript.Arguments(1));
var code_stream = fso.CreateTextFile(WScript.Arguments(2));

// Читаем словарь
var dictionary = new Array();
while(!dictionary_stream.AtEndOfLine) {
    str = dictionary_stream.ReadLine();
    temp = new Array();
    temp = str.split(":");
    if(temp.length >= 2) {
        dictionary[temp[0]] = temp[1];
        //WSH.echo(dictionary[ temp[0] ]);
    }
}

// Читаем строку, которую необходимо закодировать
var str = data_stream.ReadAll();

// Кодируем
code = "";
for(i = 0; i < str.length; ++i) {
    if(str.charCodeAt(i+1) == 10 && str.charCodeAt(i) == 13) { code += '\n'; ++i; continue; }
    
    if(dictionary[ str.charAt(i) ] == undefined) {
        WSH.echo("НЕВОЗМОЖНО ЗАКОДИРОВАТЬ этот текст из файла " + WScript.Arguments(1) + " с помощью словаря " + WScript.Arguments(0));
        WSH.quit(1);
    }
    code += dictionary[str.charAt(i)];
}
code_stream.write(code);
WSH.echo(code);