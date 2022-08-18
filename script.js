const githubInfo = {
    owner: 'melody-data',
    repo: 'stories',
    sub_repo: 'published_stories',
    stories_list: 'stories_list.json'
};

window.onload = function () {
    fetchData();
}

// fetch data through stories_list.json
function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/' + githubInfo.owner + '/' + githubInfo.repo + '/main/' + githubInfo.sub_repo + '/' + githubInfo.stories_list);
        const data = await response.json();
        console.log(data);
        const myData = [];
        for (story of data) {
            let title = story.title;
            console.log(title)
            let file_name = title.replace(/[^\w]/g, '_').toLowerCase() + '_' + story.id + '.html';
            let path = githubInfo.sub_repo + '/' + file_name;
            let author = story.user_name;

            let utcSeconds = parseFloat(story.id);
            let creation_date = new Date(0); // The 0 there is the key, which sets the date to the epoch
            creation_date.setUTCSeconds(utcSeconds);
            console.log(creation_date);
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
    const li = document.createElement('li');
    const a = document.createElement('a');
    const text = title + ' by ' + author + ' created ' + creation_date;
    const aContent = document.createTextNode(text);
    a.setAttribute('href', link);
    a.appendChild(aContent);
    li.appendChild(a);
    return li;
}