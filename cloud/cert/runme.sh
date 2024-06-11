#! /bin/sh
openssl rsa -in domain.key -text && openssl x509 -inform PEM -in domain.crt
