[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/bpohoriletz/prototype/blob/main/README.md)
[![ua](https://img.shields.io/badge/lang-uk-green.svg)](https://github.com/bpohoriletz/prototype/blob/main/README.UA.md)

## How to run the project

Using Docker on macOS

1. Install `Docker` and `mutagen-compose`
2. Clone project and start containers
```shell
  git clone git@github.com:bpohoriletz/prototype.git
  cd prototype/.devcontainer
  mutagen-compose up -d --build
```
3. Start the project
```shell
  docker ps
9046ae8a6027   dev-db-ruby-3.1.x-rails-7.x.x    "docker-entrypoint.s…" 5 hours ago   Up 5 hours   0.0.0.0:54321->5432/tcp   prototype-prototype_development-1
542d101a168c   ruby-3.1.x-rails-x.x.x           "sleep infinity"       5 hours ago   Up 5 hours   0.0.0.0:3000->3000/tcp    prototype-prototype-1
ca5bedbda262   test-db-ruby-3.1.x-rails-7.x.x   "docker-entrypoint.s…" 5 hours ago   Up 5 hours   0.0.0.0:54322->5432/tcp   prototype-prototype_test-1
ef33b9949941   mutagenio/sidecar:0.13.1         "mutagen-sidecar"      5 hours ago   Up 5 hours                             prototype-mutagen-1

  docker exec -it 542d101a168c bin/bundle
```
where `542d101a168c` identifier of the container with project from the list
