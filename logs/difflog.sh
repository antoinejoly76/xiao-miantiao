 #!/bin/bash



RELEASE="@R$1"
TEMPFILE="difflog.$RELEASE"
echo  "" >  $TEMPFILE
cd ..
for f in *.html
do
  cat $f | grep $RELEASE >> logs/$TEMPFILE
done

for f in js/*.js
do
  cat $f | grep $RELEASE >> logs/$TEMPFILE
done
