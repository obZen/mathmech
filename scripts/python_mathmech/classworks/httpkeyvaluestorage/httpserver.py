import socket, sys
from threading import Thread
from keyvaluestorage import KeyValueStorage

def runServer(host, port, onAcceptCallback):
    host = host
    port = port
    serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serverSocket.bind((host, port))
    serverSocket.listen(10)

    while True:
        connection, addr = serverSocket.accept()
        Thread(target=onAcceptCallback, args=(connection, addr)).start()


def onAcceptHandler(connection, addr):
    print('Connected by', addr)

    storage = KeyValueStorage('keyValueStorage.txt')
    file = connection.makefile('r')
    for line in file:
        print('From {}: {}'.format(addr, line))
        result = parseCommand(line, storage)
        print(result)
        connection.send(bytes(result + "\n", encoding='utf8'))

def parseCommand(line, storage):
    CommandError = "Command error\n"

    args = line.strip().split(' ')
    if len(args) <= 1 or len(args) >= 4:
        return CommandError

    command = args[0]
    args = args[1:]
    if command == 'push':
        if len(args) != 2:
            return CommandError
        try:
            storage.pushValue(args[0], args[1])
            return "Successful push!"
        except KeyError as keyError:
            return str(keyError)
        except ValueError as valueError:
            return str(valueError)
    elif command == 'get':
        if len(args) != 1:
            return CommandError
        try:
            return storage.getValue(args[0])
        except KeyError as keyError:
            return str(keyError)
    else:
        return CommandError


def main():
    runServer('', 2007, onAcceptHandler)

if __name__ == '__main__':
    main()