import re, os, sys

browser_settings = {
    'Internet Explorer' : ('(compatible; MSIE', r'MSIE\s+([0-9.]+)'),
    'Mozilla Firefox'   : ('Gecko/', r'Gecko/([0-9.]+)'),
    'Opera'             : ('Presto/', r'Version/([0-9.]+)'),
    'Google Chrome'     : ('Chrome/', r'Chrome/([0-9.]+)'),
    'Safari'            : ('Safari/', r'Safari/([0-9.]+)')
}

class ReHelper:
    @staticmethod
    def get_group(re_pattern, string, num_of_group):
        search_obj = re.search(re_pattern, string)
        if search_obj is None:
            return None
        else:
            return search_obj.groups()[num_of_group]

class ParsedLogLineData:
    def __init__(self, url, browser_name, file_name, file_size):
        self.url = url
        self.browser_name = browser_name
        self.file_name = file_name
        self.file_size = file_size

    def __str__(self):
        return "URL: {}; BROWSER_NAME {}; FILE_NAME {}; FILE_SIZE {}".format(self.url, self.browser_name, self.file_name, self.file_size)

class LogParser:
    def __init__(self, browser_settings):
        self.browser_settings = browser_settings

    def __get_browser_name(self, line, settings):
        """
            settings = {
                'Browser name' : ('Browser name in user agent string', 'Regular exp for search browser version in user agent string'),
                ...,
            }
        """
        for key in settings:
            if line.find(settings[key][0]) > -1:
                return key + "(" + ReHelper.get_group(settings[key][1], line, 0) + ")"
        return None

    def parse_line(self, line):
        if line.find('"GET') == -1:
            return None

        parsed_url = ReHelper.get_group(r'"http://([^?#]*?)"', line, 0)
        parsed_file_name = ReHelper.get_group(r'GET\s+([^?]*?)\s+', line, 0)
        if parsed_url is None:
            parsed_url = parsed_file_name
        parsed_file_size = ReHelper.get_group(r'\s+(\d+)$', line, 0)

        return ParsedLogLineData(parsed_url, self.__get_browser_name(line, self.browser_settings), parsed_file_name, parsed_file_size)

class StatisticsHelper:
    @staticmethod
    def read_statistics_from_file(stream):
        statistics = {}
        for line in stream:
            key, value = line.split(':')
            statistics[key] = int(value)
        return statistics

    @staticmethod
    def write_statistics_in_file(stream, statistics):
        for key in statistics:
            stream.write("{}:{}\n".format(key, statistics[key]))

    @staticmethod
    def merge_statistics(new_statistic, old_statistic, merge_value):
        result = {}
        for new_key in new_statistic:
            if new_key in old_statistic:
                result[new_key] = merge_value(int(new_statistic[new_key]), int(old_statistic[new_key]))
            else:
                result[new_key] = new_statistic[new_key]

        for old_key in old_statistic:
            if old_key not in new_statistic:
                result[old_key] = old_statistic[old_key]

        return result

class LogFileStatistic:
    def __init__(self, file_name, temp_file_name, save_period = 1e4, max_lines = None):
        self.__input_file_name = file_name
        self.__save_period = save_period
        self.__temp_file_name = temp_file_name
        self.__temp_for_urls = self.__temp_file_name + "." + "urls"
        open(self.__temp_for_urls, "w+").close()
        self.__temp_for_browsers = self.__temp_file_name + "." + "browsers"
        open(self.__temp_for_browsers, "w+").close()
        self.__temp_for_files = self.__temp_file_name + "." + "files"
        open(self.__temp_for_files, "w+").close()
        self.__parser = LogParser(browser_settings)
        self.__max_lines = max_lines

    __urls = {}
    __browser_names = {}
    __files = {}
    __read_bytes = 0

    def __save_in_file(self, temp_file, new_statistics, merge_value):
        work_stream = open(temp_file, mode="r+")
        old_statistics = StatisticsHelper.read_statistics_from_file(work_stream)
        work_stream = open(temp_file, mode="w+")
        StatisticsHelper.write_statistics_in_file(work_stream, StatisticsHelper.merge_statistics(new_statistics, old_statistics, merge_value))

    def __save_statistic(self):
        print("Read {} bytes of {} ({:.3f}% done)".format(self.__read_bytes, os.path.getsize(self.__input_file_name), (self.__read_bytes / os.path.getsize(self.__input_file_name))*100))

        self.__save_in_file(self.__temp_for_urls, self.__urls, lambda x,y:x+y)
        self.__urls = {}

        self.__save_in_file(self.__temp_for_browsers, self.__browser_names, lambda x,y:x+y)
        self.__browser_names = {}

        self.__save_in_file(self.__temp_for_files, self.__files, lambda x,y: max(x, y))
        self.__files = {}

    def run(self):
        def increment_in_dict(source_dict, key, start_value = 1):
            if key is None:
                return

            if key in source_dict:
                source_dict[key] += 1
            else:
                source_dict[key] = start_value

        with open(self.__input_file_name) as stream:
            count = 0
            total_count = 0

            for stream_line in stream:
                self.__read_bytes += len(stream_line)

                parsed_log_line = self.__parser.parse_line(stream_line)
                if parsed_log_line is None:
                    continue

                increment_in_dict(self.__urls, parsed_log_line.url)
                increment_in_dict(self.__browser_names, parsed_log_line.browser_name)

                if parsed_log_line.file_name not in self.__files:
                    self.__files[parsed_log_line.file_name] = parsed_log_line.file_size

                if count >= self.__save_period:
                    self.__save_statistic()
                    total_count += count
                    count = 0

                if self.__max_lines is not None and total_count >= self.__max_lines:
                    self.__save_statistic()
                    break
                count += 1


def main(log_name, file_for_result):
    statistics = LogFileStatistic(log_name, file_for_result, 1e5)
    statistics.run()

log_name = "C:/Log/access.59G.log/really_big_log.log"
file_for_result = "temp_statistics2.temp"

if len(sys.argv) > 1:
    log_name = sys.argv[1]
if len(sys.argv) > 2:
    file_for_result = sys.argv[2]

if not os.path.isfile(log_name):
    print ("Oh dear...")
else:
    main(log_name, file_for_result)


