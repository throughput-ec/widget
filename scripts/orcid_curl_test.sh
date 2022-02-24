#!/bin/bash
# orcid_curl_test.sh
#
# Check validity of ORCID bearer access token against ORCID
# production via curl, and print curl output.

# check args
if [ $# -eq 0 ] || [ $# -gt 1 ]
    then
        echo "Usage: orcid_curl_test [required: ORCID bearer access token]"
fi

# $1: token, $2: URL
do_curl () {
    curl -i -L -H "Accept: application/json" -H "Authorization: Bearer $1" $2
}

if [ $# -eq 1 ]
    then
        # -e to properly interpret backslash escape sequences like \n
        echo -e "\nChecking ORCID production with token: $1..."
        do_curl $1 "https://orcid.org/oauth/userinfo"
fi

echo ""