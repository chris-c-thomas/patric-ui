# node -r esm ./generate-data.js > out.json

field='host_name'
out_file="../data/by-${field}.json"
node -r esm ./parse-data.js "${field}" > out_file
echo "Wrote file to: ${out_file}"
