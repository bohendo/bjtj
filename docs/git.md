
# Git workflow

Let's start out by reviewing two popular git branching models: A and B.

## [Git Branching Model A](http://nvie.com/posts/a-successful-git-branching-model/)

 - Philosophy: git merges are powerful & should be heavily utilized to segregate release-ready code from that under development
 - `master` branch contains release-ready code, properly tagged
 - All active development happens on a `development` branch from which more specific feature-branches can split.
 - Feature branches can be pushed to `origin` for collaboration and are merged into `development` when stable.
 - To deploy, a temporary `release` branch splits off `develop` to halt feature additions & focus on bug fixes before merging `release` into `master` for deployment.

## [Git Branching Model B](https://barro.github.io/2016/02/a-succesful-git-branching-model-considered-harmful/)

 - Philosophy: big git merges are dangerous so merges into our primary branch (which everyone expects to be master) should be minimized
 - `master` is the central development branch from which more specific feature-branches can split.
 - Feature branches should never be pushed to `origin`, rather all changes should be shared by rebasing onto `origin/master` and pushing.
 - To deploy, branch of from master and never merge back in. This branch will end with a release tag and any hot-fixes can be cherry-picked back into master.

## This project's branching model

Our git workflow will follow model B more closely than model A because it's simpler and we <3 simplicity.

### Core branch: `master`.

 - Small bug-fixes, version increments, etc can all happen directly on the master branch
 - Heavy development should utilize a feature branch that splits off from master and merges back into master once it's stable
 - Release branches will branch off of master and never merge back in; these release branches are where all of our tags should live

### Supporting branch: `feature`

 - Named after whichever feature is being implemented
 - They only branch off of and are merged back into `master` (aka these feature branches never touch release branches)
 - These should keep the master branch clean enough that several people can be working on features at the same time.
 - Rebase onto master or merge? Can we push feature branches to `origin`? No hard rules here, we trust you to make the decision that best fits the situation.

### Supporting branch: `release`

 - Named `release-1.3.x` or similar. Ends with an x to support multiple tags for multiple hot-fixes.
 - Branches off from master and never merges back in. Ends with a tag like `release-1.3.2`
 - New features are not merged into this branch, it's solely for bug-fixes pre-release or hot-fixes post-release
 - bug-fixes and hot-fixes should be cherry-picked into master as needed

