#! add this code to tsExpectErrorCommentsCount.sh file
#! bin/bash
grep -r '@ts-expect-error' -h ./src | sed -E 's/^.*\/[*/] | \*\/|,//g' | wc -l