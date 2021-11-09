# tweeter

Tweeter is a deployed social media website based off existing social media services.

[Visit Tweeter](https://thetweeter.ga)

Tweeter allows users to log-in/sign-up to their own personal profile. From there
users are able to edit their profile and add their own personal touch, including photos and bios.
Users can create new posts, comment on existing posts, as well as like all posts and comments. 
A notification functionality exists to inform users when others are interacting with them.
To navigate site, use the navigation bars or click on usernames, posts, images, notifications, or any button.  

Tweeter is mobile, tablet, and desktop friendly. 

This website is deployed using Apache.

Tech stack: Python, Flask, Javascript, Vue.js, MariaDB, HTML, CSS, and SASS.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

# Pages

### Login/Sign-up
![Login-Page](./src\assets\readmeScreens\tweeterLogin.png)


If user does not have a current valid session token, they will be directed log in. If no account exists, clicking on sign-up will direct user to signup page.

### Home Page

![Home-Page](src\assets\readmeScreens\tweeterHome.png)

Upon successful login user will be taken to home page where they are able to see a summary of their profile. From this page, users can create new posts as text, image, or both. 
The user can also has two options: View all their own posts, or view all posts from users they follow.
The side bar (top navigation bar in mobile and tablet views) privides the user with multiple options:

- A profile button to view their own profile
- A home button to return back to home page
- A discover button to discover posts from all users they do not follow
- A follows button to view users they follow or users who follow them
- A log out button

### Profile Page

![Profile-Page](src\assets\readmeScreens\tweeterProfile.png)

The profile page allows users to view all info about their profile. They also can edit their profile information.

The post view is the same as home, where they can view their own posts or posts from users they follow.

### Other Users Profile Pages

![Others-Page](src\assets\readmeScreens\tweeterOthers.png)

The profile pages of other users allows the user to view all their information as well as view all the other users posts. This page is where the user can choose to follow or unfollow the specified other user. 

### Discover Page

![Discover-Page](src\assets\readmeScreens\tweeterDiscover.png)

The discover page allows the user to view all posts from all users on the site. This page removes all posts from users they are already being followed to allow fully discovery of new content. The discovery page also has a featured post at the top of the page which places a random post in the featured section. 

### Follows Page

![Follows-Page](src\assets\readmeScreens\tweeterFollows.png)

The follows page allows the user to see all users they follow OR to see all users following them. Each user can be clicked and the user will be redirected to the clicked profile page. 

# Features

### Posting

![Posts](src\assets\readmeScreens\tweeterPost.png)

Users have the ability to create new posts from their home page, the posts can include text or images, or both. 

### Likes and Comments

![Likes-Comments](src\assets\readmeScreens\tweeterComments.png)

All posts have an open to click the heart icon to "like" the post. When a post is liked, the heart icon is filled in giving the user an easy way to view previously liked content.

All posts have an option to expand comments to view all comments on the post. Each comment also has the ability to be liked or unliked. 

The user is able to edit their own comments at any time by clicking the edit icon on their own comment. 

### Notifications

![Notifications](src\assets\readmeScreens\tweeterNotes1.png)

The user will get a new notification when other users like their post or comment, comment on their post, follow them, or reply to their comment.
The notifications show up in count beside the users avatar in the side bar (or nav bar in mobile)

![Notifications-Open](src\assets\readmeScreens\tweeterNotes2.png)

When the avatar is clicked, a summary of all notifications will appear on the left side of the screen. When clicking the notification, the user will be taken to the post where the notification has been called. Notifications will change color from dark blue to light blue once the user has seen them. The notifications bubble will also disappear when the user has opened the notification panel. The notifications themselves will not clear until the user specifies (Clear all) at the top of the notification panel.

### Image Views

![Images-View](src\assets\readmeScreens\tweeterImages.png)

All images on the site (profile images, user banner images, and all posts images) are exapndable upon click. This will expand the images for easier view.

# Mobile Views

Some examples of the web site in mobile view

![Mobile-Login](src\assets\readmeScreens\mobileLogin.png)

![Mobile-Home](src\assets\readmeScreens\mobileHome.png)

![Mobile-Discover](src\assets\readmeScreens\mobileDiscover.png)

![Mobile-Comments](src\assets\readmeScreens\mobileComments.png)

![Mobile-Edit](src\assets\readmeScreens\mobileEdit.png)

![Mobile-Notifications](src\assets\readmeScreens\mobileNotes.png)




