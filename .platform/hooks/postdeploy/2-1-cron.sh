#! /bin/sh
RAILS_ENV=production bin/whenever --load-file custom/config/schedule.rb --update-crontab
