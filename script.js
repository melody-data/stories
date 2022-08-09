const myData = [];
let lastFetch = '';


window.onload = function () {
    // check timer
    // const today = createTimer();
    const today = '02/02/1999';
    if (localStorage.getItem('timer') !== today) {
        fetchData(myData, lastFetch);
        console.log('fetch');
    } else {
        // get the string from localStorage
        const str = localStorage.getItem('myData');
        // convert string to valid object
        const parsedData = JSON.parse(str);
        updateList(parsedData);
        console.log('update');
    }
}

const githubInfo = {
    owner: 'melody-data',
    repo: 'stories',
    sub_repo: 'published_stories'
};

// fetch data through api call to Githubs
async function fetchData(myData, lastFetch) {
    try {
        const response = await fetch('https://api.github.com/repos/' + githubInfo.owner + '/' + githubInfo.repo + '/contents/' + githubInfo.sub_repo + '/');
        const data = await response.json();
        for (obj in data) {
            let article = data[obj];
            if (article.name.includes('.json')) {
                let getJson = await fetch(article.download_url); // fetch the url for raw json
                let config = await getJson.json();
                let title = config.title;
                let file_name = title.replace(/[^\w]/g, '_').toLowerCase() + '_' + config.id + '.html';
                let path = githubInfo.sub_repo + '/' + file_name;
                myData.push({ title: title, path: path });
            }
        }
        // store data in localStorage
        localStorage.setItem('myData', JSON.stringify(myData));
        // update in var
        updateList(myData);
        // update timer
        lastFetch = createTimer();
        // store timer
        localStorage.setItem('timer', lastFetch);
    } catch (error) {
        console.log('Error: ', error);
    }

}


const createTimer = () => {
    const date = new Date();
    return date.toLocaleDateString();
}

// update list with new data
const updateList = (data) => {
    const list = document.getElementById('story_list');
    for (story of data) {
        let title = story.title;
        let li = newListElement(title, story.path);
        list.appendChild(li);
    }
}

// create the list item for each story title
const newListElement = (title, link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const aContent = document.createTextNode(title);
    a.setAttribute('href', link);
    a.appendChild(aContent);
    li.appendChild(a);
    return li;
}