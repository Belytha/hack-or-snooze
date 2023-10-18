"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);
  let specialStarClass;
  //since the use is favorited, we want the star to be bolded(fas)
  if(currentUser.isFavorite(story)){
    specialStarClass = "fas";
  }
  //since the use is favorited, we want the star to be unbolded(fas)
  else{
    specialStarClass = "far";
  }
  //if the story is part of the currentUser's ownStories, set trashCanHTML to the trash can html markup
  let trashCanHTML = "";
  if(currentUser.isOwnStory(story)){
    trashCanHTML = "<i class='fas fa-trash'></i>";
  }
  
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="trash">${trashCanHTML}</span>
        <span class="star">
        <i class="${specialStarClass} fa-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//submit's story using the input's values, adding the story to the storyList, and adding the story to the DOM
async function submitStory(evt){
  console.debug("submitStory", evt);
  evt.preventDefault();

  //grabs the values from the inputs and stores their values into variables
  const author = $("#author-name").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  const username = currentUser.username
  const storyData = { title, url, author, username };

  const newStory = await storyList.addStory(currentUser, storyData);

  $storyForm.trigger("reset");
  $storyForm.hide();

  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);

}
$storyForm.on("submit", submitStory);


function handleFavoriteClick(evt){
  console.debug("handle favorite click");
  //gets target
  const $target = $(evt.target);
  
  //gets the clicked button's corresponding storyId
  const targetStoryId = $target.parent().parent().attr("id");

  //next part uses storyId to get whole story
  //if its is in the storyList this works
  let targetStory;
  targetStory = storyList.stories.find(function(story){
    return (story.storyId === targetStoryId);
  });
  //searches favorited stories if story trying to favorite is not on the storyList.
  if(!(targetStory)){
    targetStory = currentUser.favorites.find(function(story){
      return (story.storyId === targetStoryId);
    });
  }//searches ownStories if story trying to favorite is not on the storyList or favorite list
  else if(!(targetStory)){
    targetStory = currentUser.ownStories.find(function(story){
      return (story.storyId === targetStoryId);
    });
  }
  //check to see if story is favorited
  if(currentUser.isFavorite(targetStory)){
    //It is favorited, so it will remove story and update class to far
  currentUser.removeStoryFromFavorites(targetStory);
  $target.attr("class", "far fa-star");
    
  }
  else{
    //it is not favorited, so it will add story and update class to fas
  currentUser.addStoryToFavorites(targetStory);
  $target.attr("class", "fas fa-star");
  }
}

$body.on("click", ".fa-star", handleFavoriteClick);

/** Gets list of favorited stories, generates their HTML, and puts on page. */
function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $allStoriesList.empty();

  //if there are no favorites
  if(currentUser.favorites.length === 0){
    $allStoriesList.append("<p>No favorites added!</p>");
  }
   // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of user's.ownStories, generates their HTML, and puts on page. */
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $allStoriesList.empty();

  //if there are no ownStories
  if(currentUser.ownStories.length === 0){
    $allStoriesList.append("<p>No stories added by user yet!</p>");
  }
// loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
//when a delete icon is clicked
function handleDeleteClick(evt){
  console.debug("handleDeleteClick", evt);
  //gets target
  const $target = $(evt.target);
  const targetStoryId = $target.parent().parent().attr("id");
  //uses storyId to get whole story
  const targetStory = currentUser.ownStories.find(function(story){
    return (story.storyId === targetStoryId);
  });
  //removeFromDom
  $target.parent().parent().remove();
  //removes from API and stories
  currentUser.removeOwnStory(targetStory);

}
$body.on("click", ".fa-trash", handleDeleteClick);