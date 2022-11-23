/**
 * [Search]
 */ 
const search = (e) => {
    document.getElementById('posts_list').setHTML(postsHtml);

    // 검색어 가져오기
    let keyword = e.target.value;
    let searchPostCards = [];

    [].forEach.call(document.getElementsByClassName("card-body"), function (postCard) {
        if(postCard.innerText.normalize('NFC').includes(keyword)) {
            searchPostCards.push(postCard);
            postCard.getElementsByClassName('pre-content')[0].setHTML(
                postCard.getElementsByClassName('pre-content')[0].innerHTML.split(keyword).join(`<span class='maching-keyword'>` + keyword + `</span>`)
            );
        }
    });

    totalcnt = searchPostCards.length;
    postCards = searchPostCards;
    pageCnt = totalcnt%10 === 0 ? totalcnt/10 : (parseInt(totalcnt/10) + 1);

    // 검색 결과 요약
    document.getElementById('search-keyword').innerText = keyword;
    document.getElementById('search-count').innerText = totalcnt + '건';
    if(keyword === '') {
        document.getElementById('search-result').classList.add('hidden');
    } else {
        document.getElementById('search-result').classList.remove('hidden');
    }

    // 전체 포스트 hidden
    [].forEach.call(document.getElementsByClassName("card-body"), function (postCard) {
        postCard.parentNode.classList.add("hidden")
    });

    // 기존 페이지 UI 제거
    pages.innerHTML = '';
    pagination();

    // 최신 10개 포스트 보여줌
    for(i=0; i<10; i++) {
        try {
            postCards[i].parentNode.classList.remove("hidden")
        } catch (e) {}
    }
}