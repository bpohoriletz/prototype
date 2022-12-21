#! /bin/sh

tmux new-session \; \send-keys "vim ." Enter \;  \split-window -h \; \select-pane -t 1 \; \send-keys "DISABLE_SPRING=true bin/guard" Enter \; \set -g mouse on \; \resize-pane -R 40 \;
