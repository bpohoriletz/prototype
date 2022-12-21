#! /bin/sh
rm -f ./app_versions/opening.zip && \
  zip -r ../cloud/app_versions/opening.zip .. opening -x ../cloud/\* ../tmp/\* ../log/\* ../.git/\* ../vendor/bundle/\*
