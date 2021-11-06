#!/bin/sh

CLASPJSON=$(cat <<-END
    {
        "scriptId": "$SCRIPT_ID",
        "rootDir": "$GITHUB_WORKSPACE/src/API/"
    }
END
)

echo $CLASPJSON > ~/.clasp.json