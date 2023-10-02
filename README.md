# privatus
privacy and digital identity demo app

## Release Process
* create a PR
* use the `changeset` command in the PR to add changelogs
* merge the PR
* use the `changeset version` command on main to create tags and a release PR


## GitHub Actions
### `workflow/create-release.yml`
This action creates a release candidate PR when `changeset version`
is called

### `workflow/deploy.yml`
This action will run ci tests, check if deployment should happen, 
and deploy if required.
