# Git Basics for Feature Development

## Introduction

Git is a version control system that allows multiple people to work on the same project without interfering with each other's work. GitHub is a platform that hosts Git repositories and facilitates collaboration.

## Settting Up

1. Install Git
   If you haven't already installed Git, [download and install it](https://git-scm.com/downloads).
2. Set up Git

   After installation, configure your Git with your name and email(used for commit messages):

```
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

3. Clone the Repository
   To get a copy of the repo on your local machine:

```
git clone https://github.com/MichaeTav/CalendarPP.git
```

## Developing a New Feature

1. Checkout to a New Branch

   Before starting your work, create a new branch. This ensure that the `main` or `master` branch remains untouched during development.

   Replace `your-feature-name` with a descriptive name for your feature.

```
git checkout -b feature/your-feature-name
```

2. Make Your Changes

   Now, make the required changes to the code or add new files.

3. Track and Commit Your Changes

   After making changes, track and commit them:

```
# Track all the changed files
git add .

# Commit your changes with a descriptive message
git commit -m "Short description of the changes made"
```

4. Push Your Branch to GitHub
   Once you're satisfied with your changes, push your branch to the GitHub repository:

```
git push origin feature/your-feature-name
```

## Submitting a Pull Request

1. Go to the GitHub page of your repository.
2. You'll see a notification about your recently pushed branch. Click on `Compare & pull request`.
3. Fill in the title and description for your pull request. The title should be short and descriptive. The description should detail the changes you made, why you made them, and any other pertinent details.
4. Click on `Create pull request`.

Your pull request is now awaiting review! Once it's reviewed, it can be merged into the main project.

## General Git Tips:

- Always pull the latest changes from the main branch before creating a new feature branch:

```
git pull origin main
```

- To switch back to the main branch:

```
git checkout main
```

- To check the status of your changes:

```
git status
```
