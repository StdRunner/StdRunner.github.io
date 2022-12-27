/**
 * [Search]
 */ 
const search = (e) => {
    // 검색어 가져오기
    let keyword = e.target.value;

    // 검색어가 빈값일 때
    if(keyword === '' || keyword === undefined) {
        return;
    }

    // 전체 포스트 되돌리기
    document.getElementById('posts_list').setHTML(postsHtml);

    // 검색된 포스트 배열
    let searchPostCards = [];

    [].forEach.call(document.getElementsByClassName("card-body"), function (postCard) {
        // if(postCard.innerText.normalize('NFC').includes(keyword)) {
        //     searchPostCards.push(postCard);
        //     postCard.getElementsByClassName('pre-content')[0].setHTML(
        //         postCard.getElementsByClassName('pre-content')[0].innerHTML.split(keyword).join(`<span class='maching-keyword'>` + keyword + `</span>`)
        //     );
        // }
        if(postCard.innerText.normalize('NFC').toLowerCase().includes(keyword.toLowerCase())) {
            // 페이징 대상에 넣기
            searchPostCards.push(postCard);

            // 본문 미리보기 하이라이팅
            // 본문 미리보기, 검색어 소문자화
            let searchText = postCard.getElementsByClassName('pre-content')[0].innerHTML.toLowerCase();
            let searchKey = keyword.toLowerCase();

            // loop 돌며 검색어 index 확보
            let indexes = [];
            // 검색 시작 위치
            let start = 0;
            // 하이라이팅 문자열 길이
            const hilightTextLength = `<span class='maching-keyword'>`.length + `</span>`.length;

            while ((idx = searchText.indexOf(searchKey, start)) !== -1) {
                indexes.push(idx);

                let originText = postCard.getElementsByClassName('pre-content')[0].innerHTML;
                let tempText = '';
                tempText += originText.substring(0, idx);
                tempText += `<span class='maching-keyword'>` + originText.substring(idx, idx+searchKey.length) + `</span>`;
                tempText += originText.substring(idx+searchKey.length);
                postCard.getElementsByClassName('pre-content')[0].innerHTML = tempText;

                tempText = '';
                tempText += searchText.substring(0, idx);
                tempText += `<span class='maching-keyword'>` + searchText.substring(idx, idx+searchKey.length) + `</span>`;
                tempText += searchText.substring(idx+searchKey.length);
                searchText = tempText;

                start = idx + searchKey.length + hilightTextLength + 0;
            }
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