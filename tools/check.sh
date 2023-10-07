deno task checkDeployable
RESULT=$?
status="skip"
if [ $RESULT -eq 0 ]; then
  status="true"
fi
echo "deploy:$status"
echo "deploy=$status" >>$GITHUB_OUTPUT
