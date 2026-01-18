
在 /screen 不要指定 path，直接读取 screen.png，去除 /screepath, /scree/path。

➜  data curl https://ga-win-electron-3456-v1.cicy.de5.net/screen
{"error":"path query parameter is required"}%

remove this error 

------
在 rpc point /screen：首先读取 c:\screen.png 。同时，异步 taskSystemSreen 使用 pyautogui 。如果 c:\screen.png 存在，response 这条消息 。如果不存在，response 404 。

---

in pyautoguiWrite or pyautoguiTpe script do not exec python file pass params, user exec python -e directly
----