
#!/bin/bash

# Get the version from playground/package.json
version=$(jq -r '.version' ./packages/playground/package.json)

# Update the version in packages/example/package.json
jq --arg version "$version" '.dependencies["@signorecello/noir_playground"] = $version' ./packages/example/package.json > temp.json
mv temp.json ./packages/example/package.json

rm -rf temp.json
