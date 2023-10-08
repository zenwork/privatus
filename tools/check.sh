deno task checkDeployable
RESULT=$?
status="skip"
if [ $RESULT -eq 0 ]; then
  status="true"
fi
echo "deployable:$status"
echo "deployable=$status" >>$GITHUB_OUTPUT
