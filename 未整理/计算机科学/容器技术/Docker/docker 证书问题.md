[[docker]] 与 [[update-ca-certificates]] 的同步问题

docker 不会即时读取 update-ca-certificates 的结果，update-ca-certificates 若要对 docker 生效，通常需要重启 docker。

如果要即时生效，放在

```txt
/etc/docker/certs.d/your.host.name/ca.crt
```

下

>  ca.crt 是固定名称，不可修改。