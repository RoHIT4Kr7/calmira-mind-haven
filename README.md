npm run dev


git add .
git commit -m "commit 1"
git push origin nitesh-branch

git checkout main
git branch -D nitesh-branch

git checkout -b nitesh-branch


merge in main

git switch main
git pull origin main
git merge nitesh-branch
git push origin main

create new branch
git checkout -b nitesh-branch

git push -u origin nitesh-branch
