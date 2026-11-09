# 通过 DepotDownloader 下载旧版 CSGO 客户端与服务端

以 2017 年 2 月 17 的 CSGO 作为示例。

## 1. 通过 SteamDb 获取 manifests

## 2. 下载

### 2.1. 客户端（Windows）

```bash
# 共享内容
DepotDownloader.exe -os windows -validate -dir ./csgo-2017-02-17 -app 730 -depot 731 -manifest 8012081869647305334

# Windows 端二进制文件
DepotDownloader.exe -os windows -validate -dir ./csgo-2017-02-17 -app 730 -depot 732 -manifest 1023957246132556917 -qr
```

### 2.2. 服务端（Linux）

```bash
DepotDownloader -os linux -validate -dir ./csgo-2017-02-17-ds -app 740 -depot 731 -manifest 8012081869647305334
DepotDownloader -os linux -validate -dir ./csgo-2017-02-17-ds -app 740 -depot 740 -manifest 7523640127342642513
```
