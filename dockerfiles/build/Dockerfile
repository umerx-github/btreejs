FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye
ARG UID
ARG GID
ARG USERNAME="myuser"
ARG GROUPNAME="mygroup"
USER root
# Add the group and user with the specified UID and GID
RUN groupadd --gid $GID $GROUPNAME && \
    useradd --uid $UID --gid $GID -m $USERNAME
USER $USERNAME
