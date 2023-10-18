"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//when a user clicks on "submit" nav link
function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  putStoriesOnPage();
  $storyForm.show();

}
$navSubmit.on("click", navSubmitClick);

//when a user clicks on "favorites" nav link
function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoriteStoriesOnPage();

}
$navFavorites.on("click", navFavoritesClick);

//when a user clciks on "my stories" nav link
function navMyStoriesClick(evt){
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}
$navMyStories.on("click", navMyStoriesClick);
