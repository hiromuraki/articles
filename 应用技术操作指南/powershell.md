```bash
# https://github.com/PowerShell/PowerShell/releases

sudo mkdir -p /opt/microsoft/powershell/7

sudo tar zxf powershell-*-linux-*.tar.gz -C /opt/microsoft/powershell/7/

sudo chmod +x /opt/microsoft/powershell/7/pwsh

sudo ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh
```
