# 使用官方 Python 镜像作为基础（推荐指定版本，避免兼容性问题）
FROM python:3.9-slim

# 设置工作目录（后续命令均在此目录执行）
WORKDIR /app

# 安装系统依赖（例如 Gunicorn 需要的编译工具、数据库驱动等）
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件并安装（利用 Docker 缓存层优化构建速度）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码（注意使用 .dockerignore 过滤无关文件）
COPY . .

# 设置环境变量（如 Flask 配置、数据库连接等）
ENV FLASK_APP=app.py
# 或 development
ENV FLASK_ENV=production  
# 根据 CPU 核心数调整
ENV GUNICORN_WORKERS=4    

# 暴露端口（与 Gunicorn 监听的端口一致）
EXPOSE 8000

# 启动命令（直接运行 Gunicorn，替代 systemctl）
CMD ["gunicorn", \
    "--bind", "0.0.0.0:8000", \
    # 默认 4 个 worker
    "--workers", "${GUNICORN_WORKERS:-4}", \ 
    # 超时时间（秒）
    "--timeout", "120", \                    
    # 访问日志输出到 stdout
    "--access-logfile", "-", \               
    # 错误日志输出到 stderr
    "--error-logfile", "-", \                
    # 模块名:应用实例
    "app:app"]                               
