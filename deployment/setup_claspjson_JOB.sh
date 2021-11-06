#!/bin/sh

CLASPJSON=$(cat <<-END
    {
        "scriptId": "$SCRIPT_ID",
        "rootDir": "$GITHUB_WORKSPACE/src/JOB/"
    }
END
)

echo $CLASPJSON > ~/.clasp.json