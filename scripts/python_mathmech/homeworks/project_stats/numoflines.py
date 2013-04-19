# Директория
# Подсчитать общее число строк во всех файлах директории (в том числе и во вложенных директориях)
# Use os.walk, Luke
import os, sys

def project_stats(path, exts):
    total_num = 0
    for root, files in iter_filenames(path):
        total_num += total_num_of_lines(get_filenames_with_ext(exts, files), root)
    return total_num

def total_num_of_lines(filenames, root):
    t = 0
    for filename in filenames:
        t += number_of_lines(root + "/" + filename)
    return t

def number_of_lines(filename):
    try:
        stream = open(filename)
        return sum([1 for l in stream])
    except:
        return 0

def iter_filenames(path):
    for root, dirs, files in os.walk(path):
        yield (root, files)

def get_filenames_with_ext(exts, filenames):
    return [x for x in filenames if get_ext(x) in exts]

def get_ext(filename):
    root, ext = os.path.splitext(filename)
    return ext

def main():
    if len(sys.argv) < 3:
        print("numoffiles <direcotry> ext_file1[, ext_file2, [ext_file3 ...]]")
    else:
        if os.path.isdir(sys.argv[1]):
            print("{}".format(project_stats(sys.argv[1], sys.argv[2:])))
        else:
            print("Directory does not exist")

if __name__ == '__main__':
    main()