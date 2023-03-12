deno task checkDeployable
RESULT=$?
status="skip"
if [ $RESULT -eq 0 ]; then
  status="deploy"
fi
echo "check:$status"
echo "status=$status" >>$GITHUB_OUTPUT
