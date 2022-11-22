/**
 * [Pagination]
 */ 

/**
 *  1. 포스트 개수가 10 초과 시 페이지 span 생성
 *  2. 페이지 수(포스트 카운트 1의 자리 올림 / 10) 루프 수행
 *    2-1. 루프 내용
 *      - 페이지 버튼 생성
 *      - 페이지 버튼 클릭 이벤트 주입
 *        2-1-1. 이벤트 내용
 *                - 전체 포스트 hidden 추가
 *                - 포스트 카드 엘리먼트를 루프돌며 페이지에 속한 포스트 hidden 제거
 *    (parseInt(totalcnt/10) + 1)
 */
const pagination = () => {
    if(totalcnt > 10) {
        for(i=1; i<=pageCnt; i++) {
        // 페이지 버튼 생성
        const pageTag = document.createElement('span');

        i===1 ? pageTag.setAttribute("class", "posts-page_selected") : 
            pageTag.setAttribute("class", "posts-page");
            
        // 페이지 버튼에 클릭 이벤트 주입
        pageTag.addEventListener("click", function(e) {
            // 전체 포스트 hidden 추가 
            [].forEach.call(postCards, function (postCard) {
            postCard.parentNode.classList.add("hidden")
            });
            
            // 페이지에 해당하는 포스트 hidden 제거
            const start = (e.target.innerText * 10) - 10;
            const end = (e.target.innerText * 10);
            
            for(i=start; i<end; i++) {
                try {
                    postCards[i].parentNode.classList.remove("hidden")
                } catch (e) {}
            }

            // 현재 페이지 버튼 활성화
            const pages = document.getElementById("posts-pages").childNodes;
            for(i=0; i<pages.length; i++) {
            pages[i].classList.replace("posts-page_selected", "posts-page");
            }
            e.target.classList.add("posts-page_selected")
        })
        pageTag.innerHTML = i;

        pages.appendChild(pageTag);
        }
    }
}