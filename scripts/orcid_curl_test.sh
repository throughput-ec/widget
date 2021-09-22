#!/bin/bash
# orcid_curl_test.sh
#
# bash script to check validity of ORCID bearer access token against ORCID
# production or sandbox via curl and prints curl output.

# accept 1 or 2 args
if [ $# -eq 0 ] || [ $# -gt 2 ]
    then
        echo "Usage: orcid_curl_test [required: ORCID bearer access token] [optional: -s to use ORCID sandbox]"
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
    else
        if [ $# -eq 2 ] && [ $2 -eq "-s" ]
            then
                echo -e "\nChecking ORCID sandbox with token: $1..."
                do_curl $1 "https://sandbox.orcid.org/oauth/userinfo"
        fi
fi

echo ""