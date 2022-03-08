import os

files = os.listdir("./static/image")
print(files)


path =".\static\image"
filelist = []
for root, dirs, files in os.walk(path):
    for file in files:
        if(file.endswith(".jpg")):
            print((os.path.join(root,file)).replace(".\static\image\BGAEK\\", ""))
