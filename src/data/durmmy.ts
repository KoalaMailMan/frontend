const dummyData = {
  data: {
    mains: [
      {
        goalId: 0,
        position: 0,
        content: "독서 습관 기르기",
        subs: [
          { goalId: 0, position: 0, content: "매일 30분 읽기" },
          { goalId: 1, position: 1, content: "독서 일지 작성" },
          { goalId: 2, position: 2, content: "다양한 장르 선택" },
          { goalId: 3, position: 3, content: "독서 클럽 참여" },
          { goalId: 4, position: 4, content: "독서 습관 기르기" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "책 추천 받기" },
          { goalId: 6, position: 6, content: "독서 공간 만들기" },
          { goalId: 7, position: 7, content: "월 3권 목표" },
          { goalId: 8, position: 8, content: "독후감 블로그 작성" },
        ],
      },
      {
        goalId: 1,
        position: 1,
        content: "운동으로 건강 관리",
        subs: [
          { goalId: 0, position: 0, content: "주 3회 헬스장" },
          { goalId: 1, position: 1, content: "아침 스트레칭" },
          { goalId: 2, position: 2, content: "계단 이용하기" },
          { goalId: 3, position: 3, content: "운동 일지 작성" },
          { goalId: 4, position: 4, content: "운동으로 건강 관리" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "개인 트레이너 수업" },
          { goalId: 6, position: 6, content: "운동 친구 만들기" },
          { goalId: 7, position: 7, content: "체중 5kg 감량" },
          { goalId: 8, position: 8, content: "마라톤 완주하기" },
        ],
      },
      {
        goalId: 2,
        position: 2,
        content: "새로운 언어 배우기",
        subs: [
          { goalId: 0, position: 0, content: "매일 단어 10개" },
          { goalId: 1, position: 1, content: "회화 스터디 참여" },
          { goalId: 2, position: 2, content: "언어 교환 앱 사용" },
          { goalId: 3, position: 3, content: "드라마로 공부하기" },
          { goalId: 4, position: 4, content: "새로운 언어 배우기" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "원어민 대화 수업" },
          { goalId: 6, position: 6, content: "자격증 취득하기" },
          { goalId: 7, position: 7, content: "해외 여행 계획" },
          { goalId: 8, position: 8, content: "언어 일기 쓰기" },
        ],
      },
      {
        goalId: 3,
        position: 3,
        content: "요리 실력 향상",
        subs: [
          { goalId: 0, position: 0, content: "주 2회 새 요리" },
          { goalId: 1, position: 1, content: "요리 클래스 수강" },
          { goalId: 2, position: 2, content: "레시피 노트 작성" },
          { goalId: 3, position: 3, content: "제철 재료 활용" },
          { goalId: 4, position: 4, content: "요리 실력 향상" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "베이킹 배우기" },
          { goalId: 6, position: 6, content: "친구들에게 대접" },
          { goalId: 7, position: 7, content: "요리 사진 기록" },
          { goalId: 8, position: 8, content: "집들이 파티 열기" },
        ],
      },
      {
        goalId: 4,
        position: 4,
        content: "자기계발과 성장", // 중심 핵심 목표
        subs: [
          { goalId: 0, position: 0, content: "온라인 강의 수강" },
          { goalId: 1, position: 1, content: "멘토 찾기" },
          { goalId: 2, position: 2, content: "일일 회고 작성" },
          { goalId: 3, position: 3, content: "새로운 도전하기" },
          { goalId: 4, position: 4, content: "자기계발과 성장" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "독서 토론 모임" },
          { goalId: 6, position: 6, content: "세미나 참석" },
          { goalId: 7, position: 7, content: "포트폴리오 정리" },
          { goalId: 8, position: 8, content: "목표 점검하기" },
        ],
      },
      {
        goalId: 5,
        position: 5,
        content: "인간관계 개선",
        subs: [
          { goalId: 0, position: 0, content: "가족과 시간 보내기" },
          { goalId: 1, position: 1, content: "친구들과 정기 모임" },
          { goalId: 2, position: 2, content: "새로운 사람들 만나기" },
          { goalId: 3, position: 3, content: "고마움 표현하기" },
          { goalId: 4, position: 4, content: "인간관계 개선" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "경청 실력 기르기" },
          { goalId: 6, position: 6, content: "갈등 해결하기" },
          { goalId: 7, position: 7, content: "네트워킹 이벤트 참석" },
          { goalId: 8, position: 8, content: "소통 스킬 배우기" },
        ],
      },
      {
        goalId: 6,
        position: 6,
        content: "창작 활동 시작",
        subs: [
          { goalId: 0, position: 0, content: "매주 글쓰기" },
          { goalId: 1, position: 1, content: "그림 그리기" },
          { goalId: 2, position: 2, content: "사진 촬영하기" },
          { goalId: 3, position: 3, content: "창작 도구 익히기" },
          { goalId: 4, position: 4, content: "창작 활동 시작" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "작품 전시하기" },
          { goalId: 6, position: 6, content: "창작 모임 참여" },
          { goalId: 7, position: 7, content: "영감 수집하기" },
          { goalId: 8, position: 8, content: "피드백 받기" },
        ],
      },
      {
        goalId: 7,
        position: 7,
        content: "재정 관리 능력",
        subs: [
          { goalId: 0, position: 0, content: "가계부 작성하기" },
          { goalId: 1, position: 1, content: "투자 공부하기" },
          { goalId: 2, position: 2, content: "비상금 모으기" },
          { goalId: 3, position: 3, content: "부업 시작하기" },
          { goalId: 4, position: 4, content: "재정 관리 능력" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "용돈 기입장 쓰기" },
          { goalId: 6, position: 6, content: "재테크 세미나 참석" },
          { goalId: 7, position: 7, content: "불필요한 지출 줄이기" },
          { goalId: 8, position: 8, content: "목표 금액 저축" },
        ],
      },
      {
        goalId: 8,
        position: 8,
        content: "여행과 휴식",
        subs: [
          { goalId: 0, position: 0, content: "국내 여행 계획" },
          { goalId: 1, position: 1, content: "해외 여행 준비" },
          { goalId: 2, position: 2, content: "여행 일지 작성" },
          { goalId: 3, position: 3, content: "현지 문화 체험" },
          { goalId: 4, position: 4, content: "여행과 휴식" }, // 중심 목표 반복
          { goalId: 5, position: 5, content: "맛집 탐방하기" },
          { goalId: 6, position: 6, content: "사진으로 기록" },
          { goalId: 7, position: 7, content: "휴식 시간 확보" },
          { goalId: 8, position: 8, content: "여행 버킷리스트" },
        ],
      },
    ],
  },
};

export default dummyData;
