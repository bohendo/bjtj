
# Git workflow

## Key resource:
 - [Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)

## Notes

Two core branches: develop and master. They have an infinite lifespan
 - master is for production-ready code, we should be able to automatically build & deploy whenever there's a new master branch commit
 - develop is where the most up-to-date code lives. Once it hits a stable point, we can merge w master and tag to deploy.

Supporting branches: feature, release, and hotfix. These are temporary and can be removed once they're merged
 - feature branches:
   - Only branch off from develop and only merge back into develop.
   - Branch is named after the feature.
   - These branches keep the develop branch clean enough that several people can be working on features at the same time.
 - release branches:
   - Only branch off from develop but can merge into develop or master.
   - Named `release-1.3.0` or similar.
   - Used to prepare for an upcoming release. New features aren't merged into this branch, it's solely for bug-fixes.
 - hotfix branches
   - Only branch off from master but can merge into develop or master
   - Named `hotfix-1.3.1` or similar
   - Used to fix urgent bugs in production code

Tidbits:
 - use the `--no-ff` flag to prevent fast-forward merges and create new (empty) commit objects, this enables whole-feature rollbacks

