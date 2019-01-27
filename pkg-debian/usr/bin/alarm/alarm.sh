echo "Running Alarm !!! at $(date)"
curl --request POST \
     --url http://localhost:8081/event \
     --header 'content-type: application/json' \
     --data '{
    "kind": "alarm",
    "message": "Salut Nounou"
}'
