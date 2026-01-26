import sys


def print_with_flush(data):
    print(data)
    sys.stdout.flush()


def is_running_through_pyinstaller():
    return hasattr(sys, "_MEIPASS")


def get_assets_folder():
    if is_running_through_pyinstaller():
        return "assets"
    else:
        return "src/resources/assets"
