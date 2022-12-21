## Як запустити проект

Рекомендовано використовувати Докер, хоча можете спробувати і без нього

Докер для macOS

1. Встановіть `Docker` та `mutagen-compose`
2. Завантажте проект і запустіть контейнери
```shell
  git clone git@github.com:bpohoriletz/prototype.git
  cd prototype/.devcontainer
  mutagen-compose up -d --build
```
3. Запустіть сервер
```shell
  docker ps
9046ae8a6027   dev-db-ruby-3.1.x-rails-7.x.x    "docker-entrypoint.s…" 5 hours ago   Up 5 hours   0.0.0.0:54321->5432/tcp   prototype-prototype_development-1
542d101a168c   ruby-3.1.x-rails-x.x.x           "sleep infinity"       5 hours ago   Up 5 hours   0.0.0.0:3000->3000/tcp    prototype-prototype-1
ca5bedbda262   test-db-ruby-3.1.x-rails-7.x.x   "docker-entrypoint.s…" 5 hours ago   Up 5 hours   0.0.0.0:54322->5432/tcp   prototype-prototype_test-1
ef33b9949941   mutagenio/sidecar:0.13.1         "mutagen-sidecar"      5 hours ago   Up 5 hours                             prototype-mutagen-1

  docker exec -it 542d101a168c bin/bundle
```
де `542d101a168c` ідентифікатор контейнера з проектом зі списку
