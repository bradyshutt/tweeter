
var createPostButton = document.getElementById('create-post-button')
var createPostCancel = document.getElementById('create-post-cancel')
var createPostBody = document.getElementById('create-post-wrapper')

createPostButton.addEventListener('click', function () {
  createPostButton.style.display = 'none'
  createPostBody.style.display = 'block'
})

createPostCancel.addEventListener('click', function () {
  createPostButton.style.display = 'block'
  createPostBody.style.display = 'none'
})

