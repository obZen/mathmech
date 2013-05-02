import socket

storage = {}

def parse(line):
    print(line)

def recv(conn, addr):
    file = conn.makefile('r')
    for line in file:
        print(parse(line))

HOST = ''              # Symbolic name meaning all available interfaces
PORT = 22              # Arbitrary non-privileged port
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((HOST, PORT))
s.listen(1)

while True:
    conn, addr = s.accept()
    print('Connected by', addr)
    recv(conn, addr)
    conn.close()