
#!/bin/bash

# Update the version in packages/example/package.json
jq --arg version "$version" '.dependencies["@signorecello/noir_playground"] = "workspace:*"' ./packages/example/package.json > temp.json
mv temp.json ./packages/example/package.json

rm -rf temp.json
