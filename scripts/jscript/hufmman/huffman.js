function Node(name, freq, parent, code, use) {
    this.Name = name;
    this.Frequency = freq;
    this.Parent = parent;
    this.Code = code;
    this.Use = use;
}

function NodeEcho(x) {
    WSH.echo(x.Name + " " + x.Frequency + " " + x.Parent + " " + x.Code + " " + x.Use);
}

// Поиск минимального элемента в дереве по частоте вхождения в строку, 
// среди не просмотренных элементов
// Возвращает отрицательное число, если такой элемент не найден (все элементы дерева уже просмотрены)
function findMin(Tree, maxfreq) {
    var min1 = new Node('', maxfreq+1, -1, 0, -1); 
    var imin = -1;
    for(i = 0; i < tree.length; ++i) { 
        if(tree[i].Use == 0) {
            if(tree[i].Frequency < min1.Frequency) { 
                min1 = tree[i];
                imin = i;
            }
        }
    }
    return imin;
}

function addInDictionary(dictionary_stream, symbol, code) {
    var _strout = symbol + ":" + code + "\n";
    dictionary_stream.Write(_strout);
    WSH.echo(_strout);
}
// Настройка входных файлов
if(WScript.Arguments.length < 2) {
    WSH.echo("Требуется имя файла для словаря и исходных данных");
    WSH.echo("СScript huffman.js <dictionary> <data>");
    WSH.quit(1);
}
var fso = new ActiveXObject('Scripting.FileSystemObject');

if(!fso.FileExists(WScript.Arguments(1))) {
    WSH.echo("Не найден файл с исходными данными: " + WScript.Arguments(1));
    WSH.quit(1);
}

var dictionary_stream = fso.CreateTextFile(WScript.Arguments(0));
var data_stream = fso.OpenTextFile(WScript.Arguments(1));

// Чтение данных, для которых составялется словарь
var str = data_stream.ReadAll();

if(str.length == 0) {
    WSH.echo("Файл " + WScript.Arguments(1) + " пустой");
    WSH.quit(1);
}
// Таблица частоты вхождений символов в строку
var alph = new Array();
for(i = 0; i < str.length; ++i) {
    alph[str.charAt(i)] = 0;
}
for(i = 0; i < str.length; ++i) {
    alph[str.charAt(i)]++;
}

// Базовое дерево (только листья)
var tree = new Array();
var mosh = 0;
for(x in alph) {
    if(x.charCodeAt(0) == 13 || x.charCodeAt(0) == 10) continue;
    
    n = new Node(x, alph[x], -1, '', 0);
    tree.push(n);
    ++mosh;
}

// Если в алавит входит только один символ
if(mosh == 1) {
    addInDictionary(dictionary_stream, tree[0].Name, '0');
    WSH.quit(0);
}

// Построение дерева
for(j=0; j < tree.length; ++j) {
    imin1 = findMin(tree, str.length);
    if(imin1 > -1) tree[imin1].Use = 1; 
    imin2 = findMin(tree, str.length);
    if(imin2 > -1) tree[imin2].Use = 1;
    
    if(imin1 > -1 && imin2 > -1) {
        // создание узла на основе минальных, и добавление его в дерево
        tree.push(new Node(tree[imin1].Name + tree[imin2].Name, tree[imin1].Frequency + tree[imin2].Frequency, -1, '', 0));
        
        tree[imin1].Code = '0';
        tree[imin1].Parent = tree.length - 1;
        tree[imin2].Code = '1';
        tree[imin2].Parent = tree.length - 1;
    }
}

// Создаем словарь char <=> code
for(i=0; i < tree.length; ++i) {
    if(tree[i].Name.length == 1) {
        code = tree[i].Code;
        next = tree[ tree[i].Parent ];
        while(next.Parent != -1) {
            code += next.Code;
            next = tree[ next.Parent ];
        }
        // Записываем в словарь
        addInDictionary(dictionary_stream, tree[i].Name, code.split('').reverse().join(''));
    }
}