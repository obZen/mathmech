function Machine() {    
    // Memory of virtual machine
    // memory[addr] = command|data
    var memory = new Array();
    
    // Таблица меток в программе
    // Каждая метка содержит адрес ячейки следующий за этой меткой в памяти
    // lable:
    // jmp lable
    var lablies = new Array();
    
    // Таблица идентефикаторов переменных
    // Все переменные по умолчанию имеют тип string
    // Key = имя метки
    // variables[Key] = адрес ячейки памяти, в которой содержится значение этой переменной
    // Переменная объявляется с помощью команды set
    // set <Key> <Value>
    var variables = new Array();
    
    // Register instruction pointer
    // Указывает на следующую команду для выполнения
    var ip = 0;
    
    // Обработчики команд
    // [command] => <handler>
   // var handlers = new Array();
    
    // Init of machine
    // strCode - подготовленная строка, в которой каждая команда разделена пробелом
    // Последняя команда должна быть exit!
    this.Init = function(strCode) {
        memory = strCode.split(' '); // Считываем код в память
        // Ищем метки, настраиваем адреса
        for(var key in memory) {
            if(memory[key].indexOf(':') >= 0)
                    lablies[ memory[key].replace(':','') ] = parseInt(key) + 1; // Метка указывает на следующую ячейку, следующую за ней.
        }
        
        ip = 0;
    }
    
    // Run
    this.Run = function() {
       // WSH.echo("TABLE OF LABLIES");
       // for(k in lablies)
        //    WSH.echo(k + ": " + lablies[k]);
       // WSH.echo("END TABLE OF LABLIES");    
        while(memory[ip] != 'exit') {
       //     WSH.echo(ip + ": " + memory[ip]);
            switch(memory[ip]) {
                case 'read' : _read(); break;
                case 'write' : _write(); break;
                case 'add' : _add(); break;
                case 'sub' : _sub(); break;
                case 'mul' : _mul(); break;
                case 'div' : _div(); break;
                case 'mod' : _mod(); break;
                case 'set' : _set(); break;
                case 'jmp' : _jmp(); break;
                case 'eqjmp' : _eqjmp(); break;
                case 'lejmp' : _lejmp(); break;
                case 'toint' : _toint(); break;
                case 'tofloat' : _tofloat(); break;
                case 'exit' : _exit(); break;
                default : _nextCommand(1); break;
            }
        }
    }
    
    //
    var _checkVariable = function(ip) {
        var addr = _getVarAddr(_getMemory(ip));
        if(addr == undefined)
            _criticalError(_getMemory(ip) + " не объявлена");
        
        return addr;
    }
    
    // read <var>
    // Считывает строку из потока ввода (консоли)
    var _read = function() {
        var addr = _checkVariable(ip+1);

        var str = WScript.StdIn.ReadLine();
        _setMemory(addr, str);
        _nextCommand(2);
    }
    
    // write <var>
    // Выводит значение переменной на экран
    var _write = function() {
        var addr = _checkVariable(ip + 1);
        WScript.StdOut.Write(_getMemory(addr) + '\n');
        _nextCommand(2);
    }
    
    // ----
    // Обработчики арифметических команд
    // ----
    
    // add <var> <var> <res>
    var _add = function() {
        var addr1 = _checkVariable(ip+1);
        var addr2 = _checkVariable(ip+2);
        var resaddr = _checkVariable(ip+3);
            
        _setMemory(resaddr, _getMemory(addr1) + _getMemory(addr2));
        _nextCommand(4);
    }
    
    var _mul = function() {
        var addr1 = _checkVariable(ip+1);
        var addr2 = _checkVariable(ip+2);
        var resaddr = _checkVariable(ip+3);
            
        _setMemory(resaddr, _getMemory(addr1) * _getMemory(addr2));
        _nextCommand(4);
    }
    
    var _sub = function() {
        var addr1 = _checkVariable(ip+1);
        var addr2 = _checkVariable(ip+2);
        var resaddr = _checkVariable(ip+3);
            
        _setMemory(resaddr, _getMemory(addr1) - _getMemory(addr2));
        _nextCommand(4);
    }
    
    var _div = function() {
        var addr1 = _checkVariable(ip+1);
        var addr2 = _checkVariable(ip+2);
        var resaddr = _checkVariable(ip+3);
            
        _setMemory(resaddr, _getMemory(addr1) / _getMemory(addr2));
        _nextCommand(4);
    }
    
    var _mod = function() {
        var addr1 = _checkVariable(ip+1);
        var addr2 = _checkVariable(ip+2);
        var resaddr = _checkVariable(ip+3);
        
        _setMemory(resaddr, _getMemory(addr1) % _getMemory(addr2));
       
        _nextCommand(4);
    }
    
    // set <name> <var or value>
    var _set = function() {
        var name = _getMemory(ip + 1);
        var value = _getMemory(ip + 2);
        
        // Считываем как данные в ячейке [ip+2]
        if(_getVarAddr(value) == undefined)
            variables[name] = ip + 2;
        // Создаем _копию_ данных, хранящихся в переменной [ip+2]s
        else {
            var addr = _getVarAddr(value);
            memory.push( _getMemory(addr) );
            variables[name] = memory.length - 1;
        }
        
        _nextCommand(3);
    }
    
    // jmp <lable>
    var _jmp = function() {
        var addr = _getAddrLable( _getMemory(ip + 1) );
        if(addr == undefined) _critcalError( _getMemory(ip + 1) + " метки не сущесвует");
        
        ip = addr;
    }
    
    // eqjmp <var1> <var2> <lable>
    // jump if <var1> == <var2>
    var _eqjmp = function() {
        var addr1 = _checkVariable(ip+1);
        var addr2 = _checkVariable(ip+2);

        if(_getMemory(addr1) == _getMemory(addr2)) {
            var lable = _getAddrLable( _getMemory(ip + 3) );
            ip = lable;
        } else { _nextCommand(4);}
    }
    
    // lejmp <var1> <var2> <lable>
    // jump if <var1> <= <var2>
    var _lejmp = function() {
        var addr1 = _checkVariable(ip+1);
        var addr2 = _checkVariable(ip+2);
        
        if(_getMemory(addr1) <= _getMemory(addr2)) {
            var lable = _getAddrLable( _getMemory(ip + 3) );
            ip = lable;
        } else _nextCommand(4);
    }
    
    // jmp <lable>
    // jump to <lable>
    var _jump = function() {
        var lable = _getAddrLable( _getMemory(ip+1) );
        
        if(lable == undefined) _criticalError( _getMemory(ip+1) + " метки не сущесвует");
        ip = lable;
    }
    
    // toint <var>
    // Приводит переменную var к целому типу
    var _toint = function() {
        var addr = _checkVariable(ip + 1);
        var newvalue = parseInt(_getMemory(addr));
        
        if(newvalue == NaN)
            _criticalError("Ошибка преобразования " + _getMemory(ip + 1) + "=" + _getVarAddr(addr) + " к целому типу");
        
        _setMemory(addr, newvalue);
        _nextCommand(2);
    }
    
    //  tofloat <var>
    // Приводит переменную var к типу с плавующей точкой
    var _tofloat = function() {
        var addr = _checkVariable(ip + 1);
        var newvalue = parseFloat(_getMemory(addr));
        
        if(newvalue == undefined)
            _criticalError("Ошибка преобразования " + _getMemory(ip + 1) + "=" + _getVarAddr(addr) + " к типу float");
        
        _setMemory(addr, newvalue);
        _nextCommand(2);
    }
    
    // Выход из виртульной машины
    var _exit = function() {
        //WSH.exit();
        return;
    }
    // Возращает адрес переменной в памяти
    // Если переменной не существует, то возвращает undefined
    var _getVarAddr = function(varname) {
        return variables[varname];
    }
    
    var _setMemory = function(addr, value) {
        memory[addr] = value;
    }
    
    var _getMemory = function(addr) {
        return memory[addr];
    }
    
    // Устаналвивает ip на следующую команду
    // count указывает, сколько ячеек в памяти следует пропустить (например, длина команды включая ее имя и все ее аргументы)
    var _nextCommand = function(count) {
        ip += count;
    }
    
    // Возращает адрес, на который указывает метка lable
    // если такой метки не существует, то возращает undefined
    var _getAddrLable = function(lable) {
        return lablies[lable];
    }
    
    //
    var _criticalError = function(str) {
        WSH.echo(str);
        WSH.quit(); // Временно!
    }
}


// Читаем код
var fso = new ActiveXObject("Scripting.FileSystemObject");
var text_prog = fso.OpenTextFile(WScript.Arguments(0));

var code = "";
while(!text_prog.AtEndOfStream)
    code += text_prog.ReadLine() + " ";
code += "exit";

var vm = new Machine();
vm.Init(code);
vm.Run();