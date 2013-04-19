function Machine() {    
    // Memory of virtual machine
    // memory[addr] = command|data
    var memory = new Array();
    
    // ������� ����� � ���������
    // ������ ����� �������� ����� ������ ��������� �� ���� ������ � ������
    // lable:
    // jmp lable
    var lablies = new Array();
    
    // ������� ��������������� ����������
    // ��� ���������� �� ��������� ����� ��� string
    // Key = ��� �����
    // variables[Key] = ����� ������ ������, � ������� ���������� �������� ���� ����������
    // ���������� ����������� � ������� ������� set
    // set <Key> <Value>
    var variables = new Array();
    
    // Register instruction pointer
    // ��������� �� ��������� ������� ��� ����������
    var ip = 0;
    
    // ����������� ������
    // [command] => <handler>
   // var handlers = new Array();
    
    // Init of machine
    // strCode - �������������� ������, � ������� ������ ������� ��������� ��������
    // ��������� ������� ������ ���� exit!
    this.Init = function(strCode) {
        memory = strCode.split(' '); // ��������� ��� � ������
        // ���� �����, ����������� ������
        for(var key in memory) {
            if(memory[key].indexOf(':') >= 0)
                    lablies[ memory[key].replace(':','') ] = parseInt(key) + 1; // ����� ��������� �� ��������� ������, ��������� �� ���.
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
            _criticalError(_getMemory(ip) + " �� ���������");
        
        return addr;
    }
    
    // read <var>
    // ��������� ������ �� ������ ����� (�������)
    var _read = function() {
        var addr = _checkVariable(ip+1);

        var str = WScript.StdIn.ReadLine();
        _setMemory(addr, str);
        _nextCommand(2);
    }
    
    // write <var>
    // ������� �������� ���������� �� �����
    var _write = function() {
        var addr = _checkVariable(ip + 1);
        WScript.StdOut.Write(_getMemory(addr) + '\n');
        _nextCommand(2);
    }
    
    // ----
    // ����������� �������������� ������
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
        
        // ��������� ��� ������ � ������ [ip+2]
        if(_getVarAddr(value) == undefined)
            variables[name] = ip + 2;
        // ������� _�����_ ������, ���������� � ���������� [ip+2]s
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
        if(addr == undefined) _critcalError( _getMemory(ip + 1) + " ����� �� ���������");
        
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
        
        if(lable == undefined) _criticalError( _getMemory(ip+1) + " ����� �� ���������");
        ip = lable;
    }
    
    // toint <var>
    // �������� ���������� var � ������ ����
    var _toint = function() {
        var addr = _checkVariable(ip + 1);
        var newvalue = parseInt(_getMemory(addr));
        
        if(newvalue == NaN)
            _criticalError("������ �������������� " + _getMemory(ip + 1) + "=" + _getVarAddr(addr) + " � ������ ����");
        
        _setMemory(addr, newvalue);
        _nextCommand(2);
    }
    
    //  tofloat <var>
    // �������� ���������� var � ���� � ��������� ������
    var _tofloat = function() {
        var addr = _checkVariable(ip + 1);
        var newvalue = parseFloat(_getMemory(addr));
        
        if(newvalue == undefined)
            _criticalError("������ �������������� " + _getMemory(ip + 1) + "=" + _getVarAddr(addr) + " � ���� float");
        
        _setMemory(addr, newvalue);
        _nextCommand(2);
    }
    
    // ����� �� ���������� ������
    var _exit = function() {
        //WSH.exit();
        return;
    }
    // ��������� ����� ���������� � ������
    // ���� ���������� �� ����������, �� ���������� undefined
    var _getVarAddr = function(varname) {
        return variables[varname];
    }
    
    var _setMemory = function(addr, value) {
        memory[addr] = value;
    }
    
    var _getMemory = function(addr) {
        return memory[addr];
    }
    
    // ������������� ip �� ��������� �������
    // count ���������, ������� ����� � ������ ������� ���������� (��������, ����� ������� ������� �� ��� � ��� �� ���������)
    var _nextCommand = function(count) {
        ip += count;
    }
    
    // ��������� �����, �� ������� ��������� ����� lable
    // ���� ����� ����� �� ����������, �� ��������� undefined
    var _getAddrLable = function(lable) {
        return lablies[lable];
    }
    
    //
    var _criticalError = function(str) {
        WSH.echo(str);
        WSH.quit(); // ��������!
    }
}


// ������ ���
var fso = new ActiveXObject("Scripting.FileSystemObject");
var text_prog = fso.OpenTextFile(WScript.Arguments(0));

var code = "";
while(!text_prog.AtEndOfStream)
    code += text_prog.ReadLine() + " ";
code += "exit";

var vm = new Machine();
vm.Init(code);
vm.Run();