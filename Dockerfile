FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV DISPLAY=:99
ENV NODE_ENV=production

# -----------------------------
# 1. 安装系统依赖（root）
# -----------------------------
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        xvfb \
        xdg-utils \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libdrm2 \
        libgbm1 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libx11-xcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxkbcommon0 \
        libxrandr2 \
        libxss1 \
        ca-certificates \
        curl \
        gnupg && \
    rm -rf /var/lib/apt/lists/*

# -----------------------------
# 2. 安装 Node.js
# -----------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# -----------------------------
# 3. 创建普通用户
# -----------------------------
ARG USERNAME=electron
ARG UID=1000
ARG GID=1000

RUN groupadd --gid $GID $USERNAME && \
    useradd --uid $UID --gid $GID -m $USERNAME && \
     && usermod -aG sudo $USERNAME

# -----------------------------
# 4. 切换用户 & 安装 Electron
# -----------------------------
USER $USERNAME

ENV PATH="/home/${USERNAME}/.npm-global/bin:${PATH}"
RUN mkdir -p /home/${USERNAME}/.npm-global && \
    npm config set prefix '/home/${USERNAME}/.npm-global' && \
    npm cache clean --force

# -----------------------------
# 5. 工作目录
# -----------------------------
WORKDIR /data


# v 1.0.4
# Expose Express port
EXPOSE 3456
COPY --chmod=755 ./entry.sh /entry.sh
ADD --chown=electron:electron ./electron /data


ENTRYPOINT ["/entry.sh"]
