#!/bin/sh

CLASPJSON=$(cat <<-END
    {
        "scriptId": "$SCRIPT_ID",
        "rootDir": "$GITHUB_WORKSPACE/src/CLI/"
    }
END
)

echo $CLASPJSON > ~/.clasp.json