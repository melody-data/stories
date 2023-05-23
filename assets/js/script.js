const githubInfo = {
    owner: 'melody-data',
    repo: 'stories',
    sub_repo: 'published_stories',
    stories_list: 'stories_list.json'
};

window.onload = function () {
    fetchData();
}

document.body.addEventListener('click', function (e) {
    e.target.update && e.target.update();
});

// fetch data through stories_list.json
async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/' + githubInfo.owner + '/' + githubInfo.repo + '/main/' + githubInfo.sub_repo + '/' + githubInfo.stories_list);
        const data = await response.json();
        const myData = [];
        for (story of data) {
            let title = story.title;
            let path = githubInfo.sub_repo + '/story_' + story.id + '.html';
            let author = story.user_name;
            let utcSeconds = parseFloat(story.id);
            let creation_date = new Date(0); // The 0 there is the key, which sets the date to the epoch
            creation_date.setUTCSeconds(utcSeconds);
            myData.push({ title: title, path: path, author: author, creation_date: creation_date.toLocaleDateString() });
        }
        updateList(myData);
    }
    catch (error) {
        console.log('Error: ', error);
    }

}


// update list with new data
const updateList = (data) => {
    const list = document.getElementById('story_list');
    for (story of data) {
        let title = story.title;
        let li = newListElement(title, story.path, story.author, story.creation_date);
        list.appendChild(li);
    }
}

// create the list item for each story title
const newListElement = (title, link, author, creation_date) => {
    // elements
    const li = document.createElement('li');
    const title_el = document.createElement('h4');
    const img = document.createElement('img');
    const auth = document.createElement('span');
    const date = document.createElement('span');
    const a = document.createElement('a');

    // contents
    const read = "Read more";
    const title_text = document.createTextNode(title);
    const dateContent = document.createTextNode(creation_date);
    const authContent = document.createTextNode(author);
    const aContent = document.createTextNode(read);

    title_el.appendChild(title_text);

    img.setAttribute('src', "https://github.com/" + author + ".png")
    img.classList.add('github_avatar');

    auth.classList.add('story_author');
    auth.appendChild(authContent);

    date.appendChild(dateContent);
    date.classList.add('story_date');

    a.appendChild(aContent);
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');

    li.appendChild(img);
    li.appendChild(auth);
    li.appendChild(date);
    li.appendChild(title_el);
    li.appendChild(a);
    li.classList.add('col-md-4');

    return li;
}