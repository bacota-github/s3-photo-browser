#!/bin/bash

mkdir main
mkdir thumb
for i in *.JPG *.jpg; do
    convert -thumbnail 150 $i thumb/$i
    mv $i main/${i}
done
