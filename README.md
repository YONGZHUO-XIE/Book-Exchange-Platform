# team31 Phase2
## Description 
 * Since most people are not likely to read a book they have finished for the second time, we want to make use of those Idle books on the shelf. The main purpose is to let users post the book they have read online and exchange them for other books offline so that both users can have another book they are interested in without buying it.


## Deployment link:
https://fast-shore-10262.herokuapp.com/

## Key Features and using instructions 
We have completed most features we want in phase 2 with some changes.
For different types of users, the key features are shown below:
 * For admin, here are the main key features:
    * Admin can view and delete users' posts, after login as an administrator, the landing page will show all posts the web application has, the admin can delete by clicking on a particular postcard and clicking the corresponding button 
    * Admin can view and ban users' accounts (different from phase 1 to directly delete a user), use the check box at the top left corner the page will switch from edit post to edit user information.
    * Admin can view the reports of posts from users along with the report reason, after the admin handles the report, the message can be deleted.
    * Admin can change the weekly recommendation book, by clicking the “Edit weekly recommendation” button in the header, then set name, description and upload a picture for that book.

 * For guests that haven't logged in, they can only see the weekly recommendation book post by the administrator.

 * For registered users, here are the main key features:
    * Login / Register
    * Change personal info by clicking the user icon on the top right corner(fill in the corresponding text box, leave the field blank if don’t want to change it)
    * Adding new books to the user’s book list through the “add new book” button in the user profile.
    * There are four tabs on the user landing page
        *  if you press the home button(the blue one), you can only see the posts you made.
        *  The second one is the explore button(orange compass) showing all posts had been posted on this website.
        *  The third inbox button(the green one) all requests you have received or you have sent.
        *  The fourth button(the yellow one) is for adding a post (a post is for describing a book)
     *  There is a menu (three dots) list for each post. You will see a related option of the post depending on the type of the post (yours or others).  For a post that does not belong to the current user, this user can view the information of the book and send a request to exchange the book attached to the post. Users can also report this post to the administrator if the post contains some inappropriate words(access these three functions by clicking the three dots on the top right corner of each post). Users can leave comments by the textbox under the post. For a post that belongs to the current user, the user can delete the post or simply view the related book information of the post.  
     *  For posts belonging to this user, the user can view book information or delete the post(also through three dots) 
     *  In the request tab, there are two kinds of requests, for requests the user received, this user can choose either to accept the request or decline the request. For requests the user sent, the user can cancel the request. (accepting a request will be regarded as the book exchange is successfully completed and the related requests and posts will be deleted)
     * To add a post, click the fourth yellow button and fill in the corresponding information, and choose a book from your booklist.  After you have added any post, your post will appear both on the home page and explore page. 
    *   On the center of the User landing page, there is a search button where you can search for any related post. (the algorithm is by checking if the content appears in the title )

* Note that MongoDB has a limit on storage space so please don’t upload images with too large size (>3MB)
        

## Instructions
 To access the web, use the Deployment link from above;

 Temporarily, there are 3 different user types and 4 different object types in our project:
 * 2 user types are Common User // Administrator:
    * For administrators, their accounts are pre-created, and we set 1 account for testing. 
        * username: admin, 
           password: admin

    * For common users, their accounts are not pre-created, but we have already set 3 accounts for testing.
        * username: user1, password: user1
        * username: user2, password: user2
        * username: user3, password: user3

 


## Mock data in the database
admins:

users:
* user1 has post 2 posts on the web, so you should be able to access it whatever user you have logged in
* user1 has created 2 books for this post, so he can directly use these books for exchange
* user2 has created 1 book for himself, but he hasn’t posted anything
* user3 has created 1 book for himself, and he has posted one post
There are some comments randomly commented by some users, you should see them once you log in. 


## Example of some API routes
 * GET /api/image/:filename -- Return the image with the given filename
 * POST /api/image/upload -- Upload and save an image into database
 * GET /api/user -- Return a list of User object (All users)
 * GET /api/user/:id -- Return a single user by the given id



 * PATCH /api/user/:id -- Modify User information based on req.body(show below)
// {
// "icon": <icon img>
// "email": <users's email>
//  "phonenum": <users's phonenum>
//  "favortype": <users's type of favor>
// }

Check server.js for detailed API documentation. 


## Test locally

first, run npm install directly under file team31
then run node server.js to connect to the database and localhost

after node server.js, test API through postman use localhost:5000/api/…
and test the web app by typing localhost:5000 in the browser
