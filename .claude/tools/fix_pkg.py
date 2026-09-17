import json

p = "/home/user/KapAble/package.json"
s = open(p).read()
s = s.replace(
    '"description": "Free, local, open-source AI app builder",',
    '"description": "KapAble - a local, open-source AI app builder",',
)
s = s.replace('"license": "MIT",', '"license": "Apache-2.0",')
s = s.replace(
    '  "author": {\n    "name": "Will Chen",\n    "email": "willchen90@gmail.com"\n  },',
    '  "author": {\n    "name": "Akshat Sidharth",\n    "email": "akshat.sidharth@kapturecrm.com"\n  },',
)
open(p, "w").write(s)
json.load(open(p))
print("package.json updated and valid")
