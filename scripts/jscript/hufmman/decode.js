// Сопостовляет строку pstr со всеми строками в словаре,
// если сопоставление удачно, то возвращается ключ соответсвующий этой строке,
// иначе возвращает значение undefined
function search(dict, pstr) {
    for(key in dict) {
        if(dict[key] == pstr) return key;
    }
    return undefined;
}

if(WScript.Arguments.length < 3) {
    WSH.echo("Требуется имя файла для словаря, имя файлов для входных и выходных данных");
    WSH.echo("СScript code.js <dictionary> <input_code> <output_decode>");
    WSH.quit(1);
}

var fso = new ActiveXObject('Scripting.FileSystemObject');

if(!fso.FileExists(WScript.Arguments(0))) {
    WSH.echo("Не найден файл со словарем: " + WScript.Arguments(0));
    WSH.quit(1);
}

if(!fso.FileExists(WScript.Arguments(1))) {
    WSH.echo("Не найден файл с кодированными данными: " + WScript.Arguments(1));
    WSH.quit(1);
}

var dictionary_stream = fso.OpenTextFile(WScript.Arguments(0));
var code_stream = fso.OpenTextFile(WScript.Arguments(1));
var decode_stream = fso.CreateTextFile(WScript.Arguments(2));

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
// Считываем строку для декодировки
var str = code_stream.ReadAll();

// Декодируем строку str
var decode = "";
for(i = 0; i < str.length; ++i) {
    if(str.charAt(i) == '\n') { decode += '\n'; continue; }
    
    var cur = str.charAt(i);
    while(true) {
        if(i >= str.length) {
            WSH.echo("НЕВОЗМОЖНО ДЕКОДИРОВАТЬ этот текст из файла " + WScript.Arguments(1) + " с помощью словаря из файла " + WScript.Arguments(0));
            WSH.quit(1);
        }
        
        dt = search(dictionary, cur);
        if(dt == undefined) {
            cur += str.charAt(i+1);
            ++i;
        } else {
            decode += dt;
            break;
        }
    }
}

decode_stream.write(decode);
WSH.echo(decode);