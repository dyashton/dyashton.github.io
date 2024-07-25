let currSize = 1260;
const PFPs = ["./ELements/PFPs/pfp1.jpg",
            "./ELements/PFPs/pfp2.jpg",
            "./ELements/PFPs/pfp3.jpg",
            "./ELements/PFPs/pfp4.jpg",
            "./ELements/PFPs/pfp5.jpg",
            "./ELements/PFPs/pfp6.jpg",
            "./ELements/PFPs/pfp7.jpg",
            "./ELements/PFPs/pfp8.jpg",
            "./ELements/PFPs/pfp9.jpg",
            "./ELements/PFPs/pfp10.jpg",

            ];
const usernames = ["JohnDoe",
                "JaneDoe",
                "JohnSmith",
                "JaneSmith",
                "JohnJohnson",
                "JaneJohnson",
                "JohnBrown",
                "JaneBrown",
                "JohnWhite",
                "JaneWhite"
                
];
const postContent = ["Elements/PostContent/Content1.jpg",
                    "Elements/PostContent/Content2.jpg",
                    "Elements/PostContent/Content3.jpg",
                    "Elements/PostContent/Content4.jpg",
                    "Elements/PostContent/Content5.jpg",
                    "Elements/PostContent/Content6.jpg",
                    "Elements/PostContent/Content7.jpg",
                    "Elements/PostContent/Content8.jpg",
                    "Elements/PostContent/Content9.jpg",
                    "Elements/PostContent/Content10.jpg"
                    ];
document.addEventListener('DOMContentLoaded', function() {
    const main = document.getElementById('main');
    main.addEventListener('scroll', () => {
        let maxScroll = main.scrollHeight - main.clientHeight;
        if(main.scrollTop/maxScroll> 0.95) {
            makePost();


        }
    });

    window.addEventListener('resize', () => {
        if(window.innerWidth <= 1260){
            if(currSize != 0){
                toggleNavBar();
                toggleSuggested();
                document.getElementById("Logo").src = "Elements/image (1).png";

            }
            currSize = 0;
        }
        else if(window.innerWidth >= 1260 ){
            if(currSize == 0){
                toggleNavBar();
                toggleSuggested();
                document.getElementById("Logo").src = "Elements/instigram.png";
            }
            currSize = 1260;
        }
    });

});

function toggleNavBar(){
        console.log(currSize)
        const hiddens = document.querySelectorAll(".navBarTxt");
            console.log(hiddens);
            hiddens.forEach((hidden) => {
                hidden.classList.toggle("hidden")
            });

}

function toggleSuggested(){
    const suggestedCol = document.getElementById("suggestedCol");
    suggestedCol.classList.toggle("hidden");
}


function makePost(){
    const post = document.createElement('div');
    const header = document.createElement('div');
    const img = document.createElement('img');
    const userTimeLocation = document.createElement('div');
    const userTime = document.createElement('div');
    const postUser = document.createElement('p');
    const postTime = document.createElement('p');
    const postLocation = document.createElement('p');
    const moreOptions = document.createElement('div');
    const postDot1 = document.createElement('div');
    const postDot2 = document.createElement('div');
    const postDot3 = document.createElement('div');
    const postContent = document.createElement('img');
    const interactBookCont = document.createElement('div');
    const postInteractCont = document.createElement('div');
    const heart = document.createElement('img');
    const comment = document.createElement('img');
    const share = document.createElement('img');
    const bookmarkCont =  document.createElement('div');
    const bookmark = document.createElement('img');
    const postLikes = document.createElement('p');
    const postCaption = document.createElement('div');
    const postCaptionUser = document.createElement('p');
    const postCaptionText = document.createElement('p');

    post.className = "post";
    header.className = "postHeader";
    img.className = "postPFP clickable";
    userTimeLocation.className = "user-time-location";
    userTime.className = "user-time";
    postUser.className = "postUser username";
    postTime.className = "Time";
    postLocation.className = "location";
    moreOptions.className = "moreOpt clickable";
    postDot1.className = "dot";
    postDot2.className = "dot";
    postDot3.className = "dot";
    postContent.className = "postContent";
    interactBookCont.className = "interact-bookCont";
    postInteractCont.className = "postInteractCont";
    heart.className = "interaction clickable";
    comment.className = "interaction clickable";
    share.className = "interaction clickable";
    bookmarkCont.className = "bookmarkCont";
    bookmark.className = "bookmark interaction clickable";
    postLikes.className = "numOfLike clickable";
    postCaption.className = "postCaption";
    postCaptionUser.className = "captionUser username clickable";
    postCaptionText.className = "captionText";

    img.src = getPFP();
    postUser.innerHTML = getUsername();
    postTime.innerHTML = `• ${getTime()}h`;
    postLocation.innerHTML = "Nashville, TN";
    postDot1.innerHTML = "•";
    postDot2.innerHTML = "•";
    postDot3.innerHTML = "•";
    postContent.src = getContent();
    heart.src = "Elements/heart.png";
    comment.src = "Elements/chat.png";
    share.src = "Elements/send.png";
    bookmark.src = "Elements/bookmark-white.png";
    postLikes.innerHTML = `${getNumOfLikes()} likes`;
    postCaptionUser.innerHTML = postUser.innerHTML;
    postCaptionText.innerHTML = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, totam ducimus. Assumenda magnam ut, magni tempora eveniet dolor quas! Delectus reprehenderit quos veritatis quasi voluptatibus amet fugiat quod et dolor!";

    post.appendChild(header);
    post.appendChild(postContent);
    post.appendChild(interactBookCont);
    post.appendChild(postLikes);
    post.appendChild(postCaption);

    header.appendChild(img);
    header.appendChild(userTimeLocation);
    header.appendChild(moreOptions);

    userTimeLocation.appendChild(userTime);
    userTimeLocation.appendChild(postLocation);

    userTime.appendChild(postUser);
    userTime.appendChild(postTime);

    moreOptions.appendChild(postDot1);
    moreOptions.appendChild(postDot2);
    moreOptions.appendChild(postDot3);

    interactBookCont.appendChild(postInteractCont);
    interactBookCont.appendChild(bookmarkCont);

    postInteractCont.appendChild(heart);
    postInteractCont.appendChild(comment);
    postInteractCont.appendChild(share);

    bookmarkCont.appendChild(bookmark);

    postCaption.appendChild(postCaptionUser);
    postCaption.appendChild(postCaptionText);

    document.getElementById("postColumn").appendChild(post);

}

function getPFP(){
    let rand = Math.floor(Math.random() * 10);
    console.log(PFPs[rand]);
    return PFPs[rand];
}

function getContent(){
    let rand = Math.floor(Math.random() * 10);
    return postContent[rand];
}

function getNumOfLikes(){
    return Math.floor(Math.random() * 1000);
}

function getUsername(){
    let rand = Math.floor(Math.random() * 10);
    return usernames[rand];
}

function getTime(){
    return Math.floor(Math.random() * 23);
}
